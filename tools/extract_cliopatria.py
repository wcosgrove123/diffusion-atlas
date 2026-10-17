#!/usr/bin/env python3
"""Clip the Cliopatria polity borders (Seshat Global History Databank, CC BY 4.0) to a module's frame and years.

Reads  data/geometry/raw/cliopatria/cliopatria.geojson.zip   (original, never modified; tools/fetch_geometry.sh)
Writes data/geometry/<module>/cliopatria.geojson              (polities whose centre is in the frame and whose
                                                               years overlap the module's, simplified)
       data/geometry/<module>/cliopatria_inventory.json       (name, years, area, bounds per feature)

Only Type POLITY rows are kept (RELATION rows are allegiance and union overlays). Each feature keeps Cliopatria's
Name, FromYear, ToYear (inclusive), Wikidata, Wikipedia and SeshatID, plus area_km2 and clipped. Attribution:
Cliopatria, Seshat Global History Databank, CC BY 4.0 (https://github.com/Seshat-Global-History-Databank/cliopatria).

Usage: python3 tools/extract_cliopatria.py africa [--pad-years 60] [--simplify 0.02]
"""
import argparse
import io
import json
import zipfile

import numpy as np
import shapely
from pyproj import Transformer
from shapely.geometry import box, mapping, shape
from shapely.validation import make_valid

from modules import ROOT, load_frame

RAW = ROOT / "data/geometry/raw/cliopatria/cliopatria.geojson.zip"
KEEP = ["Name", "FromYear", "ToYear", "Wikidata", "Wikipedia", "SeshatID"]
_to_eq = Transformer.from_crs("EPSG:4326", "ESRI:54009", always_xy=True)


def area_km2(geom):
    if geom.is_empty:
        return 0.0
    eq = shapely.transform(geom, lambda xy: np.column_stack(_to_eq.transform(xy[:, 0], xy[:, 1])))
    return eq.area / 1e6


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("module")
    ap.add_argument("--pad-years", type=int, default=60, help="keep polities whose years come within this many years of the frame")
    ap.add_argument("--simplify", type=float, default=0.02, help="simplification tolerance in degrees (about 2 km)")
    args = ap.parse_args()
    frame = load_frame(args.module)
    w, s, e, n = frame["bbox"]
    y0, y1 = frame["start"] - args.pad_years, frame["end"] + args.pad_years
    if not RAW.exists():
        raise SystemExit(f"missing {RAW}; run bash tools/fetch_geometry.sh")
    with zipfile.ZipFile(RAW) as z:
        name = [m for m in z.namelist() if m.endswith(".geojson")][0]
        fc = json.load(io.TextIOWrapper(z.open(name), encoding="utf-8"))
    frame_box = box(w, s, e, n)
    out, inv = [], []
    for f in fc["features"]:
        p = f.get("properties") or {}
        if p.get("Type") != "POLITY" or p.get("FromYear") is None or p.get("ToYear") is None:
            continue
        if p["ToYear"] < y0 or p["FromYear"] > y1:
            continue
        geom = make_valid(shape(f["geometry"]))
        c = geom.centroid
        if not frame_box.contains(c):
            continue
        clipped = geom.intersection(frame_box)
        if clipped.is_empty:
            continue
        simple = clipped.simplify(args.simplify, preserve_topology=True)
        props = {k: p.get(k) for k in KEEP}
        props["area_km2"] = round(area_km2(simple))
        props["clipped"] = not clipped.equals(geom)
        props["source"] = "cliopatria"
        out.append({"type": "Feature", "properties": props, "geometry": mapping(simple)})
        inv.append({**props, "bounds": [round(v, 2) for v in simple.bounds]})
    out.sort(key=lambda f: (f["properties"]["Name"] or "", f["properties"]["FromYear"]))
    inv.sort(key=lambda r: (r["Name"] or "", r["FromYear"]))
    outdir = ROOT / "data/geometry" / args.module
    (outdir / "cliopatria.geojson").write_text(json.dumps({
        "type": "FeatureCollection",
        "license": "CC BY 4.0: Cliopatria, Seshat Global History Databank, https://github.com/Seshat-Global-History-Databank/cliopatria; clipped and simplified",
        "features": out,
    }, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (outdir / "cliopatria_inventory.json").write_text(json.dumps(inv, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote data/geometry/{args.module}/cliopatria.geojson: {len(out)} polity shapes, "
          f"{(outdir / 'cliopatria.geojson').stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
