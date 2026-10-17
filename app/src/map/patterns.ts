// Relation patterns (docs/product-spec.md 3.2). Every relation has a pattern as well as color, so the map still
// reads for color-blind students and on a washed-out projector. Patterns are computed pixel by pixel (no canvas
// needed), so the same code draws map fills, court rings, donuts, legend swatches, and runs in unit tests.
import type { ExpressionSpecification, FillLayerSpecification, LineLayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { mapInk, shade, traditionColor } from '../theme/palette';
import type { ReligionProfile } from '../data/types';
import { rankedTraditions } from '../data/profiles';

/** Relation values that have a pattern. A relation the taxonomy adds later falls back to plural's dots. */
export type PatternKind = 'exclusive' | 'plural' | 'syncretic' | 'coexisting' | 'contested' | 'undocumented';
const KINDS: PatternKind[] = ['exclusive', 'plural', 'syncretic', 'coexisting', 'contested', 'undocumented'];

export function patternKind(relation: string): PatternKind {
  return (KINDS as string[]).includes(relation) ? (relation as PatternKind) : 'plural';
}

/** Fill tiles and ring tiles (MapLibre wants power-of-two pattern sizes), in CSS pixels. */
export const FILL_TILE = { w: 32, h: 32 };
export const RING_TILE = { w: 32, h: 8 };
export const PIXEL_RATIO = 2;

type Shape = 'fill' | 'ring';
type Rgb = [number, number, number];

const mod = (a: number, n: number) => ((a % n) + n) % n;

/** Which color a point (u, v) in CSS pixels takes: 0 = first color (A), 1 = second (B). */
function sample(kind: PatternKind, shape: Shape, u: number, v: number): 0 | 1 {
  switch (kind) {
    case 'exclusive':
      return 0;
    case 'plural': {
      // A ground with dots of B
      if (shape === 'ring') return Math.hypot(mod(u, 8) - 4, v - 4) < 2.1 ? 1 : 0;
      const d1 = Math.hypot(mod(u, 16) - 4, mod(v, 16) - 4);
      const d2 = Math.hypot(mod(u, 16) - 12, mod(v, 16) - 12);
      return Math.min(d1, d2) < 2.8 ? 1 : 0;
    }
    case 'syncretic':
      // interleaved diagonal stripes of both
      return mod(u + v, 8) < 4 ? 1 : 0;
    case 'coexisting':
      // side by side: broad halves (vertical on fills, two parallel bands on rings)
      return shape === 'ring' ? (v < 4 ? 0 : 1) : (mod(u, 32) < 16 ? 0 : 1);
    case 'contested': {
      // A ground with a sawtooth line of B
      if (shape === 'ring') return Math.abs(v - (2 + Math.abs(mod(u, 8) - 4))) < 1.1 ? 1 : 0;
      const y = 4 + Math.abs(mod(u, 16) - 8);
      return Math.abs(mod(v, 16) - y) < 1.9 ? 1 : 0;
    }
    case 'undocumented':
      // crosshatch: B is the hatch ink
      return mod(u + v, 8) < 1.3 || mod(u - v, 8) < 1.3 ? 1 : 0;
  }
}

function toRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
}

export interface PatternImage {
  width: number;
  height: number;
  data: Uint8ClampedArray<ArrayBuffer>;
}

/** The shape of a tile (0 = color A, 1 = color B, in between on edges), computed once per kind and shape. */
const maskCache = new Map<string, Float32Array>();
function mask(kind: PatternKind, shape: Shape, width: number, height: number, ratio: number): Float32Array {
  const key = `${kind}|${shape}|${ratio}`;
  let m = maskCache.get(key);
  if (m) return m;
  m = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 2x2 supersampling softens the edges
      let nb = 0;
      for (const dy of [0.25, 0.75]) for (const dx of [0.25, 0.75]) nb += sample(kind, shape, (x + dx) / ratio, (y + dy) / ratio);
      m[y * width + x] = nb / 4;
    }
  }
  maskCache.set(key, m);
  return m;
}

/** Draw a pattern tile: the cached mask of its kind, colored A and B. */
export function patternImage(kind: PatternKind, a: string, b: string, shape: Shape = 'fill', ratio = PIXEL_RATIO): PatternImage {
  const tile = shape === 'ring' ? RING_TILE : FILL_TILE;
  const width = tile.w * ratio;
  const height = tile.h * ratio;
  const data = new Uint8ClampedArray(new ArrayBuffer(width * height * 4));
  const [ca, cb] = kind === 'undocumented' ? [toRgb(mapInk.undocumentedGround), toRgb(mapInk.undocumentedInk)] : [toRgb(a), toRgb(b)];
  const m = mask(kind, shape, width, height, ratio);
  for (let p = 0; p < width * height; p++) {
    const t = m[p];
    const i = p * 4;
    data[i] = Math.round(ca[0] * (1 - t) + cb[0] * t);
    data[i + 1] = Math.round(ca[1] * (1 - t) + cb[1] * t);
    data[i + 2] = Math.round(ca[2] * (1 - t) + cb[2] * t);
    data[i + 3] = 255;
  }
  return { width, height, data };
}

