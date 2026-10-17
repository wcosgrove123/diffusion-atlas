#!/usr/bin/env python3
"""Merge a module's research YAML into one JSON file the app loads.

Usage: python3 tools/build_data.py africa
Reads  data/research/<module>/*.yaml (+ _registry.yaml externals, _merge.yaml decisions)
Writes data/build/<module>.json and data/build/<module>-report.md

Run tools/validate.py first; this script assumes valid records.
"""
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

import yaml

from modules import load_frame

ROOT = Path(__file__).resolve().parent.parent
LISTS = ["places", "religion_profiles", "diffusions", "exemplars", "events", "sources"]
VERIF_RANK = {"web-checked": 0, "citation-only": 1, "needs-library": 2}


def merge_sources(records):
    """Several researchers cited the same work. Keep one record: the best-verified copy,
    with other copies' urls and notes kept under variants."""
    records = sorted(records, key=lambda r: VERIF_RANK.get(r[1].get("verification"), 9))
    base_file, base = records[0]
    out = dict(base)
    out["cited_in"] = sorted({f for f, _ in records})
    # A shared primary source (al-Umari, Ibn Battuta) was checked for one passage by one researcher,
    # not for every passage cited. Report the most conservative status across copies.
    worst = max(records, key=lambda r: VERIF_RANK.get(r[1].get("verification"), 9))[1].get("verification")
    if len(records) > 1 and worst != base.get("verification"):
        out["verification"] = worst
        out["verification_note"] = (f"{base.get('verification')} for the passage at the url only "
                                    f"({base_file}); other citations are {worst}")
    variants = []
    for f, r in records[1:]:
        v = {k: r[k] for k in ("citation", "url", "notes", "verification") if r.get(k) and r.get(k) != base.get(k)}
        if v:
            variants.append({"file": f, **v})
        if not out.get("url") and r.get("url"):
            out["url"] = r["url"]
        if not out.get("happ") and r.get("happ"):
            out["happ"] = r["happ"]
    if variants:
        out["variants"] = variants
    return out


def rewrite_ids(obj, mapping):
    if isinstance(obj, dict):
        return {k: rewrite_ids(v, mapping) for k, v in obj.items()}
    if isinstance(obj, list):
        return [rewrite_ids(v, mapping) for v in obj]
    if isinstance(obj, str) and obj in mapping:
        return mapping[obj]
    return obj


def ap_world_set(module, data):
    """The records the "AP World only" view shows (docs/decisions-for-wil.md, 20), from data/ap-world/<module>.yaml
    (tools/ap_match.py): named places, plus the records that follow them. Returns None when the module has no list."""
    path = ROOT / "data" / "ap-world" / f"{module}.yaml"
    if not path.exists():
        return None
    ap = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    named = ap.get("named") or {}
    include = set(ap.get("include") or [])
    exclude = set(ap.get("exclude") or [])
    why = {}
    for rid, rec in named.items():
        why[rid] = "named in " + "; ".join(sorted({s.split(":")[0] for hits in rec["matched"].values() for s in hits}))
    for rid in include:
        why[rid] = "listed by Wil"
    names = {p["id"]: p["name"] for p in data["places"]}
    places = {p["id"] for p in data["places"] if p["id"] in why and p["id"] not in exclude}
    for r in data["religion_profiles"]:
        if r["place"] in places:
            why.setdefault(r["id"], f"follows {names[r['place']]}")
    for e in data["events"] + data["exemplars"]:
        if e["place"] in places:
            why.setdefault(e["id"], f"follows {names[e['place']]}")
    for d in data["diffusions"]:
        if d["to"] in places:
            why.setdefault(d["id"], f"arrives at {names[d['to']]}")
    for rid in exclude:
        why.pop(rid, None)
    return {"default_view": ap.get("default_view", "ap"), "generated": str(ap.get("generated", "")),
            "sources": ap.get("sources") or [], "why": dict(sorted(why.items()))}


