#!/usr/bin/env python3
"""Find which records the AP World curriculum names, for the app's "AP World only" view.

Reads  data/ap-world/sources.yaml          (which texts count: the CED alignment doc and the textbook chapters)
       data/build/<module>.json            (the records; run build_data.py first)
       data/ap-world/<module>.yaml         (an earlier result: its include and exclude lists are kept)
Writes data/ap-world/<module>.yaml         (named records with the terms and texts that matched)

A place or exemplar is "named" when one of its names (name, alt_names) appears in a source text. A diffusion or
event is named when its subject or title holds a place name of the module or a religion branch word from the
taxonomy (Maliki, Sufi, Coptic...) that the sources use; plain English words ("Great", "Growth") never count. The
build (tools/build_data.py) then applies the follow rule Wil chose (docs/decisions-for-wil.md, 20): a named place
brings its profiles, events and exemplars along, and an arc shows when it arrives at a named place or is named
itself. Edit `include` and `exclude` in the output to overrule a match.

Usage: python3 tools/ap_match.py africa [--library path/to/index.json]
"""
import argparse
import datetime as dt
import json
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
# Words that appear in names but name nothing by themselves.
STOP = {"kingdom", "sultanate", "empire", "dynasty", "city", "town", "oases", "later", "name", "early", "later name",
        "region", "era", "capital", "question", "candidate", "rival", "communities", "coast", "coastal", "islam",
        "christian", "muslim", "the", "and", "of", "in", "so", "sau", "k2", "amu", "misr", "old", "plains", "farmers",
        "highlands", "mainland", "successor", "allied", "core", "term", "outsider", "offensive", "with", "island",
        "archipelago", "towns", "goldfields", "clerical", "later daughter house", "house", "rule",
        # branch words that are plain geography, not a religion's name
        "african", "east", "latin", "church", "beta", "israel", "egypt", "coastal", "tamazight-speaking"}
MIN_LEN = 3


def _clean(term):
    term = re.sub(r"\(.*?\)", " ", term)
    term = re.sub(r"\s+", " ", term).strip(" ;,.")
    return term


def name_terms(rec, kind, vocab):
    """The names a record may be known by in a textbook, cleaned. `vocab` holds the module's place names and the
    taxonomy's religion branch words (lowercased), the only terms a diffusion or event may be named by."""
    raw = []
    if kind == "places":
        head = rec["name"].split(" (")[0]
        raw.append(head)
        # a long name's own proper nouns: "Songhay kingdom of Gao" -> Songhay
        if " " in head:
            raw += [w for w in re.findall(r"\b[A-Z][\w'-]{4,}\b", head)]
        # the parenthetical often holds alternative names: "Alodia (Alwa)", "Ile-Ife"
        for inner in re.findall(r"\((.*?)\)", rec["name"]):
            raw += re.split(r"[;,]", inner)
        raw += rec.get("alt_names") or []
    elif kind == "exemplars":
        raw.append(rec["name"].split(" (")[0].split(",")[0])
    elif kind in ("events", "diffusions"):
        text = rec["title"] if kind == "events" else rec["what"]
        # only words the module already knows: place names and religion branch words
        raw += [w for w in re.findall(r"\b[A-Z][\w'-]{2,}\b", text) if w.lower() in vocab]
        raw += [v for v in vocab if " " in v and v in text.lower()]
    out = []
    for t in raw:
        t = _clean(t)
        if len(t) < MIN_LEN or t.lower() in STOP:
            continue
        out.append(t)
    seen = set()
    return [t for t in out if not (t.lower() in seen or seen.add(t.lower()))]


def term_pattern(term):
    """Whole-word match; short names (Gao, Mali, Ife) must keep their capitals, longer ones need not."""
    body = r"\b" + re.escape(term).replace(r"\ ", r"\s+") + r"\b"
    return re.compile(body, 0 if len(term) < 5 else re.IGNORECASE)


