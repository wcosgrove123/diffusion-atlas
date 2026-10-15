// The religion lens on the map: polity and people polygons for the slider year (docs/product-spec.md 3.1-3.3).
//   fill        = rural stratum (the majority): dominant tradition's color, relation as pattern
//   inner ring  = court stratum: same encoding, drawn just inside the edge; omitted when it matches the fill
//   undocumented = gray crosshatch; no profile for the year = outline only
//   confidence -> opacity; basis inferred/projected -> dotted border; soft (feathered) edges, never crisp borders
import type * as maplibregl from 'maplibre-gl';
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import type { ModuleData, ModuleGeo, Place, PolityFeature, ReligionProfile } from '../data/types';
import { covers, profileAt, sameReligion, shownPlaces } from '../data/profiles';
import { mapInk } from '../theme/palette';
import { SOURCE_MAXZOOM } from './basemap';
import { ensurePatterns, fillPatternPaint, inkLineId, linePatternPaint, patternId, profileLook, solidId } from './patterns';

/** product-spec 3.3: high 1.0, medium 0.75, low 0.5 */
export const CONFIDENCE_OPACITY: Record<string, number> = { high: 1, medium: 0.75, low: 0.5 };
export const opacityFor = (confidence: string | undefined) => CONFIDENCE_OPACITY[confidence ?? ''] ?? 0.5;

const DOTTED_BASIS = ['inferred', 'projected'];
/** Ink line patterns the religion layers draw (dashed "no record" edges, dotted basis borders). */
export const NO_RECORD_DASH = inkLineId('dash', mapInk.noRecord);
export const BASIS_DOTS = inkLineId('dots', mapInk.basisDots);
const SOFT_EDGE = solidId(mapInk.softEdge);

export interface PolityStyleProps {
  place_id: string;
  name: string;
  method: string;
  rural_profile: string | null;
  rural_relation: string | null;
  fill_pattern: string | null;
  fill_opacity: number;
  rural_basis: string | null;
  court_profile: string | null;
  court_relation: string | null;
  ring_pattern: string | null;
  ring_opacity: number;
  court_basis: string | null;
}

export const POLITY_SOURCE = 'polities';
export const POLITY_LAYERS = {
  fill: 'polity-fill',
  noRecord: 'polity-no-record',
  soft: 'polity-soft-edge',
  basis: 'polity-basis',
  ring: 'court-ring',
  ringBasis: 'court-basis',
} as const;

/** Is a polity shape in force at the year? (year_from <= y < year_to; null = open-ended) */
export function shapeActive(f: PolityFeature, year: number): boolean {
  return covers({ start: f.properties.year_from, end: f.properties.year_to }, year);
}

function ringArea(r: number[][]): number {
  let s = 0;
  for (let i = 0; i < r.length - 1; i++) s += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1];
  return Math.abs(s / 2);
}

function area(g: Polygon | MultiPolygon): number {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  return polys.reduce((s, p) => s + ringArea(p[0]), 0);
}

/** The styled polygons for a year, largest first so smaller polities draw on top of the ones that contain them. */
export function polityFeatures(data: ModuleData, geo: ModuleGeo, year: number): FeatureCollection<Polygon | MultiPolygon, PolityStyleProps> {
  const places = new Map(shownPlaces(data).map((p) => [p.id, p]));
  const out: Feature<Polygon | MultiPolygon, PolityStyleProps>[] = [];
  for (const f of geo.polities.features as PolityFeature[]) {
    const place = places.get(f.properties.place_id);
    if (!place || !shapeActive(f, year)) continue;
    out.push({ type: 'Feature', geometry: f.geometry, properties: styleProps(data.religion_profiles, place, year, f.properties.method) });
  }
  out.sort((a, b) => area(b.geometry) - area(a.geometry));
  return { type: 'FeatureCollection', features: out };
}

export function styleProps(profiles: ReligionProfile[], place: Place, year: number, method = ''): PolityStyleProps {
  const rural = profileAt(profiles, place.id, 'rural', year);
  const court = profileAt(profiles, place.id, 'court', year);
  const showCourt = court && !sameReligion(court, rural);
  return {
    place_id: place.id,
    name: place.name,
    method,
    rural_profile: rural?.id ?? null,
    rural_relation: rural?.relation ?? null,
    fill_pattern: rural ? patternId(profileLook(rural), 'fill') : null,
    fill_opacity: opacityFor(rural?.confidence),
    rural_basis: rural?.basis ?? null,
    court_profile: court?.id ?? null,
    court_relation: court?.relation ?? null,
    ring_pattern: showCourt ? patternId(profileLook(court), 'ring') : null,
    ring_opacity: opacityFor(court?.confidence),
    court_basis: court?.basis ?? null,
  };
}

export function addReligionLayers(map: maplibregl.Map, beforeId: string): void {
  map.addSource(POLITY_SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] }, maxzoom: SOURCE_MAXZOOM });
  const has = (k: string) => ['!=', ['get', k], null] as maplibregl.ExpressionSpecification;
  const dotted = (k: string) => ['in', ['get', k], ['literal', DOTTED_BASIS]] as maplibregl.ExpressionSpecification;
  const layers: maplibregl.LayerSpecification[] = [
    {
      id: POLITY_LAYERS.fill, type: 'fill', source: POLITY_SOURCE, filter: has('fill_pattern'),
      paint: fillPatternPaint(solidId(mapInk.noRecord)),
    },
    {
      // Feathered edge: pre-modern borders were zones, so no crisp line (product-spec 3.3).
      id: POLITY_LAYERS.soft, type: 'line', source: POLITY_SOURCE,
      paint: linePatternPaint(SOFT_EDGE, 7, { blur: 6, opacity: 0.4 }),
    },
    {
      id: POLITY_LAYERS.noRecord, type: 'line', source: POLITY_SOURCE, filter: ['!', has('fill_pattern')],
      paint: linePatternPaint(NO_RECORD_DASH, 1.6),
    },
    {
      id: POLITY_LAYERS.basis, type: 'line', source: POLITY_SOURCE, filter: dotted('rural_basis'),
      layout: { 'line-join': 'round' },
      paint: linePatternPaint(BASIS_DOTS, 2),
    },
    {
      // Outer rings are counter-clockwise (tools/build_geometry.py), which puts the inside on the positive side.
      id: POLITY_LAYERS.ring, type: 'line', source: POLITY_SOURCE, filter: has('ring_pattern'),
      layout: { 'line-join': 'round' },
      paint: linePatternPaint(SOFT_EDGE, 8, { offset: 9, patternProp: 'ring_pattern', opacityProp: 'ring_opacity' }),
    },
    {
      id: POLITY_LAYERS.ringBasis, type: 'line', source: POLITY_SOURCE,
      filter: ['all', has('ring_pattern'), dotted('court_basis')],
      layout: { 'line-join': 'round' },
      paint: linePatternPaint(BASIS_DOTS, 2, { offset: 16 }),
    },
  ];
  ensurePatterns(map, [NO_RECORD_DASH, BASIS_DOTS, SOFT_EDGE, solidId(mapInk.noRecord)]);
  for (const l of layers) map.addLayer(l, beforeId);
}

export function updateReligionLayers(map: maplibregl.Map, fc: FeatureCollection<Polygon | MultiPolygon, PolityStyleProps>): void {
  ensurePatterns(map, fc.features.flatMap((f) => [f.properties.fill_pattern, f.properties.ring_pattern]));
  (map.getSource(POLITY_SOURCE) as maplibregl.GeoJSONSource).setData(fc);
}
