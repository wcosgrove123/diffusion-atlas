#!/usr/bin/env python3
"""Clip aourednik/historical-basemaps world files to the Africa frame.

Reads  data/geometry/raw/aourednik/world_<year>.geojson   (originals, never modified)
Writes data/geometry/africa/aourednik_<year>.geojson       (clipped, GPL-3.0 derived data)
       data/geometry/africa/aourednik_places.geojson       (settlement points in the frame)
       data/geometry/africa/aourednik_inventory.json       (per-year feature list with areas)

Frame: lon -20..60, lat -36..40 (Africa plus the Iberian and Arabian margins).

Usage: python3 tools/extract_africa.py [--years 1200 1279 ...] [--report]
Requires shapely>=2 and pyproj (pip install --break-system-packages shapely pyproj).
"""
import argparse
import json
from pathlib import Path

import numpy as np
import shapely
from pyproj import Transformer
from shapely.geometry import box, mapping, shape
from shapely.ops import unary_union
from shapely.validation import make_valid

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data/geometry/raw/aourednik"
OUT = ROOT / "data/geometry/africa"
BBOX = (-20.0, -36.0, 60.0, 40.0)  # minx, miny, maxx, maxy
DEFAULT_YEARS = [1000, 1100, 1200, 1279, 1300, 1400, 1492, 1500, 1530]
KEEP_PROPS = ["NAME", "ABBREVN", "SUBJECTO", "PARTOF", "BORDERPRECISION"]

# World Mollweide (equal area) for rough km2.
_to_eq = Transformer.from_crs("EPSG:4326", "ESRI:54009", always_xy=True)


def area_km2(geom):
    if geom.is_empty:
        return 0.0
    eq = shapely.transform(geom, lambda xy: np.column_stack(_to_eq.transform(xy[:, 0], xy[:, 1])))
    return eq.area / 1e6


def polygonal(geom):
    """Keep only polygon parts (clipping can leave lines/points on the frame edge)."""
    if geom.geom_type in ("Polygon", "MultiPolygon"):
        return geom
    if geom.geom_type == "GeometryCollection":
        parts = [g for g in geom.geoms if g.geom_type in ("Polygon", "MultiPolygon")]
        if not parts:
            return None
        return unary_union(parts)
    return None


def clip_year(year, frame, min_km2):
    src = RAW / f"world_{year}.geojson"
    data = json.loads(src.read_text(encoding="utf-8"))
    feats, inv, dropped = [], [], 0
    for i, f in enumerate(data["features"]):
        if not f.get("geometry"):
            continue
        g = shape(f["geometry"])
        if not g.is_valid:
            g = make_valid(g)
        if not g.intersects(frame):
            continue
        clipped = polygonal(g.intersection(frame))
        if clipped is None or clipped.is_empty:
            continue
        p = f.get("properties") or {}
        full_km2 = area_km2(g)
        clip_km2 = area_km2(clipped)
        if clip_km2 < min_km2:  # degenerate coastline slivers in the source
            dropped += 1
            continue
        props = {k: p.get(k) for k in KEEP_PROPS}
        props.update({
            "year": year,
            "src_index": i,
            "area_km2": round(clip_km2),
            "area_full_km2": round(full_km2),
            "clipped": clip_km2 < full_km2 * 0.995,
        })
        feats.append({"type": "Feature", "properties": props, "geometry": mapping(clipped)})
        c = clipped.representative_point()
        inv.append({**props, "label_pt": [round(c.x, 2), round(c.y, 2)],
                    "bounds": [round(v, 1) for v in clipped.bounds]})
    OUT.mkdir(parents=True, exist_ok=True)
    out = {
        "type": "FeatureCollection",
        "name": f"aourednik_{year}_africa",
        "license": "GPL-3.0 (derived from aourednik/historical-basemaps)",
        "source": f"https://github.com/aourednik/historical-basemaps/blob/master/geojson/world_{year}.geojson",
        "bbox": list(BBOX),
        "dropped_slivers": dropped,
        "features": feats,
    }
    (OUT / f"aourednik_{year}.geojson").write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    return inv


def clip_places(frame):
    src = RAW / "places.geojson"
    data = json.loads(src.read_text(encoding="utf-8"))
    feats = []
    for f in data["features"]:
        g = f.get("geometry")
        if not g or g.get("type") != "Point":
            continue
        x, y = g["coordinates"][:2]
        if not (BBOX[0] <= x <= BBOX[2] and BBOX[1] <= y <= BBOX[3]):
            continue
        p = f.get("properties") or {}
        props = {k: p.get(k) for k in ("name", "name.en", "inhabitedSince", "inhabitedUntil",
                                        "civilizations", "wikidata", "wikipedia")}
        feats.append({"type": "Feature", "properties": props, "geometry": g})
    feats.sort(key=lambda f: (f["geometry"]["coordinates"][1] * -1))
    out = {"type": "FeatureCollection", "name": "aourednik_places_africa",
           "license": "GPL-3.0 (derived from aourednik/historical-basemaps)", "features": feats}
    (OUT / "aourednik_places.geojson").write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    return [{**f["properties"], "lon": round(f["geometry"]["coordinates"][0], 3),
             "lat": round(f["geometry"]["coordinates"][1], 3)} for f in feats]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--years", type=int, nargs="*", default=DEFAULT_YEARS)
    ap.add_argument("--min-km2", type=float, default=1.0,
                    help="drop clipped parts smaller than this (source has many zero-area slivers)")
    ap.add_argument("--report", action="store_true", help="print the inventory as text")
    a = ap.parse_args()
    frame = box(*BBOX)
    inventory = {}
    for y in a.years:
        inventory[str(y)] = clip_year(y, frame, a.min_km2)
    places = clip_places(frame)
    (OUT / "aourednik_inventory.json").write_text(
        json.dumps({"bbox": list(BBOX), "years": inventory, "places": places},
                   ensure_ascii=False, indent=1), encoding="utf-8")
    if a.report:
        for y, rows in inventory.items():
            print(f"\n== {y} ({len(rows)} features)")
            for r in sorted(rows, key=lambda r: -r["area_km2"]):
                print(f"  {str(r['NAME']):38} | SUBJ={str(r['SUBJECTO']):28} | PARTOF={str(r['PARTOF']):20} "
                      f"| BP={r['BORDERPRECISION']} | {r['area_km2']:>10,} km2"
                      f"{' (clipped from ' + format(r['area_full_km2'], ',') + ')' if r['clipped'] else ''}"
                      f" | pt={r['label_pt']} bounds={r['bounds']}")
        print(f"\n== places in frame: {len(places)}")
        for p in places:
            print(f"  {p['name']!s:30} {p['lat']:>7} {p['lon']:>7}  since={p['inhabitedSince']} until={p['inhabitedUntil']}")


if __name__ == "__main__":
    main()
