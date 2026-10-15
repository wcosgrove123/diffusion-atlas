#!/usr/bin/env python3
"""Bundle a module's map geometry into one file the app loads.

Reads  data/geometry/base/<module>/*.geojson     (Natural Earth, from tools/extract_base.py)
       data/geometry/polities/<place-id>.geojson (polity extents; Phase 1 onward, may be absent)
Writes data/build/<module>-geo.json

Every polity feature must carry {place_id, year_from, year_to, method: A|E|H, basis} (docs/build-plan.md).

Usage: python3 tools/build_geometry.py africa
"""
import json
import sys

from modules import ROOT, load_frame

BASE_LAYERS = ["land", "rivers", "lakes", "playas"]
POLITY_PROPS = ["place_id", "year_from", "year_to", "method", "basis"]


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
    out = {
        "module": module,
        "frame": frame,
        "attribution": ["Natural Earth (public domain)"],
        "base": base,
        "polities": {"type": "FeatureCollection", "features": load_polities()},
    }
    if out["polities"]["features"]:
        out["attribution"].append("aourednik/historical-basemaps (GPL-3.0), modified")
    outdir = ROOT / "data/build"
    outdir.mkdir(parents=True, exist_ok=True)
    path = outdir / f"{module}-geo.json"
    path.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote data/build/{module}-geo.json ({path.stat().st_size / 1024:.0f} KB, "
          f"{len(out['polities']['features'])} polity features)")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "africa")
