#!/usr/bin/env python3
"""Validate Diffusion Atlas research files against data/taxonomy.yaml.

Usage: python3 tools/validate.py [file_or_dir ...]
Default: every *.yaml under data/research/. Exits 1 on errors. Warnings do not fail.
Checks: required fields, controlled vocabularies, id prefixes and uniqueness,
cross-references (place, evidence, from/to), spans, banned terms, summary length.
"""
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
TAX = yaml.safe_load((ROOT / "data" / "taxonomy.yaml").read_text())

FAMILIES = TAX["religion"]["families"]
TRAD_TO_FAMILY = {t: f for f, fv in FAMILIES.items() for t in fv["traditions"]}
BRANCHES = {t: set(tv["branches"]) for fv in FAMILIES.values() for t, tv in fv["traditions"].items()}
SHARE = set(TAX["religion"]["share"])
RELATION = set(TAX["religion"]["relation"])
BASIS = set(TAX["religion"]["basis"])
STRATA = set(TAX["strata"])
MECH = set(TAX["diffusion"]["mechanism"])
CARRIERS = set(TAX["diffusion"]["carriers"])
OUTCOME = set(TAX["diffusion"]["outcome"])
LENSES = set(TAX["lenses"])
KINDS = set(TAX["place_kinds"])
PP = {k: set(v) for k, v in TAX["polity_profile"].items()}
SRC_KIND = set(TAX["sources"]["kind"])
SRC_TYPE = set(TAX["sources"]["type"])
VOICE = set(TAX["sources"]["voice"])
VERIF = set(TAX["sources"]["verification"])
CONF = set(TAX["sources"]["confidence"])
AP = set(TAX["ap_topics"])
BANNED = [t.split(" (")[0].lower() for t in TAX["writing_rules"]["banned_terms"]]
LISTS = ["places", "religion_profiles", "diffusions", "exemplars", "events", "sources"]
PREFIX = {"places": "pl-", "religion_profiles": "rp-", "diffusions": "df-",
          "exemplars": "ex-", "events": "ev-", "sources": "src-"}


class Report:
    def __init__(self):
        self.errors, self.warnings = [], []

    def err(self, where, msg):
        self.errors.append(f"ERROR {where}: {msg}")

    def warn(self, where, msg):
        self.warnings.append(f"warn  {where}: {msg}")


def text_fields(rec):
    for k in ("summary", "detail", "what", "title", "name", "geometry_note", "flag"):
        v = rec.get(k)
        if isinstance(v, str):
            yield k, v
    for t in rec.get("traditions", []) or []:
        if isinstance(t, dict) and isinstance(t.get("local_form"), str):
            yield "local_form", t["local_form"]


def check_banned(rep, where, rec):
    for field, val in text_fields(rec):
        low = val.lower()
        for term in BANNED:
            if term == "tribe":
                continue  # judgment call; reviewed by hand
            if re.search(r"\b" + re.escape(term) + r"\b", low):
                # allow inside quotation marks (quoting a source)
                if f'"{term}' in low or f"'{term}" in low:
                    rep.warn(where, f"quoted banned term '{term}' in {field}; confirm it is attributed")
                else:
                    rep.err(where, f"banned term '{term}' in {field}")


def check_span(rep, where, span, required=True):
    if span is None:
        if required:
            rep.err(where, "missing span")
        return
    s, e = span.get("start"), span.get("end")
    if not isinstance(s, int):
        rep.err(where, "span.start must be an integer year")
    if e is not None and not isinstance(e, int):
        rep.err(where, "span.end must be an integer year or null")
    if isinstance(s, int) and isinstance(e, int) and e < s:
        rep.err(where, f"span end {e} before start {s}")


def common(rep, where, rec, need_summary=True):
    if need_summary:
        s = rec.get("summary")
        if not s:
            rep.err(where, "missing summary")
        else:
            n = len(re.findall(r"[.!?](\s|$)", s.strip()))
            if n > 2:
                rep.warn(where, f"summary has {n} sentences (max 2)")
    if not rec.get("evidence"):
        rep.err(where, "missing evidence")
    if rec.get("confidence") not in CONF:
        rep.err(where, f"confidence '{rec.get('confidence')}' not in {sorted(CONF)}")
    for t in rec.get("ap_topics", []) or []:
        if str(t) not in AP:
            rep.err(where, f"ap_topic {t} not in taxonomy")
    check_banned(rep, where, rec)


