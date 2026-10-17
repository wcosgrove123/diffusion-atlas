// Small canvases: city donuts, community badges, point markers, legend swatches, timeline segments.
// Drawn with the same pattern code as the map (map/patterns.ts), so a swatch always matches the map.
import type { ReligionProfile } from '../data/types';
import { donutSegments } from '../data/profiles';
import { opacityFor } from '../map/religionLayer';
import { type ArcStyle, arcImage, patternImage, profileLook, type PatternKind } from '../map/patterns';
import { mapInk, traditionColor } from '../theme/palette';

/**
 * Glyphs are drawn once per distinct look and cloned: the map carries about 150 small canvases, and drawing each
 * from scratch (patterns, arcs, text) took most of the startup on a slow Chromebook. A clone is one drawImage.
 */
export type Glyph = HTMLCanvasElement | HTMLImageElement;
const protoCache = new Map<string, { canvas: HTMLCanvasElement; url: string; used: boolean }>();
function cached(key: string, draw: () => HTMLCanvasElement): Glyph {
  let proto = protoCache.get(key);
  if (!proto) {
    const canvas = draw();
    proto = { canvas, url: '', used: false };
    protoCache.set(key, proto);
  }
  // The first use gets the canvas itself; later uses get an image of it (no 2D context each, which is what costs).
  if (!proto.used) {
    proto.used = true;
    return proto.canvas;
  }
  if (!proto.url) proto.url = proto.canvas.toDataURL();
  const img = new Image();
  img.src = proto.url;
  img.width = parseFloat(proto.canvas.style.width);
  img.height = parseFloat(proto.canvas.style.height);
  img.alt = '';
  return img;
}

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const ratio = Math.max(1, Math.round(window.devicePixelRatio || 1));
  const c = document.createElement('canvas');
  c.width = w * ratio;
  c.height = h * ratio;
  c.style.width = `${w}px`;
  c.style.height = `${h}px`;
  const ctx = c.getContext('2d')!;
  ctx.scale(ratio, ratio);
  return [c, ctx];
}

const tileCache = new Map<string, HTMLCanvasElement>();

/** A canvas holding one pattern tile at 1x, usable with ctx.createPattern. */
function tileCanvas(kind: PatternKind, a: string, b: string): HTMLCanvasElement {
  const key = `${kind}|${a}|${b}`;
  let c = tileCache.get(key);
  if (!c) {
    const img = patternImage(kind, a, b, 'fill', 1);
    c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    c.getContext('2d')!.putImageData(new ImageData(img.data, img.width, img.height), 0, 0);
    tileCache.set(key, c);
  }
  return c;
}

function fillWith(ctx: CanvasRenderingContext2D, kind: PatternKind, a: string, b: string): void {
  ctx.fillStyle = kind === 'exclusive' ? a : ctx.createPattern(tileCanvas(kind, a, b), 'repeat')!;
}

/** A rectangle of a relation pattern (legend, cards). */
export function swatch(kind: PatternKind, a: string, b: string, w = 28, h = 18): HTMLCanvasElement {
  const [c, ctx] = canvas(w, h);
  fillWith(ctx, kind, a, b);
  ctx.fillRect(0, 0, w, h);
  return c;
}

/** Data URL of a pattern tile (CSS backgrounds in the mini timeline). */
export function patternDataUrl(kind: PatternKind, a: string, b: string): string {
  return tileCanvas(kind, a, b).toDataURL();
}

/** A short piece of an arc in a mechanism's line style (legend, diffusion card). */
export function arcSwatch(style: ArcStyle, color: string, w = 44, h = 10): HTMLCanvasElement {
  const [c, ctx] = canvas(w, h);
  const img = arcImage(style, color, 1);
  const tile = document.createElement('canvas');
  tile.width = img.width;
  tile.height = img.height;
  tile.getContext('2d')!.putImageData(new ImageData(img.data, img.width, img.height), 0, 0);
  const lineH = style === 'chevrons' ? 7 : 4;
  ctx.save();
  ctx.translate(0, (h - lineH) / 2);
  ctx.scale(1, lineH / img.height);
  ctx.fillStyle = ctx.createPattern(tile, 'repeat-x')!;
  ctx.fillRect(0, 0, w, img.height);
  ctx.restore();
  return c;
}

