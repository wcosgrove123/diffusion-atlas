import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { type Bounds, frameBounds, panBounds } from '../data/frame';
import { dataUrl } from '../data/load';
import type { ModuleGeo } from '../data/types';
import { basePalette } from '../theme/palette';
import { MAP_MAXZOOM, buildBaseStyle } from './basemap';
import { ensurePatterns } from './patterns';

// MapLibre loads its worker by a URL relative to its own module file, which the bundler moves.
// scripts/sync-public.mjs copies the worker and its shared chunk to public/vendor/maplibre/.
maplibregl.setWorkerUrl(`${import.meta.env.BASE_URL.replace(/\/?$/, '/')}vendor/maplibre/maplibre-gl-worker.mjs`);

export function createMap(container: HTMLElement, geo: ModuleGeo, bounds: Bounds = frameBounds(geo.frame)): maplibregl.Map {
  const map = new maplibregl.Map({
    container,
    style: buildBaseStyle(geo, basePalette, dataUrl),
    bounds,
    fitBoundsOptions: { padding: 16 },
    maxBounds: panBounds(geo.frame),
    maxZoom: MAP_MAXZOOM,
    renderWorldCopies: false,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    attributionControl: { compact: true },
    // tests/basemap.test.ts validates the style; skipping it here saves main-thread time on Chromebooks.
    validateStyle: false,
  });
  // Start the credits folded into the (i) button; they open on click. Open, they cover the map on a phone.
  const fold = () => container.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show');
  fold();
  map.once('load', fold);
  // The sea shows through the transparent canvas (no background layer; see buildBaseStyle).
  container.style.backgroundColor = basePalette.sea;
  // Patterns (relation fills, rings, dashed and dotted lines) are made on demand from their ids.
  map.setMissingStyleImageResolver((id) => ensurePatterns(map, [id]));
  map.touchZoomRotate.disableRotation();
  map.keyboard.disableRotation();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
  return map;
}