def load_sources(cfg, library):
    texts = []
    ced = cfg.get("ced")
    if ced:
        texts.append((ced["label"], (ROOT / ced["path"]).read_text(encoding="utf-8")))
    tb = cfg.get("textbook") or {}
    index = Path(library) if library else (ROOT / tb.get("library_index", "")).resolve()
    if tb.get("materials"):
        if not index.exists():
            raise SystemExit(f"textbook library index not found: {index} (pass --library)")
        idx = json.loads(index.read_text(encoding="utf-8"))
        mats = idx["materials"]
        mats = list(mats.values()) if isinstance(mats, dict) else mats
        by_label = {m["label"]: m for m in mats}
        for label in tb["materials"]:
            m = by_label.get(label)
            if not m:
                print(f"warning: no library material labelled {label!r}")
                continue
            md = [f for f in m.get("files") or [] if f.get("ext") == "md"]
            if not md:
                print(f"warning: {label!r} has no text copy")
                continue
            # file paths in the index are relative to Loom's app folder (".data/library/...")
            path = index.parent.parent.parent / Path(md[0]["path"].replace(".data/", "", 1))
            text = path.read_text(encoding="utf-8", errors="replace")
            heading = next((l.strip("# ").strip() for l in text.splitlines() if l.startswith("#")), label)
            texts.append((f"Textbook, {label}: {heading}", text))
    return texts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("module")
    ap.add_argument("--library", help="path to Loom's library index.json (default from sources.yaml)")
    args = ap.parse_args()
    cfg = yaml.safe_load((ROOT / "data/ap-world/sources.yaml").read_text(encoding="utf-8"))
    data = json.loads((ROOT / "data/build" / f"{args.module}.json").read_text(encoding="utf-8"))
    texts = load_sources(cfg, args.library)
    out_path = ROOT / "data/ap-world" / f"{args.module}.yaml"
    previous = yaml.safe_load(out_path.read_text(encoding="utf-8")) if out_path.exists() else {}

    tax = yaml.safe_load((ROOT / "data/taxonomy.yaml").read_text(encoding="utf-8"))
    vocab = set()
    for p in data["places"]:
        if p.get("kind") != "external":
            vocab.update(t.lower() for t in name_terms(p, "places", set()))
    for fam in tax["religion"]["families"].values():
        for tdef in (fam.get("traditions") or {}).values():
            for b in list((tdef or {}).get("branches") or []) + list((tdef or {}).get("overlays") or []):
                vocab.update(w for w in b.split("-") if len(w) >= 4 and w not in ("other", "unspecified"))

    named = {}
    for kind in ("places", "diffusions", "exemplars", "events"):
        for rec in data[kind]:
            if rec.get("kind") == "external":
                continue
            hits = {}
            for term in name_terms(rec, kind, vocab):
                pat = term_pattern(term)
                for label, text in texts:
                    n = len(pat.findall(text))
                    if n:
                        hits.setdefault(term, {})[label] = n
            if hits:
                named[rec["id"]] = {"name": rec.get("name") or rec.get("title") or rec.get("what"), "matched": hits}

    out = {
        "module": args.module,
        "generated": dt.date.today().isoformat(),
        "sources": [label for label, _ in texts],
        "default_view": (previous or {}).get("default_view", "ap"),
        "include": (previous or {}).get("include") or [],
        "exclude": (previous or {}).get("exclude") or [],
        "named": dict(sorted(named.items())),
    }
    header = ("# Records the AP World curriculum names, found by tools/ap_match.py (do not edit `named` by hand: it is\n"
              "# regenerated). To overrule a match, list record ids under `include` or `exclude`; those lines are kept.\n"
              "# default_view: ap (students open on the AP set) or all. Rules: docs/decisions-for-wil.md, 20.\n")
    out_path.write_text(header + yaml.safe_dump(out, sort_keys=False, allow_unicode=True, width=110), encoding="utf-8")
    by_kind = {}
    for rid in named:
        by_kind[rid[:2]] = by_kind.get(rid[:2], 0) + 1
    print(f"wrote {out_path.relative_to(ROOT)}: {len(named)} named records {by_kind} from {len(texts)} texts")


if __name__ == "__main__":
    main()