export interface ProfileLook {
  kind: PatternKind;
  /** first and second color (B equals A for exclusive) */
  a: string;
  b: string;
  /** traditions in rank order, for legends and tests */
  traditions: string[];
}

/** How a profile is drawn: the relation's pattern with the dominant tradition's color and the next one's. */
export function profileLook(p: ReligionProfile, colors?: Record<string, string>): ProfileLook {
  const kind = patternKind(p.relation);
  const ranked = rankedTraditions(p);
  const a = ranked[0] ? traditionColor(ranked[0].tradition, colors) : mapInk.undocumentedGround;
  let b = ranked[1] ? traditionColor(ranked[1].tradition, colors) : a;
  // Two entries of one tradition (an intra-tradition dispute): the second takes a darker shade of the same hue.
  if (kind !== 'exclusive' && kind !== 'undocumented' && b === a) b = shade(a, 0.45);
  return { kind, a, b, traditions: ranked.map((t) => t.tradition) };
}

/** A stable image id for a look, so each combination is generated once. */
export function patternId(look: Pick<ProfileLook, 'kind' | 'a' | 'b'>, shape: Shape = 'fill'): string {
  if (look.kind === 'undocumented') return `pat-${shape}-undocumented`;
  if (look.kind === 'exclusive') return `pat-${shape}-exclusive-${look.a.slice(1)}`;
  return `pat-${shape}-${look.kind}-${look.a.slice(1)}-${look.b.slice(1)}`;
}

/** Parse a pattern id back to its look (MapLibre asks for missing images by id). */
export function parsePatternId(id: string): { shape: Shape; kind: PatternKind; a: string; b: string } | null {
  const m = /^pat-(fill|ring)-([a-z]+)(?:-([0-9a-f]{6}))?(?:-([0-9a-f]{6}))?$/.exec(id);
  if (!m) return null;
  const a = m[3] ? `#${m[3]}` : mapInk.undocumentedGround;
  return { shape: m[1] as Shape, kind: patternKind(m[2]), a, b: m[4] ? `#${m[4]}` : a };
}

// ---- two shader programs for the whole map ----
// Each kind of layer paint makes MapLibre compile and bind its own WebGL program while the map starts, and each
// costs tens of ms of main-thread time on a Chromebook (and much more without a GPU). So every fill on the map
// (land, lakes, polities) is a pattern fill, and every line (rivers, coast, edges, rings, dashes, dots) is a pattern
// line, with pattern and opacity given as expressions. A plain color is a one-color pattern tile (solidId).


/** A one-color tile, for fills and lines that are a plain color. */
export function solidId(color: string): string {
  return `pat-solid-${color.slice(1)}`;
}

/** Fill paint: the feature's fill_pattern / fill_opacity if it has them, else the given pattern and opacity. */
export function fillPatternPaint(pattern: string, opacity = 1): FillLayerSpecification['paint'] {
  return {
    'fill-pattern': ['coalesce', ['get', 'fill_pattern'], pattern],
    'fill-opacity': ['coalesce', ['get', 'fill_opacity'], opacity],
    // No antialiased outline: it would be one more program, and edges have their own lines.
    'fill-antialias': false,
  };
}

/** Line paint with a pattern from a feature property (default line_pattern), falling back to the given one. */
export function linePatternPaint(
  pattern: string, width: number | ExpressionSpecification,
  o: { offset?: number; blur?: number; opacity?: number; patternProp?: string; opacityProp?: string } = {},
): LineLayerSpecification['paint'] {
  return {
    'line-pattern': ['coalesce', ['get', o.patternProp ?? 'line_pattern'], pattern],
    'line-opacity': ['coalesce', ['get', o.opacityProp ?? 'line_opacity'], o.opacity ?? 1],
    'line-width': width,
    ...(o.offset ? { 'line-offset': o.offset } : {}),
    ...(o.blur ? { 'line-blur': o.blur } : {}),
  };
}

// ---- dashed and dotted lines ----

export type InkLine = 'dash' | 'dots' | 'hatch';
const INK_TILE: Record<InkLine, { w: number; h: number }> = { dash: { w: 16, h: 4 }, dots: { w: 8, h: 4 }, hatch: { w: 16, h: 8 } };

export function inkLineId(kind: InkLine, color: string): string {
  return `pat-line-${kind}-${color.slice(1)}`;
}

