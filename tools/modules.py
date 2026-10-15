"""Read module frames from data/modules.yaml. Shared by the build tools."""
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent


def load_frame(module):
    doc = yaml.safe_load((ROOT / "data" / "modules.yaml").read_text(encoding="utf-8")) or {}
    mods = doc.get("modules") or {}
    if module not in mods:
        raise SystemExit(f"module {module!r} is not in data/modules.yaml (known: {', '.join(mods)})")
    m = mods[module]
    for key in ("title", "start", "end", "bbox"):
        if key not in m:
            raise SystemExit(f"data/modules.yaml: module {module} has no {key}")
    bbox = [float(v) for v in m["bbox"]]
    _check_box(module, "bbox", bbox)
    if "view_bbox" in m:
        view = [float(v) for v in m["view_bbox"]]
    else:
        dx, dy = (bbox[2] - bbox[0]) * 0.15, (bbox[3] - bbox[1]) * 0.15
        view = [max(-180.0, bbox[0] - dx), max(-85.0, bbox[1] - dy), min(180.0, bbox[2] + dx), min(85.0, bbox[3] + dy)]
    _check_box(module, "view_bbox", view)
    if not (view[0] <= bbox[0] and view[1] <= bbox[1] and view[2] >= bbox[2] and view[3] >= bbox[3]):
        raise SystemExit(f"data/modules.yaml: module {module} view_bbox must contain bbox")
    if not m["start"] < m["end"]:
        raise SystemExit(f"data/modules.yaml: module {module} start must be before end")
    regions = [{"id": r["id"], "label": r["label"]} for r in m.get("regions") or []]
    for r in regions:
        if not (ROOT / "data" / "research" / module / f"{r['id']}.yaml").exists():
            raise SystemExit(f"data/modules.yaml: module {module} region {r['id']} has no research file")
    ids = [r["id"] for r in regions]
    shown = list(m.get("shown_regions") or ids)
    if not set(shown) <= set(ids):
        raise SystemExit(f"data/modules.yaml: module {module} shown_regions must be listed in regions")
    return {"id": module, "title": m["title"], "start": int(m["start"]), "end": int(m["end"]),
            "bbox": bbox, "view_bbox": view, "regions": regions, "shown_regions": shown}


def _check_box(module, key, b):
    if len(b) != 4 or not (-180 <= b[0] < b[2] <= 180 and -85 <= b[1] < b[3] <= 85):
        raise SystemExit(f"data/modules.yaml: module {module} {key} must be [minlon, minlat, maxlon, maxlat] "
                         "within lon -180..180 and lat -85..85")


def view_box(frame):
    """The area the map may show (frame view_bbox). Matches panBounds() in app/src/data/frame.ts."""
    return frame["view_bbox"]
