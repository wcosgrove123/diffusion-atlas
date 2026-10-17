// Diffusion arcs (docs/product-spec.md 4): a curved arc from each `from` place to the `to` place while the slider
// year is inside the diffusion's span. Lens -> color, mechanism -> line style (pattern), outcome -> glyph at the
// destination, confidence -> opacity. Arcs to or from external places run to the frame edge with an edge label.
// On entering its span an arc animates once: a short pulse travels from origin to destination.
// Zoomed out (map/bands.ts, far band) the arcs collapse to one corridor line per route family (the build's
// corridor id: origin region to destination region), with no glyphs and no edge labels; clicking a corridor zooms
// in on it. Closer in, each diffusion draws its own arc; the off-map edge labels show on hover at region zoom
// and always when close up.
import * as maplibregl from 'maplibre-gl';
import type { Feature, FeatureCollection, LineString } from 'geojson';
import type { Atlas, Visible } from '../atlas';
import type { Diffusion, Place } from '../data/types';
import { diffusionsAt } from '../data/profiles';
import { lensColor, mapInk } from '../theme/palette';
import { h } from '../ui/dom';
import { outcomeGlyph } from '../ui/glyphs';
import { BAND_DETAIL, type Band, showsIn, tiers } from './bands';
import { SOURCE_MAXZOOM } from './basemap';
import { arcPatternId, arcStyle, ensurePatterns, linePatternPaint, solidId } from './patterns';
import { opacityFor } from './religionLayer';
import { RunToken, chunked } from '../scheduler';

export const ARC_SOURCE = 'arcs';
export const ARC_LAYERS = { line: 'arc-line', thick: 'arc-line-thick' } as const;
/** Mechanism styles drawn with the thick line (product-spec 4: imposed is "thick with chevrons"). */
const THICK_STYLES = new Set(['chevrons']);
const PULSE_MS = 900;
const STEPS = 24;
/** How strong a corridor line draws, relative to its most confident arc. */
const CORRIDOR_OPACITY = 0.45;

export interface ArcProps {
  /** the diffusion id; empty for a corridor */
  diffusion: string;
  from: string;
  to: string;
  /** route family (origin region to destination region), from the build */
  corridor: string;
  lens: string;
  mechanism: string;
  outcome: string;
  line_pattern: string;
  line_opacity: number;
  thick: boolean;
  /** which end is at the frame edge, if any */
  edge: 'from' | 'to' | null;
  /** corridors only: how many arcs it stands for, and the bounds to zoom to [[w, s], [e, n]] */
  count?: number;
  bounds?: string;
}

export type ArcFeature = Feature<LineString, ArcProps>;

type Pt = [number, number];

/** A quadratic curve from a to b, bowing to the left of travel by a share of the distance. */
export function arcPoints(a: Pt, b: Pt, bow = 0.18, steps = STEPS): Pt[] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const c: Pt = [(a[0] + b[0]) / 2 - (dy / len) * len * bow, (a[1] + b[1]) / 2 + (dx / len) * len * bow];
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    out.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]);
  }
  return out;
}

/** A small loop above a point, for a diffusion that moved within one place (from and to the same place). */
export function loopPoints(c: Pt, r = 1.1, steps = STEPS): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = Math.PI / 2 + (i / steps) * Math.PI * 2;
    out.push([c[0] + Math.cos(a) * r * 1.2, c[1] + r + Math.sin(a) * r]);
  }
  return out;
}

/** Where the straight line from inside point p toward outside point q crosses the frame bbox. */
export function edgePoint(p: Pt, q: Pt, bbox: [number, number, number, number]): Pt {
  const [w, s, e, n] = bbox;
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  let t = 1;
  if (dx > 0) t = Math.min(t, (e - p[0]) / dx);
  if (dx < 0) t = Math.min(t, (w - p[0]) / dx);
  if (dy > 0) t = Math.min(t, (n - p[1]) / dy);
  if (dy < 0) t = Math.min(t, (s - p[1]) / dy);
  t = Math.max(0, Math.min(1, t));
  return [p[0] + dx * t, p[1] + dy * t];
}

const at = (p: Place | undefined): Pt | null => (p?.location ? [p.location.lon, p.location.lat] : null);

