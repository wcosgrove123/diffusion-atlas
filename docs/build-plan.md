# Build plan

For the coding agent (Claude Code). Read CLAUDE.md first, then docs/product-spec.md, then this.

## Architecture

```
 data/taxonomy.yaml ─┐
 data/research/<module>/*.yaml ──> tools/validate.py ──> tools/build_data.py ──> data/build/<module>.json ─┐
 data/research/<module>/_merge.yaml, _debates.yaml ┘                                                      │
                                                                                                          ├─> app (Vite + TS + MapLibre)
 data/geometry/africa/aourednik_*.geojson (clipped, GPL) ──┐                                             │      └─> dist/ ──> GitHub Pages
 hand-drawn soft extents (geometry_note) ─────────────────┼─> tools/build_geometry.py ──> data/build/<module>-geo.json
 Natural Earth (land, coast, rivers, lakes_historic) ─────┘
```

- **Python is the data pipeline** (already written: validate.py, build_data.py, extract_africa.py). Keep it.
- **The app only reads `data/build/*.json`.** It never reads YAML and never computes history.
- **Taxonomy drives the UI.** Legend labels, definitions, tests, AP titles, and lens/InSPECT chips are read from a
  JSON export of taxonomy.yaml (add `tools/export_taxonomy.py` -> `data/build/taxonomy.json`). No duplicated lists in TS.

## Stack (decided; ask Wil before changing)