def validate(files):
    rep = Report()
    data = {k: [] for k in LISTS}
    for f in files:
        try:
            doc = yaml.safe_load(Path(f).read_text()) or {}
        except yaml.YAMLError as e:
            rep.err(str(f), f"YAML parse error: {e}")
            continue
        for k in doc:
            if k not in LISTS and k != "registry":
                rep.warn(str(f), f"unknown top-level key '{k}'")
        for k in LISTS:
            for rec in doc.get(k) or []:
                data[k].append((str(f), rec))

    ids = {}
    for k, recs in data.items():
        for f, rec in recs:
            rid = rec.get("id")
            if not rid or not str(rid).startswith(PREFIX[k]):
                rep.err(f"{f}:{rid}", f"{k} id must start with '{PREFIX[k]}'")
            if rid in ids and k != "sources":
                rep.err(f"{f}:{rid}", f"duplicate id (also in {ids[rid]})")
            ids.setdefault(rid, f)

    place_ids = {r["id"] for _, r in data["places"] if "id" in r}
    # Registry ids count as known places, so one research file can be checked alone.
    registry_ids = set()
    for f in files:
        doc = yaml.safe_load(Path(f).read_text()) or {}
        for r in doc.get("registry") or []:
            registry_ids.add(r["id"])
    for reg in sorted({Path(f).parent / "_registry.yaml" for f in files}):
        if reg.exists() and str(reg) not in map(str, files):
            for r in (yaml.safe_load(reg.read_text()) or {}).get("registry") or []:
                registry_ids.add(r["id"])
            for r in (yaml.safe_load(reg.read_text()) or {}).get("places") or []:
                place_ids.add(r["id"])
    if FULL_CHECK:
        for rid in sorted(registry_ids - place_ids):
            rep.warn("registry", f"registered place '{rid}' has no full record yet")
    place_ids |= registry_ids
    src_ids = {r["id"] for _, r in data["sources"] if "id" in r}
    cited = set()

    for f, r in data["places"]:
        w = f"{f}:{r.get('id')}"
        if r.get("kind") not in KINDS:
            rep.err(w, f"kind '{r.get('kind')}' not in {sorted(KINDS)}")
        if r.get("kind") != "external":
            check_span(rep, w, r.get("span"))
        loc = r.get("location")
        if r.get("kind") in ("city", "site", "external") and not loc:
            rep.err(w, "point place needs location")
        if loc and not (-40 <= loc.get("lat", 999) <= 70 and -30 <= loc.get("lon", 999) <= 150):
            rep.warn(w, f"location looks off: {loc}")
        par = r.get("parent")
        for pid in ([x.get("id") for x in par] if isinstance(par, list) else [par] if par else []):
            if pid not in place_ids:
                rep.err(w, f"parent '{pid}' not a known place")
        for snap in r.get("polity_profile") or []:
            for axis, vals in PP.items():
                v = snap.get(axis)
                for x in (v if isinstance(v, list) else [v]):
                    if x is not None and x not in vals:
                        rep.err(w, f"polity_profile.{axis} '{x}' not in {sorted(vals)}")
        if r.get("kind") != "external":
            common(rep, w, r, need_summary=False)
        cited.update(r.get("evidence") or [])

    for f, r in data["religion_profiles"]:
        w = f"{f}:{r.get('id')}"
        if r.get("place") not in place_ids:
            rep.err(w, f"place '{r.get('place')}' not a known place")
        check_span(rep, w, r.get("span"))
        if r.get("stratum") not in STRATA:
            rep.err(w, f"stratum '{r.get('stratum')}' not in {sorted(STRATA)}")
        if r.get("stratum") == "community" and not r.get("community_name"):
            rep.err(w, "stratum community requires community_name")
        if r.get("basis") is not None and r.get("basis") not in BASIS:
            rep.err(w, f"basis '{r.get('basis')}' not in {sorted(BASIS)}")
        if r.get("relation") not in RELATION:
            rep.err(w, f"relation '{r.get('relation')}' not in {sorted(RELATION)}")
        trads = r.get("traditions") or []
        if not trads and r.get("relation") != "undocumented":
            rep.err(w, "no traditions listed")
        for t in trads:
            tr = t.get("tradition")
            if tr not in TRAD_TO_FAMILY:
                rep.err(w, f"tradition '{tr}' not in taxonomy")
                continue
            if t.get("family") != TRAD_TO_FAMILY[tr]:
                rep.err(w, f"tradition {tr} belongs to family {TRAD_TO_FAMILY[tr]}, not {t.get('family')}")
            if t.get("branch") not in BRANCHES[tr]:
                rep.err(w, f"branch '{t.get('branch')}' not valid for {tr}")
            if t.get("share") not in SHARE:
                rep.err(w, f"share '{t.get('share')}' not in {sorted(SHARE)}")
            if tr == "indigenous" and not t.get("local_form"):
                rep.err(w, "indigenous tradition needs a specific local_form")
        if r.get("relation") == "exclusive" and not r.get("basis"):
            rep.warn(w, "exclusive with no basis: set attested, inferred (silence), or projected")
        if r.get("relation") == "exclusive" and len(trads) > 1:
            rep.warn(w, "relation exclusive but more than one tradition listed")
        if r.get("relation") in ("syncretic", "plural", "coexisting", "contested") and len(trads) < 2:
            rep.err(w, f"relation {r.get('relation')} needs at least two traditions")
        common(rep, w, r)
        cited.update(r.get("evidence") or [])

    for f, r in data["diffusions"]:
        w = f"{f}:{r.get('id')}"
        if r.get("lens") not in LENSES:
            rep.err(w, f"lens '{r.get('lens')}' not in {sorted(LENSES)}")
        frm = r.get("from") or []
        if not frm:
            rep.err(w, "missing from")
        for p in frm + [r.get("to")]:
            if p not in place_ids:
                rep.err(w, f"place '{p}' not a known place")
        check_span(rep, w, r.get("span"))
        if r.get("mechanism") not in MECH:
            rep.err(w, f"mechanism '{r.get('mechanism')}' not in {sorted(MECH)}")
        for c in r.get("carriers") or []:
            if c not in CARRIERS:
                rep.err(w, f"carrier '{c}' not in taxonomy")
        if not r.get("carriers"):
            rep.err(w, "missing carriers")
        if r.get("outcome") not in OUTCOME:
            rep.err(w, f"outcome '{r.get('outcome')}' not in {sorted(OUTCOME)}")
        common(rep, w, r)
        cited.update(r.get("evidence") or [])

    for f, r in data["exemplars"]:
        w = f"{f}:{r.get('id')}"
        if r.get("place") not in place_ids:
            rep.err(w, f"place '{r.get('place')}' not a known place")
        if not r.get("location"):
            rep.err(w, "missing location")
        check_span(rep, w, r.get("span"))
        for l in r.get("lenses") or []:
            if l not in LENSES:
                rep.err(w, f"lens '{l}' not in taxonomy")
        common(rep, w, r)
        cited.update(r.get("evidence") or [])

    for f, r in data["events"]:
        w = f"{f}:{r.get('id')}"
        if not isinstance(r.get("year"), int):
            rep.err(w, "year must be an integer")
        if r.get("place") not in place_ids:
            rep.err(w, f"place '{r.get('place')}' not a known place")
        for l in r.get("lenses") or []:
            if l not in LENSES:
                rep.err(w, f"lens '{l}' not in taxonomy")
        common(rep, w, r)
        cited.update(r.get("evidence") or [])

    for f, r in data["sources"]:
        w = f"{f}:{r.get('id')}"
        if r.get("kind") not in SRC_KIND:
            rep.err(w, f"kind '{r.get('kind')}' not in {sorted(SRC_KIND)}")
        if r.get("type") not in SRC_TYPE:
            rep.err(w, f"type '{r.get('type')}' not in {sorted(SRC_TYPE)}")
        if r.get("voice") not in VOICE:
            rep.err(w, f"voice '{r.get('voice')}' not in {sorted(VOICE)}")
        if r.get("verification") not in VERIF:
            rep.err(w, f"verification '{r.get('verification')}' not in {sorted(VERIF)}")
        if r.get("kind") == "primary" and not r.get("happ"):
            rep.warn(w, "primary source without HAPP")
        if not r.get("citation"):
            rep.err(w, "missing citation")

    all_ids = set(ids) | place_ids
    for k, recs in data.items():
        for f, rec in recs:
            for field, val in text_fields(rec):
                for ref in re.findall(r"\b(?:pl|rp|df|ex|ev|src)-[a-z0-9][a-z0-9-]*[a-z0-9]", val):
                    if ref not in all_ids:
                        rep.warn(f"{f}:{rec.get('id')}", f"{field} mentions unknown id '{ref}'")
    for s in sorted(cited - src_ids):
        rep.err("evidence", f"cited source '{s}' has no source record")
    for s in sorted(src_ids - cited):
        rep.warn("sources", f"source '{s}' is never cited")

    counts = {k: len(v) for k, v in data.items()}
    return rep, counts


FULL_CHECK = False


def main():
    global FULL_CHECK
    args = sys.argv[1:]
    FULL_CHECK = not args
    args = args or [str(ROOT / "data" / "research")]
    files = []
    for a in args:
        p = Path(a)
        files += sorted(x for x in p.rglob("*.yaml") if x.name not in ("_merge.yaml", "_debates.yaml")) if p.is_dir() else [p]
    rep, counts = validate(files)
    for line in rep.warnings + rep.errors:
        print(line)
    print(f"\n{len(files)} files | " + " | ".join(f"{k} {v}" for k, v in counts.items()))
    print(f"{len(rep.errors)} errors, {len(rep.warnings)} warnings")
    sys.exit(1 if rep.errors else 0)


if __name__ == "__main__":
    main()