/**
 * The arc features for one diffusion (one per origin). Arcs with no located end are skipped. `bowFor` gives each
 * origin-destination pair its bow, so several diffusions between the same two places draw as separate arcs.
 */
export function arcFeatures(d: Diffusion, atlas: Atlas, bowFor: (from: string, to: string) => number = () => 0.18): ArcFeature[] {
  const to = atlas.placeById.get(d.to);
  const toAt = at(to);
  if (!to || !toAt) return [];
  const style = arcStyle(d.mechanism);
  const out: ArcFeature[] = [];
  d.from.forEach((fromId, i) => {
    const from = atlas.placeById.get(fromId);
    const fromAt = at(from);
    if (!from || !fromAt) return;
    let a = fromAt;
    let b = toAt;
    let edge: ArcProps['edge'] = null;
    if (from.kind === 'external' && to.kind !== 'external') {
      a = edgePoint(toAt, fromAt, atlas.frame.bbox);
      edge = 'from';
    } else if (to.kind === 'external' && from.kind !== 'external') {
      b = edgePoint(fromAt, toAt, atlas.frame.bbox);
      edge = 'to';
    }
    out.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: fromId === d.to ? loopPoints(a) : arcPoints(a, b, bowFor(fromId, d.to)) },
      properties: {
        diffusion: d.id, from: fromId, to: d.to, corridor: d.corridor?.[i] ?? `${fromId}>${d.to}`,
        lens: d.lens, mechanism: d.mechanism, outcome: d.outcome,
        line_pattern: arcPatternId(style, lensColor(d.lens)), line_opacity: opacityFor(d.confidence),
        thick: THICK_STYLES.has(style), edge,
      },
    });
  });
  return out;
}

/**
 * One line per route family for the zoomed-out map: from the mean of the family's origins to the mean of its
 * destinations, in the lens color, as strong as its most confident arc. It carries the family's bounds so a
 * click can zoom in on it.
 */
export function corridorFeatures(features: ArcFeature[], lens: string): ArcFeature[] {
  const groups = new Map<string, ArcFeature[]>();
  for (const f of features) groups.set(f.properties.corridor, [...(groups.get(f.properties.corridor) ?? []), f]);
  const out: ArcFeature[] = [];
  for (const [corridor, members] of groups) {
    const mean = (pts: Pt[]): Pt => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
    const a = mean(members.map((f) => f.geometry.coordinates[0] as Pt));
    const b = mean(members.map((f) => f.geometry.coordinates[f.geometry.coordinates.length - 1] as Pt));
    let [w, s, e, n] = [Infinity, Infinity, -Infinity, -Infinity];
    for (const f of members) for (const [x, y] of f.geometry.coordinates) { w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); }
    const first = members[0].properties;
    out.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.5 ? loopPoints(a) : arcPoints(a, b) },
      properties: {
        diffusion: '', from: first.from, to: first.to, corridor, lens, mechanism: '', outcome: '',
        line_pattern: arcPatternId('solid', lensColor(lens)),
        // quieter than a single arc: a corridor is a hint of where to zoom, not a record
        line_opacity: CORRIDOR_OPACITY * Math.max(...members.map((f) => f.properties.line_opacity)),
        thick: false, edge: null, count: members.length, bounds: JSON.stringify([[w, s], [e, n]]),
      },
    });
  }
  return out;
}

export function addArcLayers(map: maplibregl.Map): void {
  map.addSource(ARC_SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] }, maxzoom: SOURCE_MAXZOOM });
  const fallback = solidId(mapInk.noRecord);
  map.addLayer({
    id: ARC_LAYERS.line, type: 'line', source: ARC_SOURCE, filter: ['!=', ['get', 'thick'], true],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: linePatternPaint(fallback, 4),
  });
  map.addLayer({
    id: ARC_LAYERS.thick, type: 'line', source: ARC_SOURCE, filter: ['==', ['get', 'thick'], true],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: linePatternPaint(fallback, 7),
  });
}

export interface ArcHandlers {
  openDiffusion: (id: string) => void;
  /** a corridor was clicked: zoom in on its arcs */
  zoomTo: (bounds: [[number, number], [number, number]]) => void;
}

