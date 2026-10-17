// Year lookups over the research records. Pure functions: no DOM, no map.
import type { AtlasEvent, Diffusion, Exemplar, ModuleData, Place, ReligionProfile, Span, Taxonomy, TraditionEntry } from './types';

/**
 * A span covers year y when start <= y < end (end null = open-ended). docs/product-spec.md 3.1
 * A span whose end is not after its start (a one-year event, such as 1441 to 1441) covers that one year.
 */
export function covers(span: Span | null | undefined, year: number): boolean {
  if (!span) return false;
  if (span.start > year) return false;
  if (span.end === null || span.end === undefined) return true;
  return year < span.end || (span.end <= span.start && year === span.start);
}

/** The profile for place P, stratum S (and community name for stratum community) at year Y, or null. */
export function profileAt(
  profiles: ReligionProfile[], place: string, stratum: string, year: number, community?: string | null,
): ReligionProfile | null {
  return profiles.find((p) => p.place === place && p.stratum === stratum && covers(p.span, year)
    && (stratum !== 'community' || community === undefined || p.community_name === community)) ?? null;
}

/** Every community profile of a place covering the year (one per named community). */
export function communitiesAt(profiles: ReligionProfile[], place: string, year: number): ReligionProfile[] {
  return profiles.filter((p) => p.place === place && p.stratum === 'community' && covers(p.span, year));
}

/**
 * Shares in the order the taxonomy lists them (most to least). Used to rank traditions and to size donut segments
 * (docs/product-spec.md 3.1: dominant 3, significant 2, minority 1, trace 0.5).
 */
export const SHARE_WEIGHT: Record<string, number> = { dominant: 3, significant: 2, minority: 1, trace: 0.5 };

function weight(t: TraditionEntry): number {
  return SHARE_WEIGHT[t.share] ?? 0;
}

/** Traditions ranked by share (stable: ties keep the order the data lists them). */
export function rankedTraditions(p: ReligionProfile): TraditionEntry[] {
  return p.traditions.map((t, i) => ({ t, i })).sort((a, b) => weight(b.t) - weight(a.t) || a.i - b.i).map((x) => x.t);
}

export interface DonutSegment {
  tradition: string;
  share: string;
  /** fraction of the full circle, 0..1 */
  fraction: number;
}

/** Donut segments for an urban profile: one per tradition, sized by share weight. Unknown shares get no segment. */
export function donutSegments(p: ReligionProfile): DonutSegment[] {
  const ranked = rankedTraditions(p).filter((t) => weight(t) > 0);
  const total = ranked.reduce((s, t) => s + weight(t), 0);
  return ranked.map((t) => ({ tradition: t.tradition, share: t.share, fraction: weight(t) / total }));
}

/** Place ids drawn by the app: places in the shown regions' research files. */
export function shownPlaces(data: ModuleData): Place[] {
  const shown = new Set(data.frame.shown_regions);
  return data.places.filter((p) => shown.has(p._file));
}

/**
 * Places the shown records point to that live elsewhere (external origins, cities in other regions).
 * They are reachable from cards but not drawn as regional places.
 */
export function referencedPlaces(data: ModuleData): Place[] {
  const shown = new Set(data.frame.shown_regions);
  const own = new Set(shownPlaces(data).map((p) => p.id));
  const ids = new Set<string>();
  for (const d of data.diffusions) if (shown.has(d._file)) [...d.from, d.to].forEach((x) => ids.add(x));
  for (const e of data.events) if (shown.has(e._file)) ids.add(e.place);
  return data.places.filter((p) => ids.has(p.id) && !own.has(p.id));
}

export function shownDiffusions(data: ModuleData): Diffusion[] {
  const shown = new Set(data.frame.shown_regions);
  return data.diffusions.filter((d) => shown.has(d._file));
}

export function shownExemplars(data: ModuleData): Exemplar[] {
  const shown = new Set(data.frame.shown_regions);
  return data.exemplars.filter((e) => shown.has(e._file));
}

/** Arcs on the map at a year: diffusions of the lens whose span covers it (docs/product-spec.md 4). */
export function diffusionsAt(diffusions: Diffusion[], lens: string, year: number): Diffusion[] {
  return diffusions.filter((d) => d.lens === lens && covers(d.span, year));
}

/** Exemplars on the map at a year: from their span start, unless on_slider is false (product-spec 5). */
export function exemplarsAt(exemplars: Exemplar[], year: number): Exemplar[] {
  return exemplars.filter((e) => e.on_slider !== false && e.span.start <= year);
}

/** The lens the app opens on: the one the taxonomy marks as the default lens, else the first listed. */
export function defaultLens(tax: Taxonomy): string {
  const ids = Object.keys(tax.lenses);
  return ids.find((l) => /\bdefault\b/i.test(tax.lenses[l].note ?? '')) ?? ids[0];
}

export function shownEvents(data: ModuleData): AtlasEvent[] {
  const shown = new Set(data.frame.shown_regions);
  return data.events.filter((e) => shown.has(e._file)).sort((a, b) => a.year - b.year);
}

/** Keyframes of the shown regions, ascending by year (two regions may share a year; both are kept). */
export function keyframes(events: AtlasEvent[]): AtlasEvent[] {
  return events.filter((e) => e.keyframe).sort((a, b) => a.year - b.year);
}

/**
 * The next keyframe after the year. A keyframe at the year itself counts when it has not been visited yet, so the
 * first keyframe of the frame and a second keyframe in the same year are both reachable by stepping.
 */
export function nextKeyframe(kfs: AtlasEvent[], year: number, visited: Set<string> = new Set()): AtlasEvent | null {
  return kfs.find((e) => e.year > year || (e.year === year && !visited.has(e.id))) ?? null;
}

export function prevKeyframe(kfs: AtlasEvent[], year: number, visited: Set<string> = new Set()): AtlasEvent | null {
  return [...kfs].reverse().find((e) => e.year < year || (e.year === year && !visited.has(e.id))) ?? null;
}

/** Events shown as markers: within +/- window years of the slider year. */
export function eventsNear(events: AtlasEvent[], year: number, window = 5): AtlasEvent[] {
  return events.filter((e) => Math.abs(e.year - year) <= window);
}

/** The polity profile snapshot nearest the year. */
export function nearestSnapshot<T extends { year: number }>(snaps: T[] | undefined, year: number): T | null {
  if (!snaps || !snaps.length) return null;
  return [...snaps].sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year) || a.year - b.year)[0];
}

/** Two profiles show the same thing (court ring is omitted when it matches the fill). */
export function sameReligion(a: ReligionProfile | null, b: ReligionProfile | null): boolean {
  if (!a || !b) return false;
  const key = (p: ReligionProfile) => `${p.relation}|${rankedTraditions(p).map((t) => `${t.tradition}:${t.share}`).join(',')}`;
  return key(a) === key(b);
}
