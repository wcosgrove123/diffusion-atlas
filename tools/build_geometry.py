#!/usr/bin/env python3
"""Bundle a module's map geometry into one file the app loads.

Reads  data/geometry/base/<module>/*.geojson     (Natural Earth, from tools/extract_base.py)
       data/geometry/polity-shapes.yaml           (how each polity polygon is made: methods A, E, H)
       data/geometry/<module>/aourednik_<year>.geojson (starting shapes for methods A and E)
Writes data/geometry/polities/<place-id>.geojson (one feature per shape, clipped to the module's land)
       data/build/<module>-geo.json        (frame, polities, and the name of the base geography file)
       data/build/<module>-base.json       (every base layer in one file, each feature tagged with its layer; the
                                            map's worker fetches and parses it itself, off the page's main thread,
                                            and one source means the map redraws fewer times while it loads)

Every polity feature must carry {place_id, year_from, year_to, method: A|E|H, basis} (docs/build-plan.md).

Usage: python3 tools/build_geometry.py africa
"""
import json
import math
import sys

import shapely.affinity
import yaml
from shapely import make_valid
from shapely.geometry import MultiPolygon, Point, Polygon, mapping, shape
from shapely.geometry.polygon import orient
from shapely.ops import unary_union

from modules import ROOT, load_frame

BASE_LAYERS = ["land", "rivers", "lakes", "playas"]
POLITY_PROPS = ["place_id", "year_from", "year_to", "method", "basis"]
# Optional per-shape style the app reads: "nomadic" draws a hatched sphere, not a state (geometry-audit 5, Tuareg).
ZONES = ("nomadic",)
KM_PER_DEG = 111.0
SHAPES = ROOT / "data/geometry/polity-shapes.yaml"
# Shapes are zones, not borders: drop detail finer than about 5 km and round to about 100 m.
SIMPLIFY_DEG = 0.05
DECIMALS = 3
MIN_PART_DEG2 = 0.08
COAST_SMOOTH_DEG = 0.07


def _round(coords):
    if isinstance(coords[0], (int, float)):
        return [round(c, DECIMALS) for c in coords]
    return [_round(c) for c in coords]


def aourednik_shape(module, year, name):
    path = ROOT / "data/geometry" / module / f"aourednik_{year}.geojson"
    feats = [f for f in json.loads(path.read_text(encoding="utf-8"))["features"]
             if (f.get("properties") or {}).get("NAME") == name]
    if not feats:
        raise SystemExit(f"{path.name}: no feature named {name!r}")
    return unary_union([shape(f["geometry"]) for f in feats])


def make_shape(module, place_id, spec, land):
    method = spec.get("method")
    edits = [k for k in ("remove", "add", "keep") if spec.get(k)]
    if method in ("A", "E"):
        src = spec.get("from") or {}
        geom = aourednik_shape(module, src["year"], src["name"])
        if method == "A" and edits:
            raise SystemExit(f"{place_id}: method A uses aourednik as is; editing it makes it method E")
        if method == "E" and not edits:
            raise SystemExit(f"{place_id}: method E must edit the aourednik shape (remove, add or keep)")
        if spec.get("keep"):
            geom = geom.intersection(Polygon(spec["keep"]))
        for ring in spec.get("remove") or []:
            geom = geom.difference(Polygon(ring))
        for ring in spec.get("add") or []:
            geom = unary_union([geom, Polygon(ring)])
    elif method == "H":
        if spec.get("outline"):
            geom = Polygon(spec["outline"])
            if not geom.is_valid:
                raise SystemExit(f"{place_id}: hand-drawn outline crosses itself")
        elif spec.get("point") and spec.get("buffer_km"):
            # A town with a small coastal buffer (geometry-audit 5, Swahili polities), stretched for latitude.
            lon, lat = spec["point"]
            r = float(spec["buffer_km"]) / KM_PER_DEG
            geom = shapely.affinity.scale(Point(lon, lat).buffer(r, quad_segs=6), 1 / max(0.2, math.cos(math.radians(lat))), 1)
        else:
            raise SystemExit(f"{place_id}: method H needs an outline, or a point with buffer_km")
    else:
        raise SystemExit(f"{place_id}: method must be A, E, or H")
    if spec.get("zone") and spec["zone"] not in ZONES:
        raise SystemExit(f"{place_id}: zone must be one of {ZONES}")
    if spec.get("smooth"):
        r = float(spec["smooth"])
        # Close then open: rounds inside and outside corners, including the straight cuts of an edit.
        geom = geom.buffer(r, quad_segs=4).buffer(-2 * r, quad_segs=4).buffer(r, quad_segs=4)
    geom = geom.intersection(land).simplify(SIMPLIFY_DEG, preserve_topology=True)
    if spec.get("point"):
        # A coastal buffer keeps only its island or shore part; no size floor for it.
        parts = [orient(Polygon(g.exterior), 1.0) for g in getattr(geom, "geoms", [geom]) if g.geom_type == "Polygon"]
        if not parts:
            raise SystemExit(f"{place_id}: coastal buffer finds no land")
        geom = parts[0] if len(parts) == 1 else MultiPolygon(parts)
        props = {"place_id": place_id, "year_from": spec["year_from"], "year_to": spec.get("year_to"),
                 "method": method, "basis": " ".join(spec["basis"].split())}
        g = mapping(geom)
        return {"type": "Feature", "properties": props, "geometry": {"type": g["type"],
                                                                      "coordinates": _round(g["coordinates"])}}
    # Cuts and the coastline leave slivers; a zone has no use for parts smaller than about 30 x 30 km.
    # Zones have no holes (estuaries and lagoons cut into them otherwise).
    parts = [Polygon(g.exterior) for g in getattr(geom, "geoms", [geom])
             if g.geom_type == "Polygon" and g.area >= MIN_PART_DEG2]
    # Outer rings counter-clockwise (RFC 7946), so the app can offset the court ring to the inside.
    parts = [orient(g, 1.0) for g in parts]
    geom = parts[0] if len(parts) == 1 else MultiPolygon(parts)
    if geom.is_empty:
        raise SystemExit(f"{place_id}: shape is empty after clipping to land")
    props = {"place_id": place_id, "year_from": spec["year_from"], "year_to": spec.get("year_to"),
             "method": method, "basis": " ".join(spec["basis"].split())}
    if spec.get("zone"):
        props["zone"] = spec["zone"]
    g = mapping(geom)
    return {"type": "Feature", "properties": props, "geometry": {"type": g["type"],
                                                                  "coordinates": _round(g["coordinates"])}}