/** The arcs for the current year and lens, with their outcome glyphs, edge labels and entry pulses. */
export class ArcLayer {
  private shown = new Set<string>();
  private glyphs = new Map<string, maplibregl.Marker>();
  private labels = new Map<string, maplibregl.Marker>();
  private first = true;
  private runs = new RunToken();
  private order: string[];

  constructor(private map: maplibregl.Map, private atlas: Atlas, private on: ArcHandlers) {
    this.order = tiers(atlas.tax);
    const hit = (p: maplibregl.Point) => map.queryRenderedFeatures(
      [[p.x - 6, p.y - 6], [p.x + 6, p.y + 6]], { layers: [ARC_LAYERS.line, ARC_LAYERS.thick] })[0];
    map.on('click', (e) => {
      const f = hit(e.point);
      if (f) {
        e.preventDefault();
        if (f.properties.diffusion) this.on.openDiffusion(String(f.properties.diffusion));
        else if (f.properties.bounds) this.on.zoomTo(JSON.parse(String(f.properties.bounds)));
      }
    });
    map.on('mousemove', (e) => {
      if (hit(e.point)) map.getCanvas().style.cursor = 'pointer';
    });
    map.on('zoomend', () => this.stackEdgeLabels());
  }

  /** Redraw for a year, lens and zoom band. The lines change at once; glyphs and labels follow in slices. */
  async update(year: number, lens: string, visible: Visible = () => true, band: Band = 'near'): Promise<boolean> {
    const token = this.runs.next();
    const detail = BAND_DETAIL[band];
    const current = diffusionsAt(this.atlas.diffusions, lens, year)
      .filter((d) => visible(d.id) && showsIn(band, d.prominence, this.order));
    // Diffusions between the same two places bow more each time, so their arcs and glyphs do not coincide.
    const seen = new Map<string, number>();
    const bowFor = (from: string, to: string) => {
      const n = seen.get(`${from}>${to}`) ?? 0;
      seen.set(`${from}>${to}`, n + 1);
      return 0.18 + n * 0.14;
    };
    const arcs = current.flatMap((d) => arcFeatures(d, this.atlas, bowFor));
    const corridors = detail.arcs === 'corridor';
    const features = corridors ? corridorFeatures(arcs, lens) : arcs;
    const fc: FeatureCollection<LineString, ArcProps> = { type: 'FeatureCollection', features };
    ensurePatterns(this.map, features.map((f) => f.properties.line_pattern));
    (this.map.getSource(ARC_SOURCE) as maplibregl.GeoJSONSource).setData(fc);

    const ids = new Set(corridors ? [] : current.map((d) => d.id));
    for (const [key, m] of this.glyphs) if (!ids.has(key.split('|')[0])) { m.remove(); this.glyphs.delete(key); }
    // One edge label per external place and direction, shared by every arc that runs to it.
    const wanted = new Set(detail.edgeLabels === 'none' ? []
      : features.filter((f) => f.properties.edge).map((f) => `${f.properties.edge}|${f.properties.edge === 'from' ? f.properties.from : f.properties.to}`));
    for (const [key, m] of this.labels) if (!wanted.has(key)) { m.remove(); this.labels.delete(key); }
    // Arcs that entered their span since the last draw pulse once; a change of band alone pulses nothing.
    const entered = corridors ? [] : features.filter((f) => !this.first && !this.shown.has(f.properties.diffusion));
    this.shown = new Set(current.map((d) => d.id));
    this.first = false;
    const done = await chunked(features, (f) => {
      const p = f.properties;
      const key = `${p.diffusion}|${p.from}`;
      const line = f.geometry.coordinates as Pt[];
      if (corridors) return;
      if (!this.glyphs.has(key)) {
        // The glyph sits a little short of the destination so it does not cover the town's circle.
        const el = h('button', {
          type: 'button', class: 'arc-glyph', 'data-diffusion': p.diffusion, 'data-outcome': p.outcome,
          'aria-label': `Diffusion: ${this.atlas.diffusionById.get(p.diffusion)?.what ?? p.diffusion}. Open its card.`,
          onclick: (ev: Event) => { ev.stopPropagation(); this.on.openDiffusion(p.diffusion); },
        }, outcomeGlyph(p.outcome, lensColor(p.lens), p.line_opacity));
        const m = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(line[Math.round(STEPS * 0.76)]).addTo(this.map);
        this.glyphs.set(key, m);
      }
      const extId = p.edge === 'from' ? p.from : p.to;
      const labelKey = `${p.edge}|${extId}`;
      if (p.edge && wanted.has(labelKey) && !this.labels.has(labelKey)) {
        const ext = this.atlas.placeById.get(extId);
        const pt = p.edge === 'from' ? line[0] : line[line.length - 1];
        const text = `${p.edge === 'from' ? 'from' : 'to'} ${ext?.name ?? ''}`;
        // A button: at region zoom the name shows on hover, focus or a click (the map's data-edge-labels says which).
        const el = h('button', {
          type: 'button', class: `arc-edge arc-edge--${p.edge}`, 'data-external': extId, 'aria-label': text, 'aria-expanded': 'false',
          onclick: (ev: Event) => { ev.stopPropagation(); el.setAttribute('aria-expanded', el.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'); },
        }, h('span', { class: 'arc-edge__dot', 'aria-hidden': 'true' }), h('span', { class: 'arc-edge__text' }, text));
        const m = new maplibregl.Marker({ element: el, anchor: this.edgeAnchor(pt) }).setLngLat(pt).addTo(this.map);
        this.labels.set(labelKey, m);
      }
    }, token);
    if (!done) return false;
    this.stackEdgeLabels();
    for (const f of entered) this.pulse(f.geometry.coordinates as Pt[]);
    return true;
  }

  /** Edge labels on one side of the frame stack instead of overlapping (re-done on zoom: it depends on pixels). */
  private stackEdgeLabels(): void {
    const bySide = new Map<string, { m: maplibregl.Marker; pos: number; size: number }[]>();
    for (const m of this.labels.values()) {
      const ll = m.getLngLat();
      const side = this.edgeAnchor([ll.lng, ll.lat]);
      const p = this.map.project(ll);
      const along = side === 'top' || side === 'bottom';
      // Estimated size (about 6.5 px per character plus padding): measuring would force a layout per label.
      const size = along ? (m.getElement().textContent?.length ?? 10) * 6.5 + 14 : 22;
      bySide.set(side, [...(bySide.get(side) ?? []), { m, pos: along ? p.x : p.y, size }]);
    }
    for (const [side, list] of bySide) {
      list.sort((a, b) => a.pos - b.pos);
      let lane = 0;
      let lastEnd = -Infinity;
      for (const { m, pos, size } of list) {
        const start = pos - size / 2;
        lane = start < lastEnd + 8 ? lane + 1 : 0;
        lastEnd = Math.max(lastEnd, pos + size / 2);
        const step = 20 * lane;
        m.setOffset(side === 'top' ? [0, step] : side === 'bottom' ? [0, -step] : side === 'left' ? [step, 0] : [-step, 0]);
      }
    }
  }

  /** Keep an edge label inside the frame: anchor it on the side that faces the edge. */
  private edgeAnchor(pt: Pt): maplibregl.PositionAnchor {
    const [w, s, e, n] = this.atlas.frame.bbox;
    const eps = 0.05;
    if (Math.abs(pt[0] - e) < eps) return 'right';
    if (Math.abs(pt[0] - w) < eps) return 'left';
    if (Math.abs(pt[1] - n) < eps) return 'top';
    if (Math.abs(pt[1] - s) < eps) return 'bottom';
    // an external place inside the frame (al-Andalus, the Levant): the label sits above its point
    return 'bottom';
  }

  /** A short pulse travels along the arc once (product-spec 4). */
  private pulse(line: Pt[]): void {
    const el = h('span', { class: 'arc-pulse', 'aria-hidden': 'true' });
    const m = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(line[0]).addTo(this.map);
    const t0 = performance.now();
    const step = (now: number) => {
      // the first frame's timestamp can precede t0 (it is the frame's start), so clamp both ends
      const t = Math.max(0, Math.min(1, (now - t0) / PULSE_MS));
      const i = t * (line.length - 1);
      const k = Math.floor(i);
      const a = line[k];
      const b = line[Math.min(line.length - 1, k + 1)];
      const r = i - k;
      m.setLngLat([a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]);
      if (t < 1) requestAnimationFrame(step);
      else m.remove();
    };
    requestAnimationFrame(step);
  }
}
