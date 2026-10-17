// Map markers drawn as DOM buttons (keyboard reachable, no glyph server needed for text):
//   place labels for polygons (with a town donut when the place has an urban stratum), town donuts with community
//   badges, squares for places with no polygon yet, event markers near the slider year, and exemplar markers.
// What shows depends on the zoom band (map/bands.ts): a place shows when its prominence tier is admitted by the
// band, and the town marker grows with zoom: a plain dot, then the share donut, then the donut with badges.
import * as maplibregl from 'maplibre-gl';
import type { Atlas, Visible } from '../atlas';
import type { AtlasEvent, Exemplar, Place, ReligionProfile } from '../data/types';
import { communitiesAt, covers, donutSegments, eventsNear, exemplarsAt, profileAt } from '../data/profiles';
import { h } from '../ui/dom';
import { badge, donut, dot, exemplarGlyph, pointSquare } from '../ui/glyphs';
import { shapeActive } from './religionLayer';
import { BAND_DETAIL, type Band, showsIn, tierRank, tiers } from './bands';
import { RunToken, chunked } from '../scheduler';

export interface MarkerHandlers {
  openPlace: (id: string) => void;
  openEvent: (id: string) => void;
  openExemplar: (id: string) => void;
}

/** Area labels of shapes smaller than this (square degrees) hide at continent scale, so names do not pile up. */
const SMALL_AREA = 4;

interface Entry {
  marker: maplibregl.Marker;
  el: HTMLElement;
  /** what the marker currently draws, so it redraws only on change */
  drawn?: string;
}

const lngLat = (p: Place): [number, number] | null => (p.location ? [p.location.lon, p.location.lat] : null);

export class MarkerLayer {
  private places = new Map<string, Entry>();
  private events = new Map<string, Entry>();
  private exemplars = new Map<string, Entry>();
  /** places with an urban stratum in the data: they get a donut even when they have a polygon */
  private hasUrban: Set<string>;
  private area = new Map<string, number>();
  /** prominence tiers, most prominent first (taxonomy) */
  private order: string[];

  private runs = new RunToken();
  private built: Promise<void>;

  constructor(map: maplibregl.Map, private atlas: Atlas, private on: MarkerHandlers) {
    this.map = map;
    this.order = tiers(atlas.tax);
    this.hasUrban = new Set(atlas.data.religion_profiles.filter((r) => r.stratum === 'urban').map((r) => r.place));
    for (const f of atlas.geo.polities.features) {
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      const a = polys.reduce((s, p) => s + Math.abs(p[0].reduce((acc, [x, y], i, r) => acc + (x * r[(i + 1) % r.length][1] - r[(i + 1) % r.length][0] * y), 0) / 2), 0);
      this.area.set(f.properties.place_id, Math.max(this.area.get(f.properties.place_id) ?? 0, a));
    }
    // Place markers are built a few per slice; update() waits for them.
    this.built = chunked(atlas.places, (p) => {
      const at = lngLat(p);
      if (!at) return;
      const el = this.placeElement(p);
      el.hidden = true;
      // An area's name moves below a town drawn at the same point (Gao and the Songhay kingdom of Gao).
      const shared = this.kindOf(p) === 'area' && atlas.places.some((q) => q.id !== p.id && this.kindOf(q) !== 'area'
        && q.location && Math.hypot(q.location.lon - at[0], q.location.lat - at[1]) < 0.3);
      const marker = new maplibregl.Marker({ element: el, anchor: 'center', offset: shared ? [0, 34] : [0, 0] })
        .setLngLat(at).addTo(map);
      this.places.set(p.id, { marker, el });
    }).then(() => undefined);
  }

  private map: maplibregl.Map;