- Vite + TypeScript, no UI framework (small DOM components; lit-html allowed if needed for templating).
- MapLibre GL JS for the map: GeoJSON sources, data-driven styling, `fill-pattern` for relation patterns
  (patterns generated at runtime into the style's image set), arcs as precomputed LineStrings.
- No base tile service. Base map = Natural Earth land/coast/rivers/lakes from our own GeoJSON, plus an optional
  shaded-relief raster as a MapLibre `image` source if Wil adds it.
- Projection: MapLibre's default Web Mercator is acceptable at this latitude range (-36 to 40). Do not spend time on
  custom projections in v1.
- Tests: Vitest (logic), Playwright (smoke + screenshots). Python tests with pytest for the pipeline.
- Deploy: GitHub Actions on push to main: `pip install pyyaml jsonschema shapely pyproj`, run validate.py (fail on
  error), build_data.py, export_taxonomy.py, build_geometry.py, then `npm ci && npm run build`, publish `dist/` to
  Pages. Vite `base` must be the repo name for Pages.

## Repo layout

```
CLAUDE.md  README.md  LICENSE (GPL-3.0)  .gitignore
data/
  taxonomy.yaml
  research/africa/   wsahel.yaml csahel.yaml north.yaml nile-horn.yaml swahili.yaml
                     _registry.yaml _merge.yaml _debates.yaml
  geometry/africa/   aourednik_<year>.geojson (clipped, GPL-3.0)  aourednik_inventory.json
  geometry/polities/ <place-id>.geojson   (to create: one file per polity, features per snapshot year)
  geometry/base/<module>/  land, rivers, lakes (historic Lake Chad), playas, clipped to the module view box
                     (tools/extract_base.py; detailed inside bbox, coarse context outside; coastline = land outline)
  modules.yaml       module frames: years, bbox, view_bbox (the app reads them via data/build/modules.json)
  geometry/raw/      (gitignored; tools/fetch_geometry.sh re-downloads)
  build/             (generated; gitignored except for local runs)
tools/  validate.py build_data.py extract_africa.py fetch_geometry.sh export_taxonomy.py build_geometry.py
        extract_base.py modules.py
tests/  test_pipeline.py (pytest)
app/    index.html  src/{main.ts, map/, ui/, data/, theme/palette.ts}  tests/
docs/   product-spec.md build-plan.md record-format.md research-brief.md ap-ced-alignment.md
        geometry-audit.md fact-check.md language-review.md corrections-log.md decisions-for-wil.md
```

## Phases

Each phase ends with something Wil can open in a browser. Do not start a phase until the previous one's acceptance
checks pass. Commit at the end of each phase.

### Phase 0: pipeline and skeleton (small)
- Repo setup, GPL-3.0 license, .gitignore, `tools/fetch_geometry.sh`, `tools/export_taxonomy.py`.
- `npm create vite` in app/, MapLibre installed, blank map of Africa from Natural Earth land/coast, frame bounds.
- GitHub Actions workflow builds and deploys a "hello map" to Pages.
- Acceptance: CI green; Pages URL shows Africa with coastlines and rivers, no modern borders; validate.py runs in CI.
- Status (2026-10-14): built and passing locally (pytest, Vitest, Playwright smoke at 1280x720 and 360x740).
  Not yet on Pages: waiting on the repo name and visibility (decisions-for-wil.md, item 1).
  Notes: MapLibre 6 loads its worker by URL, so `app/scripts/sync-public.mjs` copies it to `public/vendor/`.
  The view box is wide enough for a 16:9 projector and tall enough for a portrait phone to fit the whole bbox.

### Phase 1: vertical slice, West Africa religion lens (the classroom-usable core)
Scope: places from `wsahel.yaml` only (plus external places they reference), religion lens only.
- `tools/build_geometry.py`: produces polity features for wsahel polities per geometry-audit section 5
  (Mali by method E with the trims described there; Sosso, Jolof, Takrur, Songhay-Gao, Mossi, Bono by method H as
  low-vertex soft shapes drafted from each place's `geometry_note`). Every feature carries
  `{place_id, year_from, year_to, method: A|E|H, basis: <text>}`. Clip to Natural Earth land.
  **Hand-drawn shapes are drafts for Wil to review**: write `docs/geometry-review.md` listing each with a screenshot.
- Time slider, keyframes (wsahel keyframes), profile lookup, fills, court ring, city donuts, relation patterns,
  undocumented crosshatch, confidence opacity, basis borders.
- Place card and event card (student view); legend.
- Acceptance (Playwright):
  1. At 1352, Mali's court ring is not plain solid green: it shows the relation the data gives for
     `rp-mali-court-*` covering 1352, and the card lists both traditions with local_form text.
  2. At 1352, Mali's rural fill reads "No direct evidence" if the covering rural profile is undocumented.
  3. Timbuktu's donut at 1340 matches its urban profile shares.
  4. Stepping keyframes visits 1235, 1324, 1352, 1433 in order (wsahel keyframes) with cards.
  5. Toggling color-blind simulation (Chrome DevTools emulation in the test) still distinguishes relations by pattern.
  6. Lighthouse performance on a throttled "mid-tier mobile" profile >= 80.

### Phase 2: all five regions, arcs, debates, sources
- Remaining polities' geometry per geometry-audit section 5 (A, E, H methods). Swahili towns are points with small
  coastal buffers, not polygons. Tuareg as a hatched nomadic sphere, styled unlike a state.
- Diffusion arcs with mechanism styles, outcome glyphs, entry animation, external edge labels.
- Exemplar markers; `on_slider: false` handling; `found_at` (draw the findspot only inside the exemplar card's mini map).
- Debate cards, source cards with HAPP, outdated-title note.
- Region filter for keyframes.
- Acceptance: every record in africa.json is reachable by clicking within its span (automated: iterate records,
  set year, query rendered features); no console errors; data size budget met.

### Phase 3: lenses and the historiography control
- Lens tabs with InSPECT chips; neutral polygons outside the religion lens.
- "Whose sources?" filter with the survive rule and the "Showing N of M" counter.
- Teacher mode (`?teacher=1`): detail text, AP topic filter, verification and basis shown on every card.
- Acceptance: unchecking all voices but regional-outsider leaves al-Umari/Ibn Battuta-based records visible and fades
  oral-tradition-only records (test against known ids, e.g. any record whose evidence is only
  `src-niane-sundiata`-type insider sources).

### Phase 4: classroom modes and polish
- Present mode, Compare mode, keyboard map, print-friendly place card, offline caching.
- Image layer from `images.yaml` (only after Wil approves the image list; see decisions-for-wil.md).

## Data rules for the coding agent

- Never edit research YAML to make the app easier. If the data blocks a feature, write the problem in
  `docs/data-issues.md` and work around it in the app or ask Wil.
- New taxonomy values only through taxonomy.yaml and only with Wil's approval.
- `tools/validate.py` must pass in CI. Add checks there rather than in the app.
- Hand-drawn geometry is the one place you author historical content. Keep shapes coarse, mark them `method: H`,
  cite the `geometry_note` and any atlas used in `basis`, and list them for Wil's review.

## Risks

| Risk | Mitigation |
|---|---|
| Pattern fills look noisy at continent scale | Generate patterns at two scales and switch by zoom; keep the court ring thin |
| Too many arcs at once in the 1320s–1350s | Fade arcs older than 25 years to 40%; lens and region filters |
| Chromebook GPU limits | Keep feature counts low (polities are low-vertex), avoid per-frame style rebuilds; animate with `line-dasharray` steps |
| GPL obligations | Repo is GPL-3.0; `method` on every feature keeps a non-GPL redraw possible later |
| Data corrections after launch | The app reads only build JSON; corrections are YAML edits + CI |
