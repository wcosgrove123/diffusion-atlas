// Shapes of the build files in data/build/. The app reads only these, never YAML.
import type { FeatureCollection } from 'geojson';

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
}

export interface ModuleIndex {
  modules: ModuleFrame[];
}

export const BASE_LAYER_NAMES = ['land', 'rivers', 'lakes', 'playas'] as const;
export type BaseLayerName = (typeof BASE_LAYER_NAMES)[number];

/** data/build/<module>-geo.json, from tools/build_geometry.py */
export interface ModuleGeo {
  module: string;
  frame: ModuleFrame;
  attribution: string[];
  base: Record<BaseLayerName, FeatureCollection>;
  polities: FeatureCollection;
}