  /** Event and exemplar markers exist only while they show: every DOM marker costs time on each map move. */
  private eventMarker(e: AtlasEvent): Entry | null {
    const cached = this.events.get(e.id);
    if (cached) return cached;
    const place = this.atlas.placeById.get(e.place);
    const at = place && lngLat(place);
    if (!at) return null;
    const el = h('button', {
      type: 'button', class: `event-marker${e.keyframe ? ' event-marker--keyframe' : ''}`,
      'data-event': e.id, 'aria-label': `Event, ${e.year}: ${e.title}`, title: `${e.year}: ${e.title}`,
      onclick: () => this.on.openEvent(e.id),
    });
    const marker = new maplibregl.Marker({ element: el, anchor: 'center', offset: [0, 0] }).setLngLat(at);
    const entry = { marker, el };
    this.events.set(e.id, entry);
    return entry;
  }

  private exemplarMarker(x: Exemplar, stack: number): Entry {
    const cached = this.exemplars.get(x.id);
    if (cached) return cached;
    const el = h('button', {
      type: 'button', class: 'exemplar-marker', 'data-exemplar': x.id, 'aria-label': `${x.name}. Open its card.`, title: x.name,
      onclick: (ev: Event) => { ev.stopPropagation(); this.on.openExemplar(x.id); },
    }, exemplarGlyph());
    // Lower left of the place point, clear of the donut and the event markers (upper right); several at one point stack.
    const marker = new maplibregl.Marker({ element: el, anchor: 'center', offset: [-14 - stack * 14, 12] }).setLngLat([x.location.lon, x.location.lat]);
    const entry = { marker, el };
    this.exemplars.set(x.id, entry);
    return entry;
  }

  private kindOf(p: Place): 'area' | 'town' | 'point' {
    if (this.atlas.withShape.has(p.id)) return 'area';
    return p.kind === 'city' || p.kind === 'site' ? 'town' : 'point';
  }

  private placeElement(p: Place): HTMLElement {
    const kind = this.kindOf(p);
    const small = kind === 'area' && (this.area.get(p.id) ?? 0) < SMALL_AREA;
    // Zoomed out, a place shows the first part of its name (before any parenthesis), the whole name close up.
    const short = p.name.split(' (')[0];
    return h('button', {
      type: 'button', class: `place-marker place-marker--${kind}${small ? ' place-marker--small' : ''}`,
      'data-place': p.id, 'data-kind': kind, 'data-tier': p.prominence ?? '', 'data-rank': String(tierRank(p.prominence, this.order)),
      onclick: (ev: Event) => { ev.stopPropagation(); this.on.openPlace(p.id); },
    }, h('span', { class: 'place-marker__glyph' }),
    h('span', { class: 'place-marker__name' },
      short !== p.name ? [h('span', { class: 'name--short' }, short), h('span', { class: 'name--full' }, p.name)] : p.name));
  }

  /** The town glyph for a band: a plain dot zoomed out, the share donut (with badges when the band shows them) closer. */
  private townGlyph(urban: ReligionProfile | null, comms: ReligionProfile[], band: Band): { key: string; nodes: Node[]; marker: string } {
    const detail = BAND_DETAIL[band];
    if (detail.marker === 'dot') return { key: `dot|${urban?.id}`, nodes: [dot(urban)], marker: 'dot' };
    const shown = detail.badges ? comms : [];
    const nodes: Node[] = [donut(urban), ...shown.map((c) => {
      const b = badge(c);
      b.classList.add('place-marker__badge');
      b.title = c.community_name ?? '';
      b.dataset.community = c.id;
      return b;
    })];
    return { key: ['donut', urban?.id, ...shown.map((c) => c.id)].join('|'), nodes, marker: 'donut' };
  }

