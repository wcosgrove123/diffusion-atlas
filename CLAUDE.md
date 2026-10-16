# Diffusion Atlas

A time-slider map of cultural diffusion (religion first) for Wil Cosgrove's AP World History classes at Walt Whitman
HS (MCPS). First module: Africa 1200–1450. Later modules: Asia, the Middle East, Europe. Static site on GitHub Pages.

## Read before doing anything
1. docs/product-spec.md: what the app does (the source of truth)
2. docs/build-plan.md: architecture, stack, phases, acceptance checks
3. data/taxonomy.yaml: every controlled value; the UI reads its labels and definitions from here
4. docs/record-format.md: the data records
5. docs/geometry-audit.md, section 5: how to get each polygon
6. docs/decisions-for-wil.md: open questions. Do not decide these yourself.

## Commands
```
pip install -r requirements.txt
python3 tools/validate.py                 # must report 0 errors
python3 tools/build_data.py africa        # -> data/build/africa.json + africa-report.md (includes the AP World set)
python3 tools/ap_match.py africa          # course texts -> data/ap-world/africa.yaml (needs Loom's library; see sources.yaml)
python3 tools/export_taxonomy.py          # -> data/build/taxonomy.json + modules.json
python3 tools/build_geometry.py africa    # polity-shapes.yaml -> data/geometry/polities/; -> data/build/africa-geo.json
                                          #   + africa-base.json
python3 -m pytest tests                   # pipeline tests
bash tools/fetch_geometry.sh              # re-download raw geometry (gitignored)
python3 tools/extract_africa.py --report  # clip aourednik to the frame
python3 tools/extract_base.py africa      # clip Natural Earth to the module view box -> data/geometry/base/africa/
cd app && npm run dev | npm run build | npm test
cd app && npm run build && PW_CHANNEL=msedge npm run e2e   # smoke, Phase 1 acceptance, Lighthouse (CI: Chromium)
cd app && GEOMETRY_REVIEW=1 PW_CHANNEL=msedge npx playwright test geometry-review --project=desktop  # review shots
```
Module frames (years, bbox, view_bbox, regions, shown_regions) live in `data/modules.yaml`. The app reads them only via `modules.json`.
On Windows, `python` replaces `python3`. In Git Bash set `MSYS_NO_PATHCONV=1` before passing `BASE_PATH=/repo/`.

## Rules
- **The data is the history.** Never write, paraphrase, or "improve" historical text in the app. Render summaries
  and details exactly as built. If something in the data looks wrong, log it in docs/data-issues.md for Wil.
- **Color people, not states.** Never render a single religion color for a polity. See product-spec section 3.
- **Absence is data.** `undocumented` and "no record" must be visible and distinct; never fill gaps.
- **Never color alone.** Every color encoding has a pattern, glyph, or text twin.
- **No hard-coded vocab.** Lists, labels, and definitions come from taxonomy.yaml via data/build/taxonomy.json.
- **Region-agnostic code.** Nothing may assume Africa, Islam, or 1200–1450; read the module frame from the data.
- **Self-hosted only.** No tile servers, CDNs, analytics, or external fonts at runtime (school network filters).
- **Licenses.** Repo is GPL-3.0 because it ships modified aourednik/historical-basemaps data. Natural Earth is public
  domain. Images only from Wikimedia Commons with license lines in images.yaml, and only after Wil approves.
- **Student text style.** No em dashes in anything student-facing that you write (UI labels, legend, help text).
  Plain, short sentences.
- **Attribution.** Wil is the author of the project, its ideas, and its writing. Nothing in the site, README, or
  metadata should say Claude or AI built it or wrote it. Co-author lines on commits for code are fine.
- **Polygons** are made from `data/geometry/polity-shapes.yaml` (method A, E or H per docs/geometry-audit.md 5;
  E edits are `keep`, `remove`, `add`; H is an `outline` or a `point` with `buffer_km`; `zone: nomadic` hatches).
  Hand-drawn (H) shapes stay `review: draft` until Wil approves them in docs/geometry-review.md.
- **Map layers** draw with pattern fills and pattern lines only (`app/src/map/patterns.ts` helpers), so the map
  compiles two WebGL programs. A new paint kind adds a program and costs startup time on Chromebooks.
- **AP World view.** `data/ap-world/<module>.yaml` says what the "AP World only" view shows; the app never
  decides that itself. Wil edits `include` and `exclude` there (docs/decisions-for-wil.md, 20).
- **Phases in order.** Ship each phase to Pages before starting the next. Something usable must exist early.
- Ask Wil before changing the stack, the taxonomy, or anything in docs/decisions-for-wil.md.
