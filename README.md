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
| `data/geometry/` | Clipped historical boundaries (aourednik/historical-basemaps, GPL-3.0) and the geometry audit |
| `tools/` | Validator, data build, geometry extraction |
| `docs/` | Product spec, build plan, AP CED alignment, fact-check, language review, corrections log, open decisions |
| `app/` | The web app (to be built; see docs/build-plan.md) |

Dataset (Africa module): 91 places, 219 religion profiles, 117 diffusions, 55 exemplars, 55 events (25 keyframes),
325 sources, 42 debates.

## Run

```
pip install pyyaml jsonschema shapely pyproj
python3 tools/validate.py
python3 tools/build_data.py africa
```

## License

GPL-3.0 (the repository ships modified data from aourednik/historical-basemaps, GPL-3.0).
Base geography from Natural Earth (public domain).
