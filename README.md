# Diffusion Atlas

A time-slider map of cultural diffusion for AP World History, by Wil Cosgrove.
First module: **West, North, and East Africa, 1200–1450**, with religion as the primary lens.

The map colors people, not states: every place carries religion profiles for its court, its towns, and its
countryside, across time. Students see how religion and other culture moved (mechanism, carriers), what happened
when it arrived (outcome), and whose sources tell us so.

## What's here

| Path | What |
|---|---|
| `data/taxonomy.yaml` | Controlled vocabularies, world-general (works for future Asia, Middle East, Europe modules) |
| `data/research/africa/` | The dataset: places, religion profiles, diffusions, exemplars, events, sources, debates |
| `data/geometry/` | Clipped historical boundaries (aourednik/historical-basemaps, GPL-3.0), the shape recipes (`polity-shapes.yaml`) and the built polygons |
| `tools/` | Validator, data build, geometry extraction |
| `docs/` | Product spec, build plan, AP CED alignment, fact-check, language review, corrections log, open decisions |
| `data/modules.yaml` | Module frames: years, map bounds, and the area the map may show |
| `app/` | The web app (Vite, TypeScript, MapLibre); reads only `data/build/*.json` |

Dataset (Africa module): 91 places, 219 religion profiles, 117 diffusions, 55 exemplars, 55 events (25 keyframes),
325 sources, 42 debates.

## Run

```
pip install -r requirements.txt
python3 tools/validate.py
python3 tools/build_data.py africa
python3 tools/export_taxonomy.py
python3 tools/build_geometry.py africa
cd app && npm ci && npm run dev
```

Pushing to `main` on GitHub runs `.github/workflows/pages.yml`: it validates the data, runs the tests, builds the
site, and publishes it to GitHub Pages (set Settings, Pages, Source to "GitHub Actions" once).

## License

GPL-3.0 (the repository ships modified data from aourednik/historical-basemaps, GPL-3.0).
Base geography from Natural Earth (public domain).
