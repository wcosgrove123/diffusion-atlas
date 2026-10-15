// Place card and event card, student view (docs/product-spec.md 6). Every history text comes from the data
// exactly as built; vocabulary comes from the taxonomy. The words this file writes itself are UI labels only.
import type { Atlas } from '../atlas';
import type { AtlasEvent, Place, ReligionProfile } from '../data/types';
import { communitiesAt, nearestSnapshot, profileAt, rankedTraditions } from '../data/profiles';
import { profileLook } from '../map/patterns';
import { traditionColor } from '../theme/palette';
import { h, keyLabel, spanText, yearText } from './dom';
import { patternDataUrl, swatch } from './glyphs';

type Opened = { kind: 'place'; id: string } | { kind: 'event'; id: string } | null;

const STRATA_ORDER = ['court', 'urban', 'rural'];

export class Cards {
  readonly el: HTMLElement;
  private body: HTMLElement;
  private opened: Opened = null;
  private returnFocus: HTMLElement | null = null;

  constructor(private atlas: Atlas, private getYear: () => number, private setYear: (y: number) => void) {
    this.body = h('div', { class: 'card__body' });
    this.el = h('aside', { class: 'card', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'card-title', hidden: true },
      h('button', { type: 'button', class: 'card__close', 'aria-label': 'Close card', onclick: () => this.close() }, 'Close'),
      this.body);
    this.el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); this.close(); }
    });
  }

  get current(): Opened {
    return this.opened;
  }

  openPlace(id: string, focus = true): void {
    this.open({ kind: 'place', id }, focus);
  }

  openEvent(id: string, focus = true): void {
    this.open({ kind: 'event', id }, focus);
  }

  private open(o: Exclude<Opened, null>, focus: boolean): void {
    if (focus && !this.opened && document.activeElement instanceof HTMLElement) this.returnFocus = document.activeElement;
    this.opened = o;
    this.render();
    this.el.hidden = false;
    this.el.dataset.kind = o.kind;
    this.el.dataset.id = o.id;
    if (focus) (this.el.querySelector('#card-title') as HTMLElement | null)?.focus();
  }

  close(): void {
    this.opened = null;
    this.el.hidden = true;
    delete this.el.dataset.kind;
    delete this.el.dataset.id;
    this.returnFocus?.focus();
    this.returnFocus = null;
  }

  /** Re-render for a new slider year (place cards show the year's profiles). */
  refresh(): void {
    if (this.opened?.kind === 'place') this.render();
  }

  private render(): void {
    if (!this.opened) return;
    const content = this.opened.kind === 'place' ? this.placeCard(this.opened.id) : this.eventCard(this.opened.id);
    this.body.replaceChildren(...content);
    this.body.scrollTop = 0;
  }

  // ---- shared bits ----

  private title(text: string): HTMLElement {
    return h('h2', { id: 'card-title', class: 'card__title', tabindex: '-1' }, text);
  }

  private chip(text: string, title?: string, cls = ''): HTMLElement {
    return h('span', { class: `chip ${cls}`.trim(), title }, text);
  }

  private sources(ids: string[]): HTMLElement | null {
    const uniq = [...new Set(ids)].map((id) => this.atlas.sourceById.get(id)).filter((s) => !!s);
    if (!uniq.length) return null;
    return h('section', { class: 'card__section' },
      h('h3', {}, 'Sources'),
      h('ul', { class: 'card__sources' }, uniq.map((s) => h('li', { 'data-source': s!.id },
        s!.citation ?? [s!.author, s!.title].filter(Boolean).join(', ')))));
  }

  private apChips(topics: string[] | undefined): HTMLElement | null {
    if (!topics?.length) return null;
    return h('p', { class: 'chips', 'aria-label': 'AP topics' },
      topics.map((t) => this.chip(`AP ${t}`, this.atlas.tax.ap_topics[String(t)], 'chip--ap')));
  }

  private placeButton(id: string): HTMLElement {
    const p = this.atlas.placeById.get(id);
    return h('button', { type: 'button', class: 'linklike', onclick: () => this.openPlace(id) }, p?.name ?? id);
  }

  // ---- place card ----

  private placeCard(id: string): Node[] {
    const place = this.atlas.placeById.get(id);
    if (!place) return [this.title(id)];
    const year = this.getYear();
    const tax = this.atlas.tax;
    const out: Node[] = [this.title(place.name)];
    if (place.alt_names?.length) out.push(h('p', { class: 'card__alt' }, `Also called: ${place.alt_names.join('; ')}`));
    out.push(h('p', { class: 'card__kind', title: tax.place_kinds[place.kind] }, keyLabel(place.kind)));

    const profiles = this.atlas.data.religion_profiles;
    const rows: { label: string; title?: string; stratum: string; profile: ReligionProfile | null }[] =
      STRATA_ORDER.map((s) => ({ label: keyLabel(s), title: tax.strata[s], stratum: s, profile: profileAt(profiles, id, s, year) }));
    for (const c of communitiesAt(profiles, id, year)) {
      rows.push({ label: c.community_name ?? keyLabel('community'), title: tax.strata.community, stratum: 'community', profile: c });
    }
    out.push(h('section', { class: 'card__section' },
      h('h3', {}, `Religion in ${year}`),
      h('table', { class: 'strata' },
        h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'Group'), h('th', { scope: 'col' }, 'Traditions'),
          h('th', { scope: 'col' }, 'How they fit together'))),
        h('tbody', {}, rows.map((r) => this.stratumRow(r.label, r.title, r.stratum, r.profile))))));

    out.push(this.timeline(id));

    const snap = nearestSnapshot(place.polity_profile, year);
    if (snap) {
      const axes = Object.keys(tax.polity_profile);
      out.push(h('section', { class: 'card__section' },
        h('h3', {}, `Polity Profile, ${snap.year}`),
        h('dl', { class: 'polity-profile' }, axes.flatMap((ax) => {
          const v = snap[ax];
          if (v === undefined || v === null) return [];
          return [h('dt', {}, keyLabel(ax)), h('dd', {}, Array.isArray(v) ? v.join(', ') : String(v))];
        })),
        typeof snap.flag === 'string' ? h('p', { class: 'card__flag' }, snap.flag) : null));
    }

    const evs = this.atlas.events.filter((e) => e.place === id);
    if (evs.length) {
      out.push(h('section', { class: 'card__section' }, h('h3', {}, 'Events here'),
        h('ul', { class: 'card__events' }, evs.map((e) => h('li', {},
          h('button', { type: 'button', class: 'linklike', onclick: () => { this.setYear(e.year); this.openEvent(e.id); } },
            `${yearText(e.year, e.approx)}: ${e.title}`))))));
    }

    const shownIds = rows.map((r) => r.profile).filter((p): p is ReligionProfile => !!p).flatMap((p) => p.evidence);
    const src = this.sources([...shownIds, ...(place.evidence ?? [])]);
    if (src) out.push(src);
    return out;
  }

  private stratumRow(label: string, title: string | undefined, stratum: string, p: ReligionProfile | null): HTMLElement {
    const tax = this.atlas.tax;
    const head = h('th', { scope: 'row', title }, label);
    if (!p) {
      return h('tr', { 'data-stratum': stratum, 'data-profile': '' }, head,
        h('td', { colspan: '2', class: 'strata__none' }, 'No record for this year'));
    }
    const look = profileLook(p);
    const trads = rankedTraditions(p);
    const tradCell = h('td', {}, trads.length
      ? h('ul', { class: 'traditions' }, trads.map((t) => h('li', { 'data-tradition': t.tradition },
        h('span', { class: 'dot', style: `background:${traditionColor(t.tradition)}`, 'aria-hidden': 'true' }),
        h('strong', {}, keyLabel(t.tradition)),
        h('span', { class: 'share', title: tax.religion.share[t.share] }, ` ${t.share}`),
        t.branch && t.branch !== 'other' ? h('span', { class: 'branch' }, ` (${t.branch})`) : null,
        t.local_form ? h('p', { class: 'local-form' }, t.local_form) : null)))
      : null);
    const chips: HTMLElement[] = [this.chip(`${p.confidence} confidence`, undefined, `chip--conf-${p.confidence}`)];
    if (p.basis && p.basis !== 'attested') chips.push(this.chip(p.basis, tax.religion.basis[p.basis], 'chip--basis'));
    if (p.basis === 'projected') chips.push(this.chip('later evidence', tax.religion.basis.projected, 'chip--later'));
    const relCell = h('td', {},
      h('span', { class: 'relation' }, swatch(look.kind, look.a, look.b, 22, 14),
        h('span', { title: tax.religion.relation[p.relation] }, tax.religion.relation_labels[p.relation] ?? p.relation)),
      h('p', { class: 'chips' }, chips));
    tradCell.append(h('p', { class: 'strata__summary' }, p.summary));
    return h('tr', { 'data-stratum': stratum, 'data-profile': p.id, 'data-relation': p.relation }, head, tradCell, relCell);
  }

  /** How each stratum changed across the module years: one bar per stratum, segments per profile. */
  private timeline(id: string): HTMLElement {
    const { start, end } = this.atlas.frame;
    const year = this.getYear();
    const tax = this.atlas.tax;
    const profiles = this.atlas.data.religion_profiles.filter((p) => p.place === id);
    const keys = [...STRATA_ORDER, ...new Set(profiles.filter((p) => p.stratum === 'community').map((p) => p.community_name ?? ''))];
    const pct = (y: number) => `${((Math.max(start, Math.min(end, y)) - start) / (end - start)) * 100}%`;
    const bars = keys.map((k) => {
      const isStratum = STRATA_ORDER.includes(k);
      const mine = profiles.filter((p) => (isStratum ? p.stratum === k : p.stratum === 'community' && p.community_name === k));
      const segs = mine.filter((p) => p.span.start < end && (p.span.end ?? Infinity) > start).map((p) => {
        const look = profileLook(p);
        const label = `${spanText(p.span.start, p.span.end, p.span.approx)}: ${tax.religion.relation_labels[p.relation] ?? p.relation}`;
        const left = pct(p.span.start);
        const right = pct(p.span.end ?? end);
        return h('span', {
          class: 'tl__seg', title: label, 'aria-label': label,
          style: `left:${left};width:calc(${right} - ${left});background-image:url(${patternDataUrl(look.kind, look.a, look.b)});`
            + (look.kind === 'exclusive' ? `background-color:${look.a};` : ''),
        });
      });
      return h('div', { class: 'tl__row' },
        h('span', { class: 'tl__label' }, isStratum ? keyLabel(k) : k),
        h('span', { class: 'tl__bar' }, segs, h('span', { class: 'tl__now', style: `left:${pct(year)}` })));
    });
    return h('section', { class: 'card__section' },
      h('h3', {}, `Change over time, ${start} to ${end}`),
      h('div', { class: 'tl' }, bars),
      h('p', { class: 'tl__axis' }, h('span', {}, String(start)), h('span', {}, String(end))));
  }

  // ---- event card ----

  private eventCard(id: string): Node[] {
    const e: AtlasEvent | undefined = this.atlas.eventById.get(id);
    if (!e) return [this.title(id)];
    const tax = this.atlas.tax;
    const place: Place | undefined = this.atlas.placeById.get(e.place);
    const out: Node[] = [
      h('p', { class: 'card__year' }, yearText(e.year, e.approx), e.keyframe ? this.chip('Keyframe', undefined, 'chip--keyframe') : null),
      this.title(e.title),
      h('p', { class: 'card__summary' }, e.summary),
    ];
    if (place) out.push(h('p', {}, 'Place: ', this.placeButton(place.id)));
    if (e.lenses?.length) {
      out.push(h('p', { class: 'chips', 'aria-label': 'Lenses' }, e.lenses.map((l) =>
        this.chip(keyLabel(l), tax.lenses[l] ? `${tax.lenses[l].inspect}: ${tax.lenses[l].note}` : undefined))));
    }
    const ap = this.apChips(e.ap_topics);
    if (ap) out.push(ap);
    const src = this.sources(e.evidence);
    if (src) out.push(src);
    return out;
  }
}