def ced_named(module):
    """Place ids the AP World match found in the course outline itself (the `ced` text of data/ap-world/sources.yaml),
    as opposed to the textbook chapters. Empty when the module has no list."""
    path = ROOT / "data" / "ap-world" / f"{module}.yaml"
    cfg_path = ROOT / "data" / "ap-world" / "sources.yaml"
    if not path.exists() or not cfg_path.exists():
        return set()
    cfg = yaml.safe_load(cfg_path.read_text(encoding="utf-8")) or {}
    label = (cfg.get("ced") or {}).get("label")
    if not label:
        return set()
    ap = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    return {rid for rid, rec in (ap.get("named") or {}).items()
            if any(label in hits for hits in (rec.get("matched") or {}).values())}


def prominence_tiers(data, tax, ap_world, ced):
    """Give every place and diffusion a prominence (taxonomy section 8): how far out the map still shows it.
    Places: the first tier when the course outline names them, the second when the AP World view shows them,
    the last otherwise; a module with no AP World list puts polities and peoples first and the rest second.
    Diffusions: the most prominent of their endpoints, plus one corridor id per origin (origin region to
    destination region; an external place is its own corridor end). A record's own `prominence` wins.
    Returns the tier counts for the report."""
    tiers = list(tax["prominence"])
    top, second, last = tiers[0], tiers[min(1, len(tiers) - 1)], tiers[-1]
    shown = set(ap_world["why"]) if ap_world else None
    rank = {t: i for i, t in enumerate(tiers)}
    tier_of = {}
    for p in data["places"]:
        own = p.get("prominence")
        if own:
            if own not in rank:
                raise SystemExit(f"{p['id']}: prominence {own!r} is not in the taxonomy")
            tier = own
        elif shown is None:
            tier = top if p.get("kind") in ("polity", "people") else second
        elif p["id"] in ced and p["id"] in shown:
            tier = top
        elif p["id"] in shown:
            tier = second
        else:
            tier = last
        p["prominence"] = tier
        tier_of[p["id"]] = tier
    region_of = {p["id"]: (p["id"] if p.get("kind") == "external" else p["_file"]) for p in data["places"]}
    for d in data["diffusions"]:
        ends = [tier_of.get(x, last) for x in list(d["from"]) + [d["to"]]]
        own = d.get("prominence")
        if own and own not in rank:
            raise SystemExit(f"{d['id']}: prominence {own!r} is not in the taxonomy")
        d["prominence"] = own or min(ends, key=lambda t: rank[t])
        d["corridor"] = [f"{region_of.get(f, f)}>{region_of.get(d['to'], d['to'])}" for f in d["from"]]
    counts = {}
    for kind in ("places", "diffusions"):
        counts[kind] = Counter(r["prominence"] for r in data[kind])
    counts["corridors"] = len({c for d in data["diffusions"] for c in d["corridor"]})
    return counts


