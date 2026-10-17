// Map markers drawn as DOM buttons (keyboard reachable, no glyph server needed for text):
//   place labels for polygons, town donuts (urban stratum) with community badges,
//   squares for places with no polygon yet, and event markers near the slider year.
import * as maplibregl from 'maplibre-gl';
import type { Atlas } from '../atlas';
import type { AtlasEvent, Place } from '../data/types';
import { communitiesAt, covers, donutSegments, eventsNear, profileAt } from '../data/profiles';
import { h } from '../ui/dom';
import { badge, donut, pointSquare } from '../ui/glyphs';
import { shapeActive } from './religionLayer';

export interface MarkerHandlers {
  openPlace: (id: string) => void;
  openEvent: (id: string) => void;
}

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

  constructor(map: maplibregl.Map, private atlas: Atlas, private on: MarkerHandlers) {
    for (const p of atlas.places) {
      const at = lngLat(p);
      if (!at) continue;
      const el = this.placeElement(p);
      // An area's name moves below a town drawn at the same point (Gao and the Songhay kingdom of Gao).
      const shared = this.kindOf(p) === 'area' && atlas.places.some((q) => q.id !== p.id && this.kindOf(q) !== 'area'
        && q.location && Math.hypot(q.location.lon - at[0], q.location.lat - at[1]) < 0.3);
      const marker = new maplibregl.Marker({ element: el, anchor: 'center', offset: shared ? [0, 34] : [0, 0] })
        .setLngLat(at).addTo(map);
      this.places.set(p.id, { marker, el });
    }
    for (const e of atlas.events) {
      const place = atlas.placeById.get(e.place);
      const at = place && lngLat(place);
      if (!at) continue;
      const el = h('button', {
        type: 'button', class: `event-marker${e.keyframe ? ' event-marker--keyframe' : ''}`,
        'data-event': e.id, 'aria-label': `Event, ${e.year}: ${e.title}`, title: `${e.year}: ${e.title}`,
        onclick: () => this.on.openEvent(e.id),
      });
      const marker = new maplibregl.Marker({ element: el, anchor: 'center', offset: [0, 0] }).setLngLat(at).addTo(map);
      this.events.set(e.id, { marker, el });
    }
  }

  private kindOf(p: Place): 'area' | 'town' | 'point' {
    if (this.atlas.withShape.has(p.id)) return 'area';
    return p.kind === 'city' || p.kind === 'site' ? 'town' : 'point';
  }

  private placeElement(p: Place): HTMLElement {
    const kind = this.kindOf(p);
    return h('button', {
      type: 'button', class: `place-marker place-marker--${kind}`, 'data-place': p.id, 'data-kind': kind,
      onclick: (ev: Event) => { ev.stopPropagation(); this.on.openPlace(p.id); },
    }, h('span', { class: 'place-marker__glyph' }), h('span', { class: 'place-marker__name' }, p.name));
  }

  update(year: number): void {
    const profiles = this.atlas.data.religion_profiles;
    for (const p of this.atlas.places) {
      const entry = this.places.get(p.id);
      if (!entry) continue;
      const kind = this.kindOf(p);
      const visible = kind === 'area'
        ? this.atlas.geo.polities.features.some((f) => f.properties.place_id === p.id && shapeActive(f, year))
        : covers(p.span ?? null, year);
      entry.el.hidden = !visible;
      if (!visible) continue;
      const glyph = entry.el.querySelector('.place-marker__glyph')!;
      if (kind === 'town') {
        const urban = profileAt(profiles, p.id, 'urban', year);
        const comms = communitiesAt(profiles, p.id, year);
        const key = [urban?.id, ...comms.map((c) => c.id)].join('|');
        entry.el.dataset.profile = urban?.id ?? '';
        entry.el.dataset.relation = urban?.relation ?? '';
        entry.el.dataset.segments = JSON.stringify(urban ? donutSegments(urban) : []);
        entry.el.setAttribute('aria-label', `${p.name}, town. Open its card.`);
        if (entry.drawn !== key) {
          glyph.replaceChildren(donut(urban), ...comms.map((c) => {
            const b = badge(c);
            b.classList.add('place-marker__badge');
            b.title = c.community_name ?? '';
            b.dataset.community = c.id;
            return b;
          }));
          entry.drawn = key;
        }
      } else if (kind === 'point') {
        const rural = profileAt(profiles, p.id, 'rural', year);
        const court = profileAt(profiles, p.id, 'court', year);
        const key = `${rural?.id}|${court?.id}`;
        entry.el.setAttribute('aria-label', `${p.name}. Open its card.`);
        if (entry.drawn !== key) {
          glyph.replaceChildren(pointSquare(rural, court));
          entry.drawn = key;
        }
      } else {
        entry.el.setAttribute('aria-label', `${p.name}. Open its card.`);
      }
    }
    this.updateEvents(year);
  }

  private updateEvents(year: number): void {
    const near = new Set(eventsNear(this.atlas.events, year).map((e) => e.id));
    // Stack events at one place so they do not hide each other.
    const stack = new Map<string, number>();
    for (const e of this.atlas.events as AtlasEvent[]) {
      const entry = this.events.get(e.id);
      if (!entry) continue;
      entry.el.hidden = !near.has(e.id);
      if (entry.el.hidden) continue;
      const n = stack.get(e.place) ?? 0;
      stack.set(e.place, n + 1);
      entry.marker.setOffset([14 + n * 14, -14]);
    }
  }
}
