// Cards, student view (docs/product-spec.md 6): place, event, diffusion, exemplar, debate and source. Every history
// text comes from the data exactly as built; vocabulary comes from the taxonomy. The words this file writes itself
// are UI labels only.
import { type Atlas, citedBy } from '../atlas';
import { dataUrl } from '../data/load';
import type { AtlasEvent, Debate, Diffusion, Exemplar, Place, ReligionProfile, Source } from '../data/types';
import { communitiesAt, nearestSnapshot, profileAt, rankedTraditions } from '../data/profiles';
import { arcStyle, profileLook } from '../map/patterns';
import { basePalette, lensColor, mapInk, traditionColor, uiPalette } from '../theme/palette';
import { h, keyLabel, spanText, yearText } from './dom';
import { arcSwatch, outcomeGlyph, patternDataUrl, swatch } from './glyphs';

type CardKind = 'place' | 'event' | 'diffusion' | 'exemplar' | 'debate' | 'source';
type Opened = { kind: CardKind; id: string } | null;

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

  openDiffusion(id: string, focus = true): void {
    this.open({ kind: 'diffusion', id }, focus);
  }

  openExemplar(id: string, focus = true): void {
    this.open({ kind: 'exemplar', id }, focus);
  }

  openDebate(id: string, focus = true): void {
    this.open({ kind: 'debate', id }, focus);
  }

  openSource(id: string, focus = true): void {
    this.open({ kind: 'source', id }, focus);
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
    const { kind, id } = this.opened;
    const content = kind === 'place' ? this.placeCard(id)
      : kind === 'event' ? this.eventCard(id)
      : kind === 'diffusion' ? this.diffusionCard(id)
      : kind === 'exemplar' ? this.exemplarCard(id)
      : kind === 'debate' ? this.debateCard(id)
      : this.sourceCard(id);
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
        h('button', { type: 'button', class: 'linklike', onclick: () => this.openSource(s!.id) },
          s!.citation ?? [s!.author, s!.title].filter(Boolean).join(', ')),
        s!.voice ? h('span', { class: 'source-voice', title: this.atlas.tax.sources.voice[s!.voice] }, ` ${keyLabel(s!.voice)}`) : null))));
  }

  /** "Historians disagree": debates linked to a record. */
  private debates(recordId: string): HTMLElement | null {
    const list = this.atlas.debates.filter((db) => db.links.includes(recordId));
    if (!list.length) return null;
    return h('section', { class: 'card__section' },
      h('h3', {}, 'Historians disagree'),
      h('ul', { class: 'card__list' }, list.map((db) => h('li', { 'data-debate': db.id },
        h('button', { type: 'button', class: 'linklike', onclick: () => this.openDebate(db.id) }, db.question)))));
  }

  private lensChips(lenses: string[] | undefined): HTMLElement | null {
    if (!lenses?.length) return null;
    const tax = this.atlas.tax;
    return h('p', { class: 'chips', 'aria-label': 'Lenses' }, lenses.map((l) =>
      this.chip(keyLabel(l), tax.lenses[l] ? `${tax.lenses[l].inspect}: ${tax.lenses[l].note}` : undefined)));
  }

  /** Whether the AP World view shows this record, and why (teacher-useful; students see the short label). */
  private apChip(id: string): HTMLElement | null {
    const ap = this.atlas.ap;
    if (!ap) return null;
    const why = ap.why.get(id);
    return why
      ? this.chip('In the AP course', why, 'chip--ap-in')
      : this.chip('Beyond the AP course', 'Not named in the course texts; shown with "Show everything"', 'chip--ap-out');
  }

  private link(kind: CardKind, id: string, label: string): HTMLElement {
    const open = () => {
      if (kind === 'place') this.openPlace(id);
      else if (kind === 'event') this.openEvent(id);
      else if (kind === 'diffusion') this.openDiffusion(id);
      else if (kind === 'exemplar') this.openExemplar(id);
      else if (kind === 'debate') this.openDebate(id);
      else this.openSource(id);
    };
    return h('button', { type: 'button', class: 'linklike', [`data-${kind}`]: id, onclick: open }, label);
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
    out.push(h('p', { class: 'card__kind', title: tax.place_kinds[place.kind] }, keyLabel(place.kind), ' ', this.apChip(id)));

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

    const exs = this.atlas.exemplars.filter((x) => x.place === id);
    const onMap = exs.filter((x) => x.on_slider !== false);
    const later = exs.filter((x) => x.on_slider === false);
    if (exs.length) {
      out.push(h('section', { class: 'card__section' }, h('h3', {}, 'Things to see here'),
        onMap.length ? h('ul', { class: 'card__list' }, onMap.map((x) => h('li', {}, this.link('exemplar', x.id, x.name)))) : null,
        later.length ? h('h4', {}, 'Later evidence') : null,
        later.length ? h('ul', { class: 'card__list' }, later.map((x) => h('li', {}, this.link('exemplar', x.id, x.name)))) : null));
    }

    const toHere = this.atlas.diffusions.filter((d) => d.to === id);
    const fromHere = this.atlas.diffusions.filter((d) => d.from.includes(id));
    if (toHere.length || fromHere.length) {
      out.push(h('section', { class: 'card__section' }, h('h3', {}, 'Culture that moved'),
        toHere.length ? h('h4', {}, 'To here') : null,
        toHere.length ? h('ul', { class: 'card__list' }, toHere.map((d) => h('li', {}, this.link('diffusion', d.id, `${d.what} (${spanText(d.span.start, d.span.end, d.span.approx)})`)))) : null,
        fromHere.length ? h('h4', {}, 'From here') : null,
        fromHere.length ? h('ul', { class: 'card__list' }, fromHere.map((d) => h('li', {}, this.link('diffusion', d.id, `${d.what} (${spanText(d.span.start, d.span.end, d.span.approx)})`)))) : null));
    }

    const db = this.debates(id);
    if (db) out.push(db);

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
      h('p', { class: 'card__year' }, yearText(e.year, e.approx), e.keyframe ? this.chip('Keyframe', undefined, 'chip--keyframe') : null, this.apChip(e.id)),
      this.title(e.title),
      h('p', { class: 'card__summary' }, e.summary),
    ];
    if (place) out.push(h('p', {}, 'Place: ', this.placeButton(place.id)));
    const lenses = this.lensChips(e.lenses);
    if (lenses) out.push(lenses);
    const ap = this.apChips(e.ap_topics);
    if (ap) out.push(ap);
    const db = this.debates(e.id);
    if (db) out.push(db);
    const src = this.sources(e.evidence);
    if (src) out.push(src);
    void tax;
    return out;
  }

  // ---- diffusion card (product-spec 6) ----

  private diffusionCard(id: string): Node[] {
    const d: Diffusion | undefined = this.atlas.diffusionById.get(id);
    if (!d) return [this.title(id)];
    const tax = this.atlas.tax;
    const color = lensColor(d.lens);
    const names = (ids: string[]) => ids.map((p, i) => [i ? ', ' : '', this.placeButton(p)]).flat();
    const out: Node[] = [
      h('p', { class: 'card__year' }, spanText(d.span.start, d.span.end, d.span.approx),
        this.chip(keyLabel(d.lens), tax.lenses[d.lens] ? `${tax.lenses[d.lens].inspect}: ${tax.lenses[d.lens].note}` : undefined, 'chip--lens')),
      this.title(d.what),
      h('p', { class: 'card__route' }, 'From ', ...names(d.from), ' to ', this.placeButton(d.to)),
      h('p', { class: 'card__summary' }, d.summary),
      h('section', { class: 'card__section' },
        h('h3', {}, 'How it moved'),
        h('p', { class: 'code' }, arcSwatch(arcStyle(d.mechanism), color), h('strong', {}, keyLabel(d.mechanism))),
        h('p', { class: 'code__test' }, tax.diffusion.mechanism[d.mechanism] ?? ''),
        d.carriers?.length ? h('p', { class: 'chips', 'aria-label': 'Carriers' }, h('span', { class: 'chips__lead' }, 'Carried by: '),
          d.carriers.map((c) => this.chip(keyLabel(c)))) : null),
      h('section', { class: 'card__section' },
        h('h3', {}, 'What happened when it arrived'),
        h('p', { class: 'code' }, outcomeGlyph(d.outcome, color), h('strong', {}, keyLabel(d.outcome))),
        h('p', { class: 'code__test' }, tax.diffusion.outcome[d.outcome] ?? '')),
      h('p', { class: 'chips' }, this.chip(`${d.confidence} confidence`, undefined, `chip--conf-${d.confidence}`), this.apChip(d.id)),
    ];
    const ap = this.apChips(d.ap_topics);
    if (ap) out.push(ap);
    const db = this.debates(d.id);
    if (db) out.push(db);
    const src = this.sources(d.evidence);
    if (src) out.push(src);
    return out;
  }

  // ---- exemplar card ----

  private exemplarCard(id: string): Node[] {
    const x: Exemplar | undefined = this.atlas.exemplarById.get(id);
    if (!x) return [this.title(id)];
    const place = this.atlas.placeById.get(x.place);
    const dates: (Node | string)[] = [spanText(x.span.start, x.span.end, x.span.approx)];
    if (x.fabric_date) dates.push(this.chip(`What stands today: ${x.fabric_date}`, 'The surviving structure dates from a later rebuilding', 'chip--later'));
    const out: Node[] = [
      h('p', { class: 'card__year' }, ...dates),
      this.title(x.name),
      // Images come later, only after Wil approves a license-checked list (product-spec 9). Until then an icon.
      h('p', { class: 'exemplar__icon', 'aria-hidden': 'true' }, h('span', { class: 'exemplar__glyph' })),
      h('p', { class: 'card__summary' }, x.summary),
    ];
    if (place) out.push(h('p', {}, 'Place: ', this.placeButton(place.id)));
    if (x.on_slider === false) out.push(h('p', { class: 'card__flag' }, 'Later evidence: this is not shown on the map by year.'));
    if (x.found_at) {
      out.push(h('section', { class: 'card__section' },
        h('h3', {}, 'Where it was found'),
        h('p', {}, x.found_at.name),
        this.miniMap(x)));
    }
    const lenses = this.lensChips(x.lenses);
    if (lenses) out.push(lenses);
    out.push(h('p', { class: 'chips' }, this.chip(`${x.confidence} confidence`, undefined, `chip--conf-${x.confidence}`), this.apChip(x.id)));
    const db = this.debates(x.id);
    if (db) out.push(db);
    const src = this.sources(x.evidence);
    if (src) out.push(src);
    return out;
  }

  /** A small map of the module with the exemplar's place and its findspot (product-spec, found_at). */
  private miniMap(x: Exemplar): HTMLElement {
    const w = 320;
    const hgt = 220;
    const c = h('canvas', { class: 'minimap', width: String(w * 2), height: String(hgt * 2), 'aria-label': `Map: ${x.name} was found at ${x.found_at!.name}` });
    c.style.width = `${w}px`;
    c.style.height = `${hgt}px`;
    const [vw, vs, ve, vn] = this.atlas.frame.view_bbox;
    const pts = [[x.location.lon, x.location.lat], [x.found_at!.lon, x.found_at!.lat]];
    // Fit both points; a findspot outside the view box is pinned to its edge with an arrow.
    const clamp = ([lon, lat]: number[]) => [Math.max(vw, Math.min(ve, lon)), Math.max(vs, Math.min(vn, lat))];
    const shown = pts.map(clamp);
    const pad = 6;
    let [x0, y0, x1, y1] = [Math.min(...shown.map((p) => p[0])) - pad, Math.min(...shown.map((p) => p[1])) - pad,
      Math.max(...shown.map((p) => p[0])) + pad, Math.max(...shown.map((p) => p[1])) + pad];
    // keep the canvas aspect
    const sx = (x1 - x0) / w;
    const sy = (y1 - y0) / hgt;
    const s = Math.max(sx, sy);
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    [x0, x1] = [cx - (s * w) / 2, cx + (s * w) / 2];
    [y0, y1] = [cy - (s * hgt) / 2, cy + (s * hgt) / 2];
    const px = ([lon, lat]: number[]) => [((lon - x0) / (x1 - x0)) * w * 2, ((y1 - lat) / (y1 - y0)) * hgt * 2];
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = basePalette.sea;
    ctx.fillRect(0, 0, w * 2, hgt * 2);
    void fetch(dataUrl(this.atlas.geo.base)).then((r) => r.json()).then((fc: { features: { properties: { layer: string }; geometry: { type: string; coordinates: number[][][] | number[][][][] } }[] }) => {
      ctx.fillStyle = basePalette.land;
      for (const f of fc.features) {
        if (f.properties.layer !== 'land') continue;
        const polys = (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates) as number[][][][];
        for (const poly of polys) {
          ctx.beginPath();
          poly[0].forEach((pt, i) => { const [X, Y] = px(pt); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
          ctx.closePath();
          ctx.fill();
        }
      }
      const a = px(shown[0]);
      const b = px(shown[1]);
      ctx.strokeStyle = mapInk.exemplar;
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
      ctx.setLineDash([]);
      for (const [p, fill] of [[a, mapInk.exemplar], [b, mapInk.keyframeMarker]] as const) {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 9, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = mapInk.keyline;
        ctx.stroke();
      }
      const outside = shown[1][0] !== pts[1][0] || shown[1][1] !== pts[1][1];
      ctx.fillStyle = uiPalette.text;
      ctx.font = '26px system-ui, sans-serif';
      ctx.textAlign = b[0] > w ? 'right' : 'left';
      ctx.fillText(outside ? 'found far beyond this map' : 'found here', b[0] + (b[0] > w ? -14 : 14), b[1] - 14);
    }).catch(() => undefined);
    return c;
  }

  // ---- debate card ----

  private debateCard(id: string): Node[] {
    const db: Debate | undefined = this.atlas.debateById.get(id);
    if (!db) return [this.title(id)];
    const out: Node[] = [
      h('p', { class: 'card__year' }, 'Historians disagree'),
      this.title(db.question),
      h('ol', { class: 'positions' }, db.positions.map((p) => h('li', {}, h('p', { class: 'positions__view' }, p.view), h('p', { class: 'positions__who' }, p.who)))),
    ];
    if (db.note) out.push(h('p', { class: 'card__flag' }, db.note));
    const links = db.links.map((l) => {
      if (this.atlas.placeById.has(l)) return this.link('place', l, this.atlas.placeById.get(l)!.name);
      if (this.atlas.diffusionById.has(l)) return this.link('diffusion', l, this.atlas.diffusionById.get(l)!.what);
      if (this.atlas.exemplarById.has(l)) return this.link('exemplar', l, this.atlas.exemplarById.get(l)!.name);
      if (this.atlas.eventById.has(l)) return this.link('event', l, this.atlas.eventById.get(l)!.title);
      return null;
    }).filter((n): n is HTMLElement => !!n);
    if (links.length) out.push(h('section', { class: 'card__section' }, h('h3', {}, 'About'), h('ul', { class: 'card__list' }, links.map((l) => h('li', {}, l)))));
    return out;
  }

  // ---- source card ----

  /** Words the taxonomy lists as outdated, found in a title: shown as published, with a note. */
  private outdatedTerms(title: string): string[] {
    const terms = this.atlas.tax.writing_rules.banned_terms.map((t) => t.split(' (')[0].trim());
    return terms.filter((t) => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?\\b`, 'i').test(title));
  }

  private sourceCard(id: string): Node[] {
    const s: Source | undefined = this.atlas.sourceById.get(id);
    if (!s) return [this.title(id)];
    const tax = this.atlas.tax;
    const outdated = this.outdatedTerms(s.title);
    const out: (Node | null)[] = [
      h('p', { class: 'card__year' }, s.date !== undefined && s.date !== null ? String(s.date) : '', s.kind ? this.chip(`${keyLabel(s.kind)} source`) : null),
      this.title(s.title),
      outdated.length ? h('p', { class: 'card__flag', 'data-outdated': outdated.join(',') },
        `The title is shown as published. "${outdated.join('", "')}" is the author's word, not ours.`) : null,
      s.author ? h('p', {}, s.author, s.author_from ? ` (${s.author_from})` : '') : null,
      h('p', { class: 'chips' },
        s.type ? this.chip(keyLabel(s.type), tax.sources.type[s.type]) : null,
        s.voice ? this.chip(keyLabel(s.voice), tax.sources.voice[s.voice]) : null,
        s.verification ? this.chip(keyLabel(s.verification), tax.sources.verification[s.verification]) : null),
    ];
    if (s.happ) {
      const rows: [string, string | undefined][] = [
        ['Historical situation', s.happ.historical_situation], ['Audience', s.happ.audience],
        ['Purpose', s.happ.purpose], ['Point of view', s.happ.point_of_view],
      ];
      out.push(h('section', { class: 'card__section' }, h('h3', {}, 'HAPP'),
        h('dl', { class: 'happ' }, rows.flatMap(([k, v]) => (v ? [h('dt', {}, k), h('dd', {}, v)] : [])))));
    }
    if (s.citation) out.push(h('p', { class: 'card__citation' }, s.citation));
    if (s.verification_note) out.push(h('p', { class: 'card__flag' }, s.verification_note));
    if (s.url) out.push(h('p', {}, h('a', { href: s.url, target: '_blank', rel: 'noopener' }, 'Open the source')));
    const cites = citedBy(this.atlas, s.id);
    if (cites.length) {
      out.push(h('section', { class: 'card__section' }, h('h3', {}, 'Used for'),
        h('ul', { class: 'card__list' }, cites.map((c) => h('li', {}, this.link(c.kind as CardKind, c.id, c.label))))));
    }
    return out.filter((n): n is Node => !!n);
  }
}

