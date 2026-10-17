// Small canvases: city donuts, community badges, point markers, legend swatches, timeline segments.
// Drawn with the same pattern code as the map (map/patterns.ts), so a swatch always matches the map.
import type { ReligionProfile } from '../data/types';
import { donutSegments } from '../data/profiles';
import { opacityFor } from '../map/religionLayer';
import { patternImage, profileLook, type PatternKind } from '../map/patterns';
import { mapInk, traditionColor } from '../theme/palette';

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

export const DONUT_SIZE = 34;

/**
 * A town's urban stratum (product-spec 3.1): one segment per tradition sized by share, the relation pattern as an
 * outer band, opacity by confidence. Undocumented = crosshatch; no profile = hollow dashed circle.
 */
export function donut(p: ReligionProfile | null, size = DONUT_SIZE): HTMLCanvasElement {
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

/** A community badge: a small pill in the community's dominant tradition color (crosshatch if undocumented). */
export function badge(p: ReligionProfile, w = 10, h = 16): HTMLCanvasElement {
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
export function pointSquare(rural: ReligionProfile | null, court: ReligionProfile | null, size = 22): HTMLCanvasElement {
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
