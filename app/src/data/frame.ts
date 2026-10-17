import type { ModuleFrame, ModuleGeo, Place } from './types';

export type Bounds = [[number, number], [number, number]];

/** The frame bbox as MapLibre bounds [[west, south], [east, north]]. */
export function frameBounds(frame: ModuleFrame): Bounds {
  const [w, s, e, n] = frame.bbox;
  return [[w, s], [e, n]];
}

/**
 * Bounds the user may pan within: the frame's view_bbox, which the pipeline also clips the base
 * geography to (view_box() in tools/modules.py), so cut edges never come on screen.
 */
export function panBounds(frame: ModuleFrame): Bounds {
  const [w, s, e, n] = frame.view_bbox;
  return [[w, s], [e, n]];
}

/** Pick the module named in the URL (?module=<id>) or the first one listed. */
export function pickModule(frames: ModuleFrame[], requested: string | null): ModuleFrame {
  if (frames.length === 0) throw new Error('modules.json lists no modules');
  return frames.find((f) => f.id === requested) ?? frames[0];
}

/** "West, North, and East Africa, 1200–1450" (en dash for a range). */
export function frameLabel(frame: ModuleFrame): string {
  return `${frame.title}, ${frame.start}–${frame.end}`;
}

/**
 * The area the shown regions cover (their places and polygons), padded, as the first view. With every region shown
 * this is close to the module bbox; with one region shown (a phase slice) the map opens on that region.
 */
export function shownBounds(frame: ModuleFrame, places: Place[], geo: ModuleGeo, pad = 1.5): Bounds {
  const ids = new Set(places.map((p) => p.id));
  let [w, s, e, n] = [Infinity, Infinity, -Infinity, -Infinity];
  const add = (x: number, y: number) => { w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); };
  for (const p of places) if (p.location) add(p.location.lon, p.location.lat);
  for (const f of geo.polities.features) {
    if (!ids.has(f.properties.place_id)) continue;
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const poly of polys) for (const [x, y] of poly[0]) add(x, y);
  }
  if (!Number.isFinite(w)) return frameBounds(frame);
  const [vw, vs, ve, vn] = frame.view_bbox;
  return [[Math.max(vw, w - pad), Math.max(vs, s - pad)], [Math.min(ve, e + pad), Math.min(vn, n + pad)]];
}
