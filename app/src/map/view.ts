// Where the map opens and where it goes: the current keyframe's region at region zoom (map/bands.ts, mid band),
// the region the dropdown picks, the region of a keyframe stepped to while it is off screen, and the arcs of a
// corridor clicked when zoomed out. Pure helpers here; the map calls are in main.ts.
import type * as maplibregl from 'maplibre-gl';
import type { Atlas } from '../atlas';
import { type Bounds, shownBounds } from '../data/frame';
import type { AtlasEvent, ModuleFrame } from '../data/types';

/**
 * The region whose story the slider is in: the latest keyframe at or before the year (the first keyframe when the
 * year is before all of them). Null when the module has no keyframes.
 */
export function keyframeRegion(keyframes: AtlasEvent[], year: number): string | null {
  const sorted = [...keyframes].sort((a, b) => a.year - b.year);
  if (!sorted.length) return null;
  const before = sorted.filter((k) => k.year <= year);
  return (before.length ? before[before.length - 1] : sorted[0])._file;
}

/** The area a region's places and shapes cover, padded a little; null when the region has nothing located. */
export function regionBounds(atlas: Atlas, region: string, pad = 0.8): Bounds | null {
  const places = atlas.places.filter((p) => p._file === region);
  if (!places.length) return null;
  const b = shownBounds(atlas.frame, places, atlas.geo, pad);
  // shownBounds falls back to the frame when nothing is located; that is not a region view
  return places.some((p) => p.location) ? b : null;
}

/** A zoom level held inside the region band: at least `mid`, and short of `near`. */
export function clampToRegionZoom(zoom: number, bands: ModuleFrame['zoom_bands']): number {
  return Math.min(Math.max(zoom, bands.mid), bands.near - 0.25);
}

/** The camera that frames bounds at region zoom, clear of the legend on wide screens. */
export function regionCamera(map: maplibregl.Map, bounds: Bounds, bands: ModuleFrame['zoom_bands'], padding: maplibregl.PaddingOptions): maplibregl.CameraOptions | null {
  const cam = map.cameraForBounds(bounds, { padding });
  if (!cam || cam.zoom === undefined) return null;
  return { center: cam.center, zoom: clampToRegionZoom(cam.zoom, bands) };
}