  /** Redraw for a year, view and zoom band, in slices. Resolves when done (false if a newer update superseded it). */
  async update(year: number, visible: Visible = () => true, band: Band = 'near'): Promise<boolean> {
    const token = this.runs.next();
    await this.built;
    if (token.cancelled) return false;
    const profiles = this.atlas.data.religion_profiles;
    const detail = BAND_DETAIL[band];
    const done = await chunked(this.atlas.places, (p) => {
      const entry = this.places.get(p.id);
      if (!entry) return;
      const kind = this.kindOf(p);
      const shown = visible(p.id) && showsIn(band, p.prominence, this.order) && (kind === 'area'
        ? this.atlas.geo.polities.features.some((f) => f.properties.place_id === p.id && shapeActive(f, year))
        : covers(p.span ?? null, year));
      entry.el.hidden = !shown;
      if (!shown) return;
      const glyph = entry.el.querySelector('.place-marker__glyph')!;
      if (kind === 'town' || (kind === 'area' && this.hasUrban.has(p.id))) {
        // A town, or a polity drawn as an area that also has an urban stratum (a city-state, a coastal town).
        const urban = profileAt(profiles, p.id, 'urban', year);
        const comms = communitiesAt(profiles, p.id, year);
        entry.el.dataset.profile = urban?.id ?? '';
        entry.el.dataset.relation = urban?.relation ?? '';
        entry.el.dataset.segments = JSON.stringify(urban ? donutSegments(urban) : []);
        entry.el.setAttribute('aria-label', `${p.name}${kind === 'town' ? ', town' : ''}. Open its card.`);
        const g = this.townGlyph(urban, comms, band);
        if (entry.drawn !== g.key) {
          glyph.replaceChildren(...g.nodes);
          entry.el.dataset.marker = g.marker;
          entry.drawn = g.key;
        }
      } else if (kind === 'point') {
        const rural = profileAt(profiles, p.id, 'rural', year);
        const court = profileAt(profiles, p.id, 'court', year);
        // Zoomed out, a point place is a dot in its court's pattern (its rural one when the court is unknown).
        const asDot = detail.marker === 'dot';
        const key = `${asDot ? 'dot' : 'square'}|${rural?.id}|${court?.id}`;
        entry.el.setAttribute('aria-label', `${p.name}. Open its card.`);
        if (entry.drawn !== key) {
          glyph.replaceChildren(asDot ? dot(court ?? rural) : pointSquare(rural, court));
          entry.el.dataset.marker = asDot ? 'dot' : 'square';
          entry.drawn = key;
        }
      } else {
        entry.el.setAttribute('aria-label', `${p.name}. Open its card.`);
      }
    }, token);
    if (!done) return false;
    this.updateEvents(year, visible, detail.events);
    return chunked(this.exemplarJobs(year, visible, detail.exemplars), (job) => job(), token);
  }

  private updateEvents(year: number, visible: Visible, show: boolean): void {
    const near = new Set(show ? eventsNear(this.atlas.events, year).filter((e) => visible(e.id)).map((e) => e.id) : []);
    for (const [id, entry] of this.events) if (!near.has(id)) { entry.marker.remove(); this.events.delete(id); }
    // Stack events at one place so they do not hide each other.
    const stack = new Map<string, number>();
    for (const e of this.atlas.events) {
      if (!near.has(e.id)) continue;
      const entry = this.eventMarker(e);
      if (!entry) continue;
      const n = stack.get(e.place) ?? 0;
      stack.set(e.place, n + 1);
      entry.marker.setOffset([14 + n * 14, -14]);
      if (!entry.marker._map) entry.marker.addTo(this.map);
    }
  }

  /** One job per exemplar to add; the ones to remove go first. */
  private exemplarJobs(year: number, visible: Visible, show: boolean): (() => void)[] {
    const shown = new Set(show ? exemplarsAt(this.atlas.exemplars, year).filter((x) => visible(x.id)).map((x) => x.id) : []);
    const jobs: (() => void)[] = [];
    for (const [id, entry] of this.exemplars) if (!shown.has(id)) { entry.marker.remove(); this.exemplars.delete(id); }
    const stack = new Map<string, number>();
    for (const x of this.atlas.exemplars) {
      if (!shown.has(x.id)) continue;
      const key = `${x.location.lon},${x.location.lat}`;
      const n = stack.get(key) ?? 0;
      stack.set(key, n + 1);
      jobs.push(() => {
        const entry = this.exemplarMarker(x, n);
        if (!entry.marker._map) entry.marker.addTo(this.map);
      });
    }
    return jobs;
  }
}