def main(module):
    rdir = ROOT / "data" / "research" / module
    tax = yaml.safe_load((ROOT / "data" / "taxonomy.yaml").read_text(encoding="utf-8"))
    merge = yaml.safe_load((rdir / "_merge.yaml").read_text(encoding="utf-8")) if (rdir / "_merge.yaml").exists() else {}
    reg = yaml.safe_load((rdir / "_registry.yaml").read_text(encoding="utf-8")) if (rdir / "_registry.yaml").exists() else {}

    data = {k: [] for k in LISTS}
    src_copies = defaultdict(list)
    for f in sorted(rdir.glob("[!_]*.yaml")):
        doc = yaml.safe_load(f.read_text(encoding="utf-8")) or {}
        for k in LISTS:
            for rec in doc.get(k) or []:
                if k == "sources":
                    src_copies[rec["id"]].append((f.stem, rec))
                else:
                    data[k].append({**rec, "_file": f.stem})
    for p in reg.get("places") or []:
        data["places"].append({**p, "_file": "_registry"})

    # source aliases and dedupe
    aliases = merge.get("source_aliases") or {}
    grouped = defaultdict(list)
    for sid, copies in src_copies.items():
        grouped[aliases.get(sid, sid)].extend(copies)
    data["sources"] = []
    for sid, copies in sorted(grouped.items()):
        rec = merge_sources(copies)
        rec["id"] = sid
        data["sources"].append(rec)

    # events: merge duplicates, keyframe overrides
    ev_merge = merge.get("event_merges") or {}
    data["events"] = [e for e in data["events"] if e["id"] not in ev_merge]
    for e in data["events"]:
        if e["id"] in (merge.get("keyframe_overrides") or {}):
            e["keyframe"] = merge["keyframe_overrides"][e["id"]]

    mapping = {**aliases, **ev_merge}
    for k in LISTS:
        if k != "sources":
            data[k] = rewrite_ids(data[k], mapping)

    # derived AP tags
    add = (merge.get("derive_ap") or {}).get("religion_lens_adds")
    if add:
        for d in data["diffusions"]:
            if d["lens"] == "religion" and add not in [str(x) for x in d.get("ap_topics") or []]:
                d["ap_topics"] = list(d.get("ap_topics") or []) + [add]
                d["ap_topics_derived"] = [add]
        for e in data["events"]:
            if "religion" in (e.get("lenses") or []) and add not in [str(x) for x in e.get("ap_topics") or []]:
                e["ap_topics"] = list(e.get("ap_topics") or []) + [add]

    ap_world = ap_world_set(module, data)
    tiers = prominence_tiers(data, tax, ap_world, ced_named(module))

    debates = (yaml.safe_load((rdir / "_debates.yaml").read_text(encoding="utf-8")) or {}).get("debates", []) \
        if (rdir / "_debates.yaml").exists() else []
    known = {r["id"] for k in LISTS for r in data[k]}
    for db in debates:
        for link in db.get("links") or []:
            if link not in known:
                raise SystemExit(f"debate {db['id']} links unknown id {link}")
    out = {
        "module": module,
        "taxonomy_version": tax["meta"]["version"],
        "frame": load_frame(module),
        **data,
        "debates": debates,
        "ap_world": ap_world,
    }
    bdir = ROOT / "data" / "build"
    bdir.mkdir(parents=True, exist_ok=True)
    (bdir / f"{module}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")

    # report
    c = lambda key, recs: Counter(r.get(key) for r in recs)
    lines = [f"# {module} build report", "",
             "| list | count |", "|---|---|"]
    lines += [f"| {k} | {len(v)} |" for k, v in data.items()]
    lines += ["", "## Sources by voice", ""] + [f"- {k}: {v}" for k, v in c("voice", data["sources"]).most_common()]
    lines += ["", "## Sources by verification", ""] + [f"- {k}: {v}" for k, v in c("verification", data["sources"]).most_common()]
    lines += ["", "## Religion profiles: stratum x relation", ""]
    sr = Counter((r["stratum"], r["relation"]) for r in data["religion_profiles"])
    for (s, r), n in sorted(sr.items()):
        lines.append(f"- {s} / {r}: {n}")
    lines += ["", "## Confidence (profiles, diffusions, exemplars, events)", ""]
    allrecs = data["religion_profiles"] + data["diffusions"] + data["exemplars"] + data["events"]
    lines += [f"- {k}: {v}" for k, v in c("confidence", allrecs).most_common()]
    lines += ["", "## Diffusion mechanism / outcome / lens", ""]
    for key in ("mechanism", "outcome", "lens"):
        lines.append(f"- {key}: " + ", ".join(f"{k} {v}" for k, v in c(key, data["diffusions"]).most_common()))
    if ap_world:
        lines += ["", "## AP World only view", "",
                  f"- {len([k for k in ap_world['why'] if k.startswith('pl-')])} places named in the curriculum texts; "
                  f"{len(ap_world['why'])} records shown in all (default view: {ap_world['default_view']})"]
    lines += ["", "## Prominence (zoom tiers, taxonomy section 8)", ""]
    for kind in ("places", "diffusions"):
        lines.append(f"- {kind}: " + ", ".join(f"{t} {tiers[kind].get(t, 0)}" for t in tax["prominence"]))
    lines.append(f"- corridors (route families the zoomed-out map draws): {tiers['corridors']}")
    for t in tax["prominence"]:
        ids = sorted(p["id"] for p in data["places"] if p["prominence"] == t and p.get("kind") != "external")
        lines.append(f"- {t} places: " + (", ".join(ids) if ids else "none"))
    lines += ["", "## Keyframes", ""]
    for e in sorted((e for e in data["events"] if e.get("keyframe")), key=lambda e: e["year"]):
        lines.append(f"- {e['year']}{'~' if e.get('approx') else ''} {e['title']} ({e['_file']})")
    (bdir / f"{module}-report.md").write_text("\n".join(lines) + "\n")
    print(f"wrote data/build/{module}.json ({len(data['sources'])} sources after merge)")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "africa")
