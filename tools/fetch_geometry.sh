#!/usr/bin/env bash
# Re-download the raw geometry sources (gitignored). Run from the repo root.
set -euo pipefail
A=data/geometry/raw/aourednik; N=data/geometry/raw/naturalearth
mkdir -p "$A" "$N"
AB=https://raw.githubusercontent.com/aourednik/historical-basemaps/master
curl -fsSL "$AB/index.json" -o "$A/index.json"
curl -fsSL "$AB/LICENSE" -o "$A/LICENSE"
curl -fsSL "$AB/geojson/places.geojson" -o "$A/places.geojson" || curl -fsSL "$AB/places.geojson" -o "$A/places.geojson"
for y in 1000 1100 1200 1279 1300 1400 1492 1500 1530; do
  curl -fsSL "$AB/geojson/world_$y.geojson" -o "$A/world_$y.geojson"
done
NB=https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson
for f in ne_10m_coastline ne_10m_land ne_10m_rivers_lake_centerlines ne_10m_lakes ne_10m_lakes_historic \
         ne_10m_playas ne_10m_geography_regions_polys ne_50m_land ne_50m_coastline ne_50m_ocean; do
  curl -fsSL "$NB/$f.geojson" -o "$N/$f.geojson"
done
C=data/geometry/raw/cliopatria; mkdir -p "$C"
CB=https://raw.githubusercontent.com/Seshat-Global-History-Databank/cliopatria/main
curl -fsSL "$CB/LICENSE.md" -o "$C/LICENSE.md"
curl -fsSL "https://github.com/Seshat-Global-History-Databank/cliopatria/raw/main/cliopatria.geojson.zip" -o "$C/cliopatria.geojson.zip"
echo "done. Shaded relief raster (SR_50M) and RESOLVE Ecoregions 2017 need a manual download; see docs/geometry-audit.md"
