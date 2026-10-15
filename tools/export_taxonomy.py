#!/usr/bin/env python3
"""Export data/taxonomy.yaml to data/build/taxonomy.json for the app.

The app reads every list, label, and definition from this file, so nothing is duplicated in TypeScript.
The export keeps the YAML exactly (values and text unchanged) and adds one convenience index:
  traditions: {tradition: {family, branches, overlays}}  (flattened from religion.families)

It also writes data/build/modules.json, the list of module frames from data/modules.yaml,
so the app can find its modules without reading YAML.

Usage: python3 tools/export_taxonomy.py
"""
import json
from pathlib import Path

import yaml

from modules import load_frame

ROOT = Path(__file__).resolve().parent.parent


def flatten_traditions(religion):
    out = {}
    for family, fdef in (religion.get("families") or {}).items():
        for trad, tdef in (fdef.get("traditions") or {}).items():
            if trad in out:
                raise SystemExit(f"taxonomy: tradition {trad} appears in two families")
            tdef = tdef or {}
            out[trad] = {"family": family, "branches": list(tdef.get("branches") or []),
                         "overlays": list(tdef.get("overlays") or [])}
    return out


def export():
    tax = yaml.safe_load((ROOT / "data" / "taxonomy.yaml").read_text(encoding="utf-8"))
    # YAML reads keys like "1.2" as strings already (quoted in the file); make sure no key is non-string.
    out = json.loads(json.dumps(tax, ensure_ascii=False, default=str))
    out["traditions"] = flatten_traditions(tax["religion"])
    return out


def main():
    out = export()
    bdir = ROOT / "data" / "build"
    bdir.mkdir(parents=True, exist_ok=True)
    (bdir / "taxonomy.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    mods = yaml.safe_load((ROOT / "data" / "modules.yaml").read_text(encoding="utf-8"))["modules"]
    index = {"modules": [load_frame(m) for m in mods]}
    (bdir / "modules.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote data/build/modules.json ({len(index['modules'])} module(s))")
    print(f"wrote data/build/taxonomy.json (taxonomy v{out['meta']['version']}, {len(out['traditions'])} traditions)")


if __name__ == "__main__":
    main()
