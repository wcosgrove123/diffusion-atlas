import type { ExpressionSpecification, LayerSpecification, StyleSpecification } from '@maplibre/maplibre-gl-style-spec';
import { fillPatternPaint, inkLineId, linePatternPaint, solidId } from './patterns';
import type { BaseLayerName, ModuleGeo } from '../data/types';
import type { BasePalette } from '../theme/palette';

export const SOURCE_MAXZOOM = 7;
/** Deepest zoom the map allows. Base data is continent-scale, so street-level zoom has nothing to show. */
export const MAP_MAXZOOM = 9;

/**
 * The physical base map as a MapLibre style. Everything comes from the module's own GeoJSON:
 * no tile server, no sprite, no glyph server (school network filters; docs/product-spec.md 2).
 * No modern borders are drawn. The sea is the map container's background color (createMap), not a layer, and
 * fills and lines are drawn with patterns: both keep the number of WebGL programs down (see map/patterns.ts).
 */
export function buildBaseStyle(geo: ModuleGeo, p: BasePalette, url: (file: string) => string = (f) => f): StyleSpecification {
  // maxzoom caps how deep MapLibre tiles the GeoJSON; the data is about 1.5 km detail, so deeper tiles add
  // only CPU time (this matters on Chromebooks). The map overzooms past it.
  // One source, given as a URL: MapLibre's worker fetches and parses it off the page's main thread, and its tiles
  // arrive together, so the map redraws fewer times while it loads. Each feature's `layer` names its base layer.
  const of = (name: BaseLayerName): ExpressionSpecification => ['==', ['get', 'layer'], name];
  const river = (id: string, rank: ExpressionSpecification, w2: number, w7: number): LayerSpecification => ({
    id,
    type: 'line',
    source: 'base',
    filter: ['all', of('rivers'), ['<=', ['coalesce', ['get', 'min_zoom'], 0], ['+', ['zoom'], 3]], rank],
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: linePatternPaint(solidId(p.river), ['interpolate', ['linear'], ['zoom'], 2, w2, 7, w7]),
  });
  return {
    version: 8,
    name: `${geo.module} base`,
    sources: {
      base: { type: 'geojson', data: url(geo.base), maxzoom: SOURCE_MAXZOOM, attribution: geo.attribution.join(' | ') },
    },
    layers: [
      { id: 'land', type: 'fill', source: 'base', filter: of('land'), paint: fillPatternPaint(solidId(p.land)) },
      { id: 'playas', type: 'fill', source: 'base', filter: of('playas'), paint: fillPatternPaint(solidId(p.playa), 0.8) },
      // Rivers in two layers by Natural Earth scalerank, each with a zoom-only width. A width that varies per
      // feature makes MapLibre compile one more shader program, which costs main-thread time on Chromebooks.
      // min_zoom: minor rivers appear as the user zooms in.
      river('rivers', ['<=', ['coalesce', ['get', 'scalerank'], 9], 4], 1.4, 2.8),
      river('rivers-minor', ['>', ['coalesce', ['get', 'scalerank'], 9], 4], 0.6, 1.4),
      { id: 'lakes', type: 'fill', source: 'base', filter: of('lakes'), paint: fillPatternPaint(solidId(p.lake)) },
      {
        // Lake Chad uses the historic outline with a dashed edge: its extent in the module years is not known.
        id: 'lakes-historic-edge',
        type: 'line',
        source: 'base',
        filter: ['all', of('lakes'), ['==', ['get', 'historic'], true]],
        paint: linePatternPaint(inkLineId('dash', p.lakeEdge), 1.2),
      },
      {
        // The coastline is the land outline. The outline also runs along the view box edge, which the map
        // never pans to, so it never shows.
        id: 'coastline',
        type: 'line',
        source: 'base',
        filter: of('land'),
        paint: linePatternPaint(solidId(p.coastline), ['interpolate', ['linear'], ['zoom'], 2, 0.6, 7, 1.2]),
      },
    ],
  };
}