/** A dashed or dotted line tile: ink on transparent, stretched across the line's width by MapLibre. */
export function inkLineImage(kind: InkLine, color: string, ratio = PIXEL_RATIO): PatternImage {
  const tile = INK_TILE[kind];
  const width = tile.w * ratio;
  const height = tile.h * ratio;
  const data = new Uint8ClampedArray(new ArrayBuffer(width * height * 4));
  const c = toRgb(color);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let n = 0;
      for (const dy of [0.25, 0.75]) {
        for (const dx of [0.25, 0.75]) {
          const u = (x + dx) / ratio;
          const v = (y + dy) / ratio;
          n += kind === 'dash' ? (u < 10 ? 1 : 0)
            : kind === 'dots' ? (Math.hypot(u - 4, v - 2) < 1.9 ? 1 : 0)
            // hatch: diagonal strokes across the line, a nomadic sphere's edge (geometry-audit 5)
            : (mod(u + v, 8) < 2.6 ? 1 : 0);
        }
      }
      data.set([c[0], c[1], c[2], Math.round((255 * n) / 4)], (y * width + x) * 4);
    }
  }
  return { width, height, data };
}

// ---- diffusion arcs (docs/product-spec.md 4) ----
// Mechanism as line style: relocation solid, hierarchical long dash, contagious dotted, stimulus double line,
// imposed thick with chevrons. The tile runs along the line (u) and across it (v); MapLibre stretches v to the
// line's width. Arc ids: arc-<style>-<hex>.

export type ArcStyle = 'solid' | 'longdash' | 'dotted' | 'double' | 'chevrons';
const ARC_STYLES: ArcStyle[] = ['solid', 'longdash', 'dotted', 'double', 'chevrons'];
/** Taxonomy mechanism -> line style. A mechanism added later draws solid until it gets a style here. */
export const MECHANISM_STYLE: Record<string, ArcStyle> = {
  relocation: 'solid', hierarchical: 'longdash', contagious: 'dotted', stimulus: 'double', imposed: 'chevrons',
};
export const arcStyle = (mechanism: string): ArcStyle => MECHANISM_STYLE[mechanism] ?? 'solid';
const ARC_TILE: Record<ArcStyle, { w: number; h: number }> = {
  solid: { w: 8, h: 8 }, longdash: { w: 32, h: 8 }, dotted: { w: 8, h: 8 }, double: { w: 8, h: 8 }, chevrons: { w: 16, h: 8 },
};

export function arcPatternId(style: ArcStyle, color: string): string {
  return `arc-${style}-${color.slice(1)}`;
}

function arcSample(style: ArcStyle, u: number, v: number): 0 | 1 {
  switch (style) {
    case 'solid': return 1;
    case 'longdash': return u < 22 ? 1 : 0;
    case 'dotted': return Math.hypot(u - 4, v - 4) < 2.6 ? 1 : 0;
    case 'double': return v < 2.4 || v > 5.6 ? 1 : 0;
    case 'chevrons': {
      // a gap shaped like a chevron pointing along the line, every 16 px
      const d = Math.abs(u - 9 - Math.abs(v - 4) * 0.9);
      return d < 1.4 ? 0 : 1;
    }
  }
}

export function arcImage(style: ArcStyle, color: string, ratio = PIXEL_RATIO): PatternImage {
  const tile = ARC_TILE[style];
  const width = tile.w * ratio;
  const height = tile.h * ratio;
  const data = new Uint8ClampedArray(new ArrayBuffer(width * height * 4));
  const c = toRgb(color);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let n = 0;
      for (const dy of [0.25, 0.75]) for (const dx of [0.25, 0.75]) n += arcSample(style, (x + dx) / ratio, (y + dy) / ratio);
      data.set([c[0], c[1], c[2], Math.round((255 * n) / 4)], (y * width + x) * 4);
    }
  }
  return { width, height, data };
}

/** The image for any pattern id this module makes, or null. */
export function imageForId(id: string): PatternImage | null {
  const solid = /^pat-solid-([0-9a-f]{6})$/.exec(id);
  if (solid) return patternImage('exclusive', `#${solid[1]}`, `#${solid[1]}`, 'ring');
  const arc = /^arc-([a-z]+)-([0-9a-f]{6})$/.exec(id);
  if (arc && (ARC_STYLES as string[]).includes(arc[1])) return arcImage(arc[1] as ArcStyle, `#${arc[2]}`);
  const ink = /^pat-line-(dash|dots|hatch)-([0-9a-f]{6})$/.exec(id);
  if (ink) return inkLineImage(ink[1] as InkLine, `#${ink[2]}`);
  const look = parsePatternId(id);
  return look ? patternImage(look.kind, look.a, look.b, look.shape) : null;
}

interface ImageHost {
  hasImage(id: string): boolean;
  addImage(id: string, image: PatternImage, options: { pixelRatio: number }): void;
}

/** Make sure every pattern a layer or feature names is in the map's image set. */
export function ensurePatterns(map: ImageHost, ids: (string | null | undefined)[]): void {
  for (const id of ids) {
    if (!id || map.hasImage(id)) continue;
    const img = imageForId(id);
    if (img) map.addImage(id, img, { pixelRatio: PIXEL_RATIO });
  }
}
