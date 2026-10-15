import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { frameBounds, panBounds } from '../data/frame';
import type { ModuleGeo } from '../data/types';
import { basePalette } from '../theme/palette';
import { MAP_MAXZOOM, buildBaseStyle } from './basemap';

// MapLibre loads its worker by a URL relative to its own module file, which the bundler moves.
// scripts/sync-public.mjs copies the worker and its shared chunk to public/vendor/maplibre/.
maplibregl.setWorkerUrl(`${import.meta.env.BASE_URL.replace(/\/?$/, '/')}vendor/maplibre/maplibre-gl-worker.mjs`);

export function createMap(container: HTMLElement, geo: ModuleGeo): maplibregl.Map {
  const map = new maplibregl.Map({
    container,
    style: buildBaseStyle(geo, basePalette),
    bounds: frameBounds(geo.frame),
    fitBoundsOptions: { padding: 16 },
    maxBounds: panBounds(geo.frame),
    maxZoom: MAP_MAXZOOM,
    renderWorldCopies: false,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    attributionControl: { compact: true },
  });
  map.touchZoomRotate.disableRotation();
  map.keyboard.disableRotation();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
  return map;
}
