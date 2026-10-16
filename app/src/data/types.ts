// Shapes of the build files in data/build/. The app reads only these, never YAML.
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';

export interface Region {
  id: string;
  label: string;
}

/** One module frame, from data/modules.yaml via tools/export_taxonomy.py -> modules.json. */
export interface ModuleFrame {
  id: string;
  title: string;
  start: number;
  end: number;
  /** [min lon, min lat, max lon, max lat] */
  bbox: [number, number, number, number];
  /** The larger area the map may show and pan within; base geography is clipped to it. Contains bbox. */
  view_bbox: [number, number, number, number];
  /** Research files of the module, in the order the region filter lists them. */
  regions: Region[];
  /** The regions the app draws (a phase may show only some). */
  shown_regions: string[];
}

export interface ModuleIndex {
  modules: ModuleFrame[];
}

export const BASE_LAYER_NAMES = ['land', 'rivers', 'lakes', 'playas'] as const;
export type BaseLayerName = (typeof BASE_LAYER_NAMES)[number];

export interface PolityProps {
  place_id: string;
  year_from: number;
  /** null = open-ended */
  year_to: number | null;
  method: 'A' | 'E' | 'H';
  basis: string;
  /** "nomadic": a hatched sphere, not a state (geometry-audit 5, Tuareg) */
  zone?: string;
}

export type PolityFeature = Feature<Polygon | MultiPolygon, PolityProps>;

/** data/build/<module>-geo.json, from tools/build_geometry.py */
export interface ModuleGeo {
  module: string;
  frame: ModuleFrame;
  attribution: string[];
  /** file name under data/ of the base geography (data/build/<module>-base.json); features carry `layer` */
  base: string;
  polities: FeatureCollection<Polygon | MultiPolygon, PolityProps>;
}

// ---- research records (data/build/<module>.json, from tools/build_data.py) ----

export interface Span {
  start: number;
  /** null = open-ended */
  end: number | null;
  approx?: boolean;
}

export interface LatLon {
  lat: number;
  lon: number;
}

export interface PolityProfileSnapshot {
  year: number;
  [axis: string]: unknown;
}

export interface Place {
  id: string;
  name: string;
  alt_names?: string[];
  kind: string;
  region?: string;
  location?: LatLon | null;
  span?: Span | null;
  parent?: string | null | { id: string; start: number; end: number | null }[];
  geometry_note?: string;
  polity_profile?: PolityProfileSnapshot[];
  evidence?: string[];
  confidence?: string;
  _file: string;
}

export interface TraditionEntry {
  family: string;
  tradition: string;
  branch?: string;
  share: string;
  local_form?: string | null;
}

export interface ReligionProfile {
  id: string;
  place: string;
  span: Span;
  stratum: string;
  community_name?: string | null;
  traditions: TraditionEntry[];
  relation: string;
  basis?: string;
  summary: string;
  detail?: string;
  evidence: string[];
  confidence: string;
  flag?: string | null;
  _file: string;
}

export interface AtlasEvent {
  id: string;
  year: number;
  approx?: boolean;
  place: string;
  title: string;
  keyframe?: boolean;
  lenses?: string[];
  summary: string;
  detail?: string;
  evidence: string[];
  confidence: string;
  ap_topics?: string[];
  _file: string;
}

export interface Diffusion {
  id: string;
  lens: string;
  what: string;
  from: string[];
  to: string;
  span: Span;
  mechanism: string;
  carriers?: string[];
  outcome: string;
  summary: string;
  detail?: string;
  evidence: string[];
  confidence: string;
  ap_topics?: string[];
  _file: string;
}

export interface Exemplar {
  id: string;
  name: string;
  place: string;
  location: LatLon;
  span: Span;
  lenses: string[];
  summary: string;
  detail?: string;
  image_hint?: string;
  evidence: string[];
  confidence: string;
  /** when the surviving structure dates, if different from the founding */
  fabric_date?: number;
  /** a findspot far from the place; drawn only in the card's mini map */
  found_at?: { name: string; lat: number; lon: number };
  /** false: never on the map by year; reachable from cards only */
  on_slider?: boolean;
  _file: string;
}

export interface Debate {
  id: string;
  region?: string;
  question: string;
  positions: { view: string; who: string }[];
  links: string[];
  note?: string;
}

export interface Happ {
  historical_situation?: string;
  audience?: string;
  purpose?: string;
  point_of_view?: string;
}

export interface Source {
  id: string;
  title: string;
  author?: string;
  author_from?: string;
  date?: string | number;
  kind?: string;
  type?: string;
  voice?: string;
  happ?: Happ;
  citation?: string;
  url?: string | null;
  access?: string;
  verification?: string;
  verification_note?: string;
  notes?: string;
  cited_in?: string[];
}

export interface ModuleData {
  module: string;
  taxonomy_version: number | string;
  frame: ModuleFrame;
  places: Place[];
  religion_profiles: ReligionProfile[];
  diffusions: Diffusion[];
  exemplars: Exemplar[];
  events: AtlasEvent[];
  sources: Source[];
  debates: Debate[];
}

/** data/build/taxonomy.json: taxonomy.yaml as JSON plus a flattened traditions index. */
export interface Taxonomy {
  meta: { version: number | string };
  religion: {
    share: Record<string, string>;
    relation: Record<string, string>;
    relation_labels: Record<string, string>;
    basis: Record<string, string>;
  };
  strata: Record<string, string>;
  place_kinds: Record<string, string>;
  traditions: Record<string, { family: string; branches: string[]; overlays: string[] }>;
  diffusion: { mechanism: Record<string, string>; carriers: string[]; outcome: Record<string, string> };
  sources: {
    confidence: string[];
    type: Record<string, string>;
    voice: Record<string, string>;
    verification: Record<string, string>;
  };
  writing_rules: { banned_terms: string[] };
  lenses: Record<string, { inspect: string; note: string }>;
  ap_topics: Record<string, string>;
  polity_profile: Record<string, string[]>;
}
