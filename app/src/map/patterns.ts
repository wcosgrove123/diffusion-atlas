// Relation patterns (docs/product-spec.md 3.2). Every relation has a pattern as well as color, so the map still
// reads for color-blind students and on a washed-out projector. Patterns are computed pixel by pixel (no canvas
// needed), so the same code draws map fills, court rings, donuts, legend swatches, and runs in unit tests.
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

/** Draw a pattern tile. 2x2 supersampling softens the edges. */
export function patternImage(kind: PatternKind, a: string, b: string, shape: Shape = 'fill', ratio = PIXEL_RATIO): PatternImage {
  const tile = shape === 'ring' ? RING_TILE : FILL_TILE;
  const width = tile.w * ratio;
  const height = tile.h * ratio;
  const data = new Uint8ClampedArray(new ArrayBuffer(width * height * 4));
  const [ca, cb] = kind === 'undocumented' ? [toRgb(mapInk.undocumentedGround), toRgb(mapInk.undocumentedInk)] : [toRgb(a), toRgb(b)];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let nb = 0;
      for (const dy of [0.25, 0.75]) for (const dx of [0.25, 0.75]) nb += sample(kind, shape, (x + dx) / ratio, (y + dy) / ratio);
      const t = nb / 4;
      const i = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = Math.round(ca[c] * (1 - t) + cb[c] * t);
      data[i + 3] = 255;
    }
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