def write_polities(module, land):
    """Build data/geometry/polities/<place-id>.geojson from polity-shapes.yaml for this module."""
    if not SHAPES.exists():
        return
    doc = yaml.safe_load(SHAPES.read_text(encoding="utf-8")) or {}
    if doc.get("module") != module:
        return
    pdir = ROOT / "data/geometry/polities"
    pdir.mkdir(parents=True, exist_ok=True)
    # Clip to a coast with estuaries and creeks narrower than about 15 km closed, so a zone's edge follows the
    # coast without fraying into every inlet. It stays within a few km of the Natural Earth coastline.
    land = land.buffer(COAST_SMOOTH_DEG, quad_segs=2).buffer(-COAST_SMOOTH_DEG, quad_segs=2)
    for place_id, specs in (doc.get("polities") or {}).items():
        feats = [make_shape(module, place_id, s, land) for s in specs]
        spans = sorted((f["properties"]["year_from"], f["properties"]["year_to"]) for f in feats)
        for (a0, a1), (b0, _) in zip(spans, spans[1:]):
            if a1 is None or a1 > b0:
                raise SystemExit(f"{place_id}: shapes {a0}-{a1} and {b0}- overlap in time")
        fc = {"type": "FeatureCollection", "features": feats}
        (pdir / f"{place_id}.geojson").write_text(json.dumps(fc, ensure_ascii=False, indent=1) + "\n",
                                                  encoding="utf-8")


def load_polities():
    pdir = ROOT / "data/geometry/polities"
    feats = []
    for path in sorted(pdir.glob("*.geojson")) if pdir.exists() else []:
        for f in json.loads(path.read_text(encoding="utf-8")).get("features") or []:
            props = f.get("properties") or {}
            missing = [k for k in POLITY_PROPS if k not in props]
            if missing:
                raise SystemExit(f"{path.name}: feature lacks {', '.join(missing)}")
            if props["method"] not in ("A", "E", "H"):
                raise SystemExit(f"{path.name}: method must be A, E, or H")
            feats.append(f)
    return feats


def main(module):
    frame = load_frame(module)
    bdir = ROOT / "data/geometry/base" / module
    base = {}
    for name in BASE_LAYERS:
        path = bdir / f"{name}.geojson"
        if not path.exists():
            raise SystemExit(f"missing {path}; run python3 tools/extract_base.py {module}")
        fc = json.loads(path.read_text(encoding="utf-8"))
        base[name] = {"type": "FeatureCollection", "features": fc["features"]}
    # make_valid: the coarse context land outside the bbox has rings that touch themselves.
    write_polities(module, unary_union([make_valid(shape(f["geometry"])) for f in base["land"]["features"]]))
    outdir = ROOT / "data/build"
    outdir.mkdir(parents=True, exist_ok=True)
    base_file = f"{module}-base.json"
    tagged = [{**f, "properties": {**(f.get("properties") or {}), "layer": name}}
              for name, fc in base.items() for f in fc["features"]]
    (outdir / base_file).write_text(json.dumps({"type": "FeatureCollection", "features": tagged}, ensure_ascii=False,
                                               separators=(",", ":")), encoding="utf-8")
    for old in outdir.glob(f"{module}-base-*.json"):
        old.unlink()
    out = {
        "module": module,
        "frame": frame,
        "attribution": ["Natural Earth (public domain)"],
        "base": base_file,
        "polities": {"type": "FeatureCollection", "features": load_polities()},
    }
    if any(f["properties"]["method"] in ("A", "E") for f in out["polities"]["features"]):
        out["attribution"].append("aourednik/historical-basemaps (GPL-3.0), modified")
    path = outdir / f"{module}-geo.json"
    path.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote data/build/{module}-geo.json ({path.stat().st_size / 1024:.0f} KB, "
          f"{len(out['polities']['features'])} polity features)")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "africa")
