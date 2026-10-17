// Shared app context: the loaded build files plus indexes and the slider year.
import type { AtlasEvent, Debate, Diffusion, Exemplar, ModuleData, ModuleFrame, ModuleGeo, Place, Source, Taxonomy } from './data/types';
import { keyframes, referencedPlaces, shownDiffusions, shownEvents, shownExemplars, shownPlaces } from './data/profiles';

export interface Atlas {
  frame: ModuleFrame;
  data: ModuleData;
  geo: ModuleGeo;
  tax: Taxonomy;
  /** places the app draws (shown regions) */
  places: Place[];
  /** every place a card can open: drawn places plus places their records point to */
  placeById: Map<string, Place>;
  sourceById: Map<string, Source>;
  events: AtlasEvent[];
  eventById: Map<string, AtlasEvent>;
  diffusions: Diffusion[];
  diffusionById: Map<string, Diffusion>;
  exemplars: Exemplar[];
  exemplarById: Map<string, Exemplar>;
  debates: Debate[];
  debateById: Map<string, Debate>;
  /** every keyframe of the shown regions; the region filter narrows it (see Timeline) */
  keyframes: AtlasEvent[];
  /** place ids that have at least one polygon */
  withShape: Set<string>;
  /** the AP World view: which records it shows and why; null when the module has no list */
  ap: ApView | null;
}

export interface ApView {
  defaultView: 'ap' | 'all';
  why: Map<string, string>;
  sources: string[];
}

/** Which records a view shows: everything, or the AP World set. */
export type Visible = (id: string) => boolean;

export function visibleIn(atlas: Atlas, apOnly: boolean): Visible {
  const ap = atlas.ap;
  if (!apOnly || !ap) return () => true;
  return (id) => ap.why.has(id);
}

export function buildAtlas(data: ModuleData, geo: ModuleGeo, tax: Taxonomy): Atlas {
  const places = shownPlaces(data);
  const events = shownEvents(data);
  const diffusions = shownDiffusions(data);
  const exemplars = shownExemplars(data);
  const shownIds = new Set([...places.map((p) => p.id), ...diffusions.map((d) => d.id), ...exemplars.map((e) => e.id)]);
  // Debates are shown when they link to anything on the map.
  const debates = data.debates.filter((db) => db.links.some((l) => shownIds.has(l)));
  return {
    frame: data.frame,
    data,
    geo,
    tax,
    places,
    placeById: new Map([...places, ...referencedPlaces(data)].map((p) => [p.id, p])),
    sourceById: new Map(data.sources.map((s) => [s.id, s])),
    events,
    eventById: new Map(events.map((e) => [e.id, e])),
    diffusions,
    diffusionById: new Map(diffusions.map((d) => [d.id, d])),
    exemplars,
    exemplarById: new Map(exemplars.map((e) => [e.id, e])),
    debates,
    debateById: new Map(debates.map((d) => [d.id, d])),
    keyframes: keyframes(events),
    withShape: new Set(geo.polities.features.map((f) => f.properties.place_id)),
    ap: data.ap_world ? {
      defaultView: data.ap_world.default_view, sources: data.ap_world.sources,
      why: new Map(Object.entries(data.ap_world.why)),
    } : null,
  };
}

/** Records that cite a source, by kind, for the source card. */
export function citedBy(atlas: Atlas, sourceId: string): { kind: string; id: string; label: string }[] {
  const out: { kind: string; id: string; label: string }[] = [];
  const has = (ev: string[] | undefined) => (ev ?? []).includes(sourceId);
  for (const p of atlas.places) if (has(p.evidence)) out.push({ kind: 'place', id: p.id, label: p.name });
  for (const r of atlas.data.religion_profiles) {
    if (has(r.evidence) && atlas.placeById.has(r.place)) {
      out.push({ kind: 'place', id: r.place, label: `${atlas.placeById.get(r.place)!.name}, ${r.stratum}` });
    }
  }
  for (const d of atlas.diffusions) if (has(d.evidence)) out.push({ kind: 'diffusion', id: d.id, label: d.what });
  for (const e of atlas.exemplars) if (has(e.evidence)) out.push({ kind: 'exemplar', id: e.id, label: e.name });
  for (const e of atlas.events) if (has(e.evidence)) out.push({ kind: 'event', id: e.id, label: `${e.year}: ${e.title}` });
  return out;
}

type Listener = (year: number) => void;

/** The slider year, clamped to the module frame. */
export class YearState {
  private listeners: Listener[] = [];
  constructor(private frame: ModuleFrame, public year: number) {}

  set(year: number): void {
    const y = Math.max(this.frame.start, Math.min(this.frame.end, Math.round(year)));
    if (y === this.year) return;
    this.year = y;
    for (const l of this.listeners) l(y);
  }

  on(l: Listener): void {
    this.listeners.push(l);
  }
}