/** Outcome glyph shapes (product-spec 4), keyed by taxonomy outcome. An outcome without a shape draws a diamond. */
type GlyphShape = 'filled' | 'triangle' | 'half' | 'two' | 'bar' | 'gapbar' | 'hollow' | 'x' | 'star' | 'question' | 'diamond';
const OUTCOME_SHAPE: Record<string, GlyphShape> = {
  adoption: 'filled', 'elite-only': 'triangle', syncretism: 'half', coexistence: 'two', resistance: 'bar',
  withheld: 'gapbar', 'no-uptake': 'hollow', loss: 'x', impact: 'star', undocumented: 'question',
};

/** The glyph at an arc's destination: what happened where the idea arrived. */
export function outcomeGlyph(outcome: string, color: string, alpha = 1, size = 18): Glyph {
  return cached(`outcome|${outcome}|${color}|${alpha}|${size}`, () => drawOutcomeGlyph(outcome, color, alpha, size));
}

function drawOutcomeGlyph(outcome: string, color: string, alpha: number, size: number): HTMLCanvasElement {
  const [c, ctx] = canvas(size, size);
  const m = size / 2;
  const r = size / 2 - 3;
  const shape = OUTCOME_SHAPE[outcome] ?? 'diamond';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  // keyline first, then the colored glyph on top, so it reads on any fill
  for (const pass of ['key', 'ink'] as const) {
    ctx.globalAlpha = pass === 'key' ? 1 : alpha;
    ctx.strokeStyle = pass === 'key' ? mapInk.keyline : color;
    ctx.fillStyle = pass === 'key' ? mapInk.keyline : color;
    ctx.lineWidth = pass === 'key' ? 5 : 2;
    const circle = (fill: boolean) => {
      ctx.beginPath();
      ctx.arc(m, m, r, 0, Math.PI * 2);
      if (fill && pass === 'ink') ctx.fill();
      ctx.stroke();
    };
    switch (shape) {
      case 'filled': circle(true); break;
      case 'hollow': circle(false); break;
      case 'half':
        circle(false);
        if (pass === 'ink') { ctx.beginPath(); ctx.arc(m, m, r, Math.PI / 2, -Math.PI / 2); ctx.closePath(); ctx.fill(); }
        break;
      case 'two':
        for (const dx of [-r / 2, r / 2]) { ctx.beginPath(); ctx.arc(m + dx, m, r / 2, 0, Math.PI * 2); if (pass === 'ink') ctx.fill(); ctx.stroke(); }
        break;
      case 'triangle':
        ctx.beginPath(); ctx.moveTo(m, m - r); ctx.lineTo(m + r, m + r * 0.7); ctx.lineTo(m - r, m + r * 0.7); ctx.closePath();
        if (pass === 'ink') ctx.fill();
        ctx.stroke();
        break;
      case 'bar':
        ctx.beginPath(); ctx.moveTo(m - r, m); ctx.lineTo(m + r, m); ctx.stroke();
        break;
      case 'gapbar':
        ctx.beginPath(); ctx.moveTo(m - r, m); ctx.lineTo(m - 1.5, m); ctx.moveTo(m + 1.5, m); ctx.lineTo(m + r, m); ctx.stroke();
        break;
      case 'x':
        ctx.beginPath(); ctx.moveTo(m - r, m - r); ctx.lineTo(m + r, m + r); ctx.moveTo(m + r, m - r); ctx.lineTo(m - r, m + r); ctx.stroke();
        break;
      case 'star':
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          const rr = i % 2 ? r * 0.45 : r;
          ctx[i ? 'lineTo' : 'moveTo'](m + Math.cos(a) * rr, m + Math.sin(a) * rr);
        }
        ctx.closePath();
        if (pass === 'ink') ctx.fill();
        ctx.stroke();
        break;
      case 'question':
        circle(false);
        if (pass === 'ink') {
          ctx.font = `bold ${size * 0.62}px system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', m, m + 0.5);
        }
        break;
      case 'diamond':
        ctx.beginPath(); ctx.moveTo(m, m - r); ctx.lineTo(m + r, m); ctx.lineTo(m, m + r); ctx.lineTo(m - r, m); ctx.closePath();
        if (pass === 'ink') ctx.fill();
        ctx.stroke();
        break;
    }
  }
  return c;
}

/** An exemplar marker: a small building-like glyph (a square with a peaked top) in the exemplar ink. */
export function exemplarGlyph(size = 16): Glyph {
  return cached(`exemplar|${size}`, () => drawExemplarGlyph(size));
}

function drawExemplarGlyph(size: number): HTMLCanvasElement {
  const [c, ctx] = canvas(size, size);
  const draw = (color: string, lw: number) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lw;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(3, size - 3);
    ctx.lineTo(3, size * 0.5);
    ctx.lineTo(size / 2, 3);
    ctx.lineTo(size - 3, size * 0.5);
    ctx.lineTo(size - 3, size - 3);
    ctx.closePath();
    ctx.stroke();
  };
  draw(mapInk.keyline, 5);
  draw(mapInk.exemplar, 2);
  ctx.fillStyle = mapInk.exemplar;
  ctx.fillRect(size / 2 - 1.5, size * 0.62, 3, size - 3 - size * 0.62);
  return c;
}

export const DONUT_SIZE = 34;

/**
 * A town's urban stratum (product-spec 3.1): one segment per tradition sized by share, the relation pattern as an
 * outer band, opacity by confidence. Undocumented = crosshatch; no profile = hollow dashed circle.
 */
const lookKey = (p: ReligionProfile | null) => (p ? `${p.relation}|${p.confidence}|${p.traditions.map((t) => `${t.tradition}:${t.share}`).join(',')}` : 'none');

export function donut(p: ReligionProfile | null, size = DONUT_SIZE): Glyph {
  return cached(`donut|${size}|${lookKey(p)}`, () => drawDonut(p, size));
}

function drawDonut(p: ReligionProfile | null, size: number): HTMLCanvasElement {
  const [c, ctx] = canvas(size, size);
  const cx = size / 2;
  const rOut = size / 2 - 1.5;
  const rBand = rOut - 4;
  const rIn = rBand * 0.45;
  const ring = (r0: number, r1: number, a0 = -Math.PI / 2, a1 = a0 + Math.PI * 2) => {
    ctx.beginPath();
    ctx.arc(cx, cx, r1, a0, a1);
    ctx.arc(cx, cx, r0, a1, a0, true);
    ctx.closePath();
  };
  if (!p) {
    ctx.setLineDash([3, 2]);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = mapInk.noRecord;
    ctx.beginPath();
    ctx.arc(cx, cx, rBand, 0, Math.PI * 2);
    ctx.stroke();
    return c;
  }
  // keyline under everything so the donut reads on any fill
  ctx.fillStyle = mapInk.keyline;
  ring(rIn - 1.5, rOut + 1.5);
  ctx.fill();
  ctx.globalAlpha = opacityFor(p.confidence);
  const look = profileLook(p);
  if (look.kind === 'undocumented') {
    fillWith(ctx, 'undocumented', look.a, look.b);
    ring(rIn, rOut);
    ctx.fill();
    return c;
  }
  // relation band
  fillWith(ctx, look.kind, look.a, look.b);
  ring(rBand + 0.8, rOut);
  ctx.fill();
  // share segments, clockwise from the top, with a thin keyline gap between them
  const segs = donutSegments(p);
  let a0 = -Math.PI / 2;
  for (const s of segs) {
    const a1 = a0 + s.fraction * Math.PI * 2;
    ctx.fillStyle = traditionColor(s.tradition);
    ring(rIn, rBand, a0, a1);
    ctx.fill();
    a0 = a1;
  }
  if (segs.length > 1) {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = mapInk.keyline;
    ctx.lineWidth = 1.2;
    let a = -Math.PI / 2;
    for (const s of segs) {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rIn, cx + Math.sin(a) * rIn);
      ctx.lineTo(cx + Math.cos(a) * rBand, cx + Math.sin(a) * rBand);
      ctx.stroke();
      a += s.fraction * Math.PI * 2;
    }
  }
  return c;
}

export const DOT_SIZE = 14;

/**
 * A town zoomed out (map/bands.ts, far band): one plain dot in the urban profile's relation pattern and
 * tradition colors, opacity by confidence. No profile = hollow dashed dot. The donut replaces it closer in.
 */
export function dot(p: ReligionProfile | null, size = DOT_SIZE): Glyph {
  return cached(`dot|${size}|${lookKey(p)}`, () => drawDot(p, size));
}

function drawDot(p: ReligionProfile | null, size: number): HTMLCanvasElement {
  const [c, ctx] = canvas(size, size);
  const cx = size / 2;
  const r = size / 2 - 1.5;
  if (!p) {
    ctx.setLineDash([3, 2]);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = mapInk.noRecord;
    ctx.beginPath();
    ctx.arc(cx, cx, r - 1, 0, Math.PI * 2);
    ctx.stroke();
    return c;
  }
  ctx.fillStyle = mapInk.keyline;
  ctx.beginPath();
  ctx.arc(cx, cx, r + 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = opacityFor(p.confidence);
  const look = profileLook(p);
  fillWith(ctx, look.kind, look.a, look.b);
  ctx.beginPath();
  ctx.arc(cx, cx, r, 0, Math.PI * 2);
  ctx.fill();
  return c;
}

/** A community badge: a small pill in the community's dominant tradition color (crosshatch if undocumented). */
export function badge(p: ReligionProfile, w = 10, h = 16): Glyph {
  return cached(`badge|${w}|${h}|${lookKey(p)}`, () => drawBadge(p, w, h));
}

function drawBadge(p: ReligionProfile, w: number, h: number): HTMLCanvasElement {
  const [c, ctx] = canvas(w + 2, h + 2);
  const pill = (x: number, y: number, ww: number, hh: number) => {
    ctx.beginPath();
    ctx.roundRect(x, y, ww, hh, ww / 2);
  };
  ctx.fillStyle = mapInk.keyline;
  pill(0, 0, w + 2, h + 2);
  ctx.fill();
  ctx.globalAlpha = opacityFor(p.confidence);
  const look = profileLook(p);
  fillWith(ctx, look.kind, look.a, look.b);
  pill(1, 1, w, h);
  ctx.fill();
  return c;
}

/**
 * A place with no polygon (yet): a square in the rural pattern with the court pattern as its border, so the same
 * fill and ring reading applies. No rural profile = dashed outline.
 */
export function pointSquare(rural: ReligionProfile | null, court: ReligionProfile | null, size = 22): Glyph {
  return cached(`point|${size}|${lookKey(rural)}|${lookKey(court)}`, () => drawPointSquare(rural, court, size));
}

function drawPointSquare(rural: ReligionProfile | null, court: ReligionProfile | null, size: number): HTMLCanvasElement {
  const [c, ctx] = canvas(size, size);
  ctx.fillStyle = mapInk.keyline;
  ctx.fillRect(0, 0, size, size);
  if (court) {
    const look = profileLook(court);
    ctx.globalAlpha = opacityFor(court.confidence);
    fillWith(ctx, look.kind, look.a, look.b);
    ctx.fillRect(1, 1, size - 2, size - 2);
    ctx.globalAlpha = 1;
    ctx.fillStyle = mapInk.keyline;
    ctx.fillRect(5, 5, size - 10, size - 10);
  }
  const inset = court ? 6 : 1;
  if (rural) {
    const look = profileLook(rural);
    ctx.globalAlpha = opacityFor(rural.confidence);
    fillWith(ctx, look.kind, look.a, look.b);
    ctx.fillRect(inset, inset, size - 2 * inset, size - 2 * inset);
  } else {
    ctx.setLineDash([3, 2]);
    ctx.strokeStyle = mapInk.noRecord;
    ctx.lineWidth = 1.4;
    ctx.strokeRect(inset + 0.5, inset + 0.5, size - 2 * inset - 1, size - 2 * inset - 1);
  }
  return c;
}
