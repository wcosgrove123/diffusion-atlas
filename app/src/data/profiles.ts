// Year lookups over the research records. Pure functions: no DOM, no map.
import type { AtlasEvent, ModuleData, Place, ReligionProfile, Span, TraditionEntry } from './types';

/** A span covers year y when start <= y < end (end null = open-ended). docs/product-spec.md 3.1 */
export function covers(span: Span | null | undefined, year: number): boolean {
  if (!span) return false;
  return span.start <= year && (span.end === null || span.end === undefined || year < span.end);
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

export function shownEvents(data: ModuleData): AtlasEvent[] {
  const shown = new Set(data.frame.shown_regions);
  return data.events.filter((e) => shown.has(e._file)).sort((a, b) => a.year - b.year);
}

/** Keyframe years of the shown regions, ascending, one per year. */
export function keyframes(events: AtlasEvent[]): AtlasEvent[] {
  const seen = new Set<number>();
  return events.filter((e) => e.keyframe).sort((a, b) => a.year - b.year)
    .filter((e) => (seen.has(e.year) ? false : (seen.add(e.year), true)));
}

export function nextKeyframe(kfs: AtlasEvent[], year: number): AtlasEvent | null {
  return kfs.find((e) => e.year > year) ?? null;
}

export function prevKeyframe(kfs: AtlasEvent[], year: number): AtlasEvent | null {
  return [...kfs].reverse().find((e) => e.year < year) ?? null;
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
