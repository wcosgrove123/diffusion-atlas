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
}

export type PolityFeature = Feature<Polygon | MultiPolygon, PolityProps>;

/** data/build/<module>-geo.json, from tools/build_geometry.py */
export interface ModuleGeo {
  module: string;
  frame: ModuleFrame;
  attribution: string[];
  /** file name of each base layer under data/ (data/build/<module>-base-<layer>.json) */
  base: Record<BaseLayerName, string>;
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

export interface Source {
  id: string;
  title: string;
  author?: string;
  date?: string | number;
  kind?: string;
  type?: string;
  voice?: string;
  citation?: string;
}

export interface ModuleData {
  module: string;
  taxonomy_version: number | string;
  frame: ModuleFrame;
  places: Place[];
  religion_profiles: ReligionProfile[];
  diffusions: { id: string; from: string[]; to: string; _file: string }[];
  exemplars: unknown[];
  events: AtlasEvent[];
  sources: Source[];
  debates: unknown[];
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
  sources: { confidence: string[] };
  lenses: Record<string, { inspect: string; note: string }>;
  ap_topics: Record<string, string>;
  polity_profile: Record<string, string[]>;
}
