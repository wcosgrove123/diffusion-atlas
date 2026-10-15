#!/usr/bin/env python3
"""Clip Natural Earth physical layers to a module's view box (frame plus view_margin) for the base map.

Reads  data/geometry/raw/naturalearth/ne_10m_*.geojson   (from tools/fetch_geometry.sh; gitignored)
Writes data/geometry/base/<module>/{land,rivers,lakes,playas}.geojson  (committed; public domain)

The coastline is drawn from the land polygons' outline in the app, so there is no separate coastline file.

Choices (docs/geometry-audit.md, section 1):
- Lakes: drop modern reservoirs (featurecla Reservoir) and the post-drought Lake Chad remnant; use the
  ne_10m_lakes_historic Lake Chad instead, marked historic: true.
- Rivers: drop canals (Suez, Ismailiya, Gharraf).
- Inside the module bbox, lines are simplified by 0.015 degrees (about 1.5 km); outside it (context only), 6x more.
- Rivers and salt pans are kept only where they touch the module bbox.
  Coordinates are rounded to 3 decimals to keep the download small.

Usage: python3 tools/extract_base.py [module] [--tolerance 0.01]
Requires shapely>=2.
"""
import argparse
import json
from pathlib import Path

from shapely.geometry import MultiLineString, MultiPolygon, box, mapping, shape
from shapely.ops import unary_union
from shapely.validation import make_valid

from modules import ROOT, load_frame, view_box

RAW = ROOT / "data/geometry/raw/naturalearth"
SEAM_EPS = 0.01  # degrees; see clip()
OUTER_FACTOR = 6  # simplification multiplier outside the module frame (context only)
DROP_RIVERS = {"Suez Canal", "Ismailiya Canal", "Gharraf Canal"}


def rounded(obj, nd=3):
    if isinstance(obj, float):
        return round(obj, nd)
    if isinstance(obj, (list, tuple)):
        return [rounded(v, nd) for v in obj]
    if isinstance(obj, dict):
        return {k: rounded(v, nd) for k, v in obj.items()}
    return obj


def load(name):
    path = RAW / f"{name}.geojson"
    if not path.exists():
        raise SystemExit(f"missing {path}; run bash tools/fetch_geometry.sh first")
    return json.loads(path.read_text(encoding="utf-8"))["features"]


def _keep_kind(geom, kinds):
    """Drop parts of the wrong dimension (clipping can leave points or slivers on the box edge)."""
    if geom.is_empty:
        return None
    parts = list(geom.geoms) if hasattr(geom, "geoms") else [geom]
    parts = [g for g in parts if g.geom_type.replace("Multi", "") in kinds and not g.is_empty]
    if not parts:
        return None
    flat = []
    for g in parts:
        flat.extend(g.geoms if hasattr(g, "geoms") else [g])
    if "Polygon" in kinds:
        return make_valid(MultiPolygon(flat) if len(flat) > 1 else flat[0])
    return MultiLineString(flat) if len(flat) > 1 else flat[0]


def clip(features, frame, view, tol, keep, kinds, extra=None, inside_only=False):
    """Clip to the view box. Inside the module frame simplify by tol; outside it, by OUTER_FACTOR * tol
    (context only, so the download stays small). inside_only drops features that never touch the frame."""
    outer = view.difference(frame)
    out = []
    for f in features:
        g = f.get("geometry")
        if not g:
            continue
        geom = shape(g)
        if not geom.is_valid:
            geom = make_valid(geom)
        if not geom.intersects(frame if inside_only else view):
            continue
        # Simplify first, then cut at the bbox edge: both pieces then meet on the same straight line.
        in_view = _keep_kind(geom.intersection(view), kinds)
        if in_view is None:
            continue
        pieces = []
        for region, t in ((frame, tol), (outer, tol * OUTER_FACTOR)):
            if in_view.intersects(region):
                part = _keep_kind(in_view.simplify(t, preserve_topology=True).intersection(region), kinds)
                if part is not None:
                    pieces.append(part)
        if not pieces:
            continue
        if "Polygon" in kinds and len(pieces) > 1:
            # The detailed and coarse pieces no longer share an exact edge after simplifying. Overlap them by
            # SEAM_EPS before merging and shrink back after, or the outline (drawn as the coastline) shows a
            # straight seam along the module bbox edge.
            pieces = [unary_union([pc.buffer(SEAM_EPS, join_style="mitre") for pc in pieces]).buffer(-SEAM_EPS, join_style="mitre")]
        merged = _keep_kind(unary_union(pieces) if "Polygon" in kinds else
                            MultiLineString([ln for pc in pieces for ln in (pc.geoms if hasattr(pc, "geoms") else [pc])]),
                            kinds)
        if merged is None:
            continue
        p = f.get("properties") or {}
        props = {k: p.get(k) for k in keep if p.get(k) is not None}
        if extra:
            props.update(extra)
        out.append({"type": "Feature", "properties": props, "geometry": rounded(mapping(merged))})
    return out


def write(outdir, name, feats, note):
    fc = {"type": "FeatureCollection", "name": name,
          "license": "Public domain (Natural Earth, naturalearthdata.com)", "note": note, "features": feats}
    path = outdir / f"{name}.geojson"
    path.write_text(json.dumps(fc, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"  {path.relative_to(ROOT)}: {len(feats)} features, {path.stat().st_size / 1024:.0f} KB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("module", nargs="?", default="africa")
    ap.add_argument("--tolerance", type=float, default=0.015)
    a = ap.parse_args()
    fr = load_frame(a.module)
    frame = box(*fr["bbox"])
    view = box(*view_box(fr))
    outdir = ROOT / "data/geometry/base" / a.module
    outdir.mkdir(parents=True, exist_ok=True)
    tol = a.tolerance
    print(f"view box {view_box(fr)}, tolerance {tol}")

    write(outdir, "land", clip(load("ne_10m_land"), frame, view, tol, [], {"Polygon"}),
          "ne_10m_land clipped to the view box")

    rivers = [f for f in load("ne_10m_rivers_lake_centerlines")
              if (f["properties"].get("name") or "") not in DROP_RIVERS
              and "canal" not in (f["properties"].get("featurecla") or "").lower()]
    write(outdir, "rivers", clip(rivers, frame, view, tol, ["name", "scalerank", "min_zoom"], {"LineString"},
                                 inside_only=True),
          "ne_10m_rivers_lake_centerlines touching the module bbox; canals dropped")

    lakes = [f for f in load("ne_10m_lakes")
             if f["properties"].get("featurecla") != "Reservoir" and f["properties"].get("name") != "Lake Chad"]
    lake_feats = clip(lakes, frame, view, tol, ["name", "scalerank", "min_zoom"], {"Polygon"})
    hist = clip(load("ne_10m_lakes_historic"), frame, view, tol, ["name", "scalerank", "min_zoom"], {"Polygon"},
                {"historic": True})
    write(outdir, "lakes", lake_feats + hist,
          "ne_10m_lakes without reservoirs or the modern Lake Chad remnant; Lake Chad from ne_10m_lakes_historic "
          "(about the mid-20th-century lake). Lake levels in the module years are not reconstructible at this scale.")
    write(outdir, "playas", clip(load("ne_10m_playas"), frame, view, tol, ["name"], {"Polygon"}, inside_only=True),
          "ne_10m_playas (seasonal salt pans)")


if __name__ == "__main__":
    main()
