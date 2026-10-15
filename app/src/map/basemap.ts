import type { ExpressionSpecification, LayerSpecification, StyleSpecification } from '@maplibre/maplibre-gl-style-spec';
import type { BaseLayerName, ModuleGeo } from '../data/types';
import type { BasePalette } from '../theme/palette';

export const SOURCE_MAXZOOM = 7;
/** Deepest zoom the map allows. Base data is continent-scale, so street-level zoom has nothing to show. */
export const MAP_MAXZOOM = 9;

/**
 * The physical base map as a MapLibre style. Everything comes from the module's own GeoJSON:
 * no tile server, no sprite, no glyph server (school network filters; docs/product-spec.md 2).
 * No modern borders are drawn.
 */
export function buildBaseStyle(geo: ModuleGeo, p: BasePalette, url: (file: string) => string = (f) => f): StyleSpecification {
  // maxzoom caps how deep MapLibre tiles the GeoJSON; the data is about 1.5 km detail, so deeper tiles add
  // only CPU time (this matters on Chromebooks). The map overzooms past it.
  // Each layer is a URL: MapLibre's worker fetches and parses it, off the page's main thread.
  const src = (name: BaseLayerName) => ({ type: 'geojson' as const, data: url(geo.base[name]), maxzoom: SOURCE_MAXZOOM });
  const river = (id: string, rank: ExpressionSpecification, w2: number, w7: number): LayerSpecification => ({
    id,
    type: 'line',
    source: 'rivers',
    filter: ['all', ['<=', ['coalesce', ['get', 'min_zoom'], 0], ['+', ['zoom'], 3]], rank],
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': p.river, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, w2, 7, w7] },
  });
  return {
    version: 8,
    name: `${geo.module} base`,
    sources: {
      land: { ...src('land'), attribution: geo.attribution.join(' | ') },
      playas: src('playas'),
      lakes: src('lakes'),
      rivers: src('rivers'),
    },
    layers: [
      { id: 'sea', type: 'background', paint: { 'background-color': p.sea } },
      { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': p.land, 'fill-antialias': false } },
      { id: 'playas', type: 'fill', source: 'playas', paint: { 'fill-color': p.playa, 'fill-opacity': 0.8, 'fill-antialias': false } },
      // Rivers in two layers by Natural Earth scalerank, each with a zoom-only width. A width that varies per
      // feature makes MapLibre compile one more shader program, which costs main-thread time on Chromebooks.
      // min_zoom: minor rivers appear as the user zooms in.
      river('rivers', ['<=', ['coalesce', ['get', 'scalerank'], 9], 4], 1.4, 2.8),
      river('rivers-minor', ['>', ['coalesce', ['get', 'scalerank'], 9], 4], 0.6, 1.4),
      { id: 'lakes', type: 'fill', source: 'lakes', paint: { 'fill-color': p.lake, 'fill-antialias': false } },
      {
        // Lake Chad uses the historic outline with a dashed edge: its extent in the module years is not known.
        id: 'lakes-historic-edge',
        type: 'line',
        source: 'lakes',
        filter: ['==', ['get', 'historic'], true],
        paint: { 'line-color': p.lakeEdge, 'line-width': 0.8, 'line-dasharray': [2, 2] },
      },
      {
        // The coastline is the land outline. The outline also runs along the view box edge, which the map
        // never pans to, so it never shows.
        id: 'coastline',
        type: 'line',
        source: 'land',
        paint: { 'line-color': p.coastline, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.6, 7, 1.2] },
      },
    ],
  };
}
