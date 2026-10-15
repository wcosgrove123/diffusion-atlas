// The legend (docs/product-spec.md 3). Labels and definitions come from the taxonomy; the sentences that explain
// how the map draws things are UI text.
import type { Atlas } from '../atlas';
import { CONFIDENCE_OPACITY } from '../map/religionLayer';
import { patternKind } from '../map/patterns';
import { mapInk, traditionColor } from '../theme/palette';
import { h, keyLabel } from './dom';
import { swatch } from './glyphs';

/** Traditions the shown profiles use, most used first. */
function traditionsInUse(atlas: Atlas): string[] {
  const shown = new Set(atlas.frame.shown_regions);
  const count = new Map<string, number>();
  for (const p of atlas.data.religion_profiles) {
    if (!shown.has(p._file)) continue;
    for (const t of p.traditions) count.set(t.tradition, (count.get(t.tradition) ?? 0) + 1);
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

export function buildLegend(atlas: Atlas): HTMLElement {
  const tax = atlas.tax;
  const used = traditionsInUse(atlas);
  // The relation swatches use the two traditions the shown data uses most, so they look like the map.
  const a = traditionColor(used[0] ?? '');
  const b = traditionColor(used[1] ?? used[0] ?? '');
  const relations = Object.keys(tax.religion.relation_labels);
  const confidences = tax.sources.confidence;

  const row = (sw: Node, label: string, title?: string, attrs: Record<string, string> = {}) =>
    h('li', { class: 'legend__row', title, ...attrs }, sw, h('span', {}, label));

  const strataSwatch = (cls: string) => h('span', { class: `legend__strata legend__strata--${cls}`, 'aria-hidden': 'true' });

  const details = h('details', { class: 'legend', id: 'legend' },
    h('summary', { class: 'legend__toggle' }, 'Legend'),
    h('div', { class: 'legend__body' },
      h('h3', {}, 'Traditions'),
      h('ul', { class: 'legend__list' }, used.map((t) => row(swatch('exclusive', traditionColor(t), traditionColor(t), 22, 14),
        keyLabel(t), undefined, { 'data-tradition': t }))),
      h('p', { class: 'legend__note' }, `The patterns below use ${keyLabel(used[0] ?? '')} and ${keyLabel(used[1] ?? '')}.`),
      h('h3', {}, 'How traditions fit together'),
      h('ul', { class: 'legend__list' }, relations.map((r) => {
        const sw = swatch(patternKind(r), a, b, 34, 22);
        sw.dataset.relation = r;
        sw.classList.add('legend__relation');
        return row(sw, tax.religion.relation_labels[r], tax.religion.relation[r], { 'data-relation': r });
      })),
      h('h3', {}, 'Who'),
      h('ul', { class: 'legend__list' },
        row(strataSwatch('fill'), `Fill: ${keyLabel('rural')}`, tax.strata.rural),
        row(strataSwatch('ring'), `Inner ring: ${keyLabel('court')}`, tax.strata.court),
        row(strataSwatch('donut'), `Circle: ${keyLabel('urban')}`, tax.strata.urban),
        row(strataSwatch('none'), 'Outline only: no record for this year')),
      h('h3', {}, 'How sure'),
      h('ul', { class: 'legend__list' },
        confidences.map((c) => {
          const sw = swatch('exclusive', a, a, 22, 14);
          sw.style.opacity = String(CONFIDENCE_OPACITY[c] ?? 0.5);
          return row(sw, `${keyLabel(c)} confidence`);
        }),
        row(strataSwatch('dotted'), `Dotted border: ${keyLabel('inferred')}`, tax.religion.basis.inferred),
        row(strataSwatch('dotted'), `Dotted border and a "later evidence" tag: ${keyLabel('projected')}`, tax.religion.basis.projected)),
      h('p', { class: 'legend__note' }, 'Soft edges: borders were zones, not lines.')));
  details.style.setProperty('--legend-a', a);
  details.style.setProperty('--legend-b', b);
  details.style.setProperty('--legend-none', mapInk.noRecord);
  return details;
}
