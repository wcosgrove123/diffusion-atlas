// Shared app context: the loaded build files plus indexes and the slider year.
import type { AtlasEvent, ModuleData, ModuleFrame, ModuleGeo, Place, Source, Taxonomy } from './data/types';
import { keyframes, referencedPlaces, shownEvents, shownPlaces } from './data/profiles';

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
  keyframes: AtlasEvent[];
  /** place ids that have at least one polygon */
  withShape: Set<string>;
}

export function buildAtlas(data: ModuleData, geo: ModuleGeo, tax: Taxonomy): Atlas {
  const places = shownPlaces(data);
  const events = shownEvents(data);
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
    keyframes: keyframes(events),
    withShape: new Set(geo.polities.features.map((f) => f.properties.place_id)),
  };
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
