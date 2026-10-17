import { type Page, expect, test } from '@playwright/test';

// Phase 2 acceptance (docs/build-plan.md): every record in the module data is reachable by clicking within its
// span; no console errors; the data size budget holds (product-spec 12: under 5 MB transferred without images).
// Records are read from the built data, never typed in here.

interface Span { start: number; end: number | null }
interface Place { id: string; kind: string; span?: Span | null; location?: { lat: number; lon: number } | null; _file: string }
interface Profile { id: string; place: string; stratum: string; community_name?: string | null; span: Span; _file: string }
interface Diffusion { id: string; lens: string; from: string[]; to: string; span: Span; _file: string }
interface Exemplar { id: string; place: string; span: Span; on_slider?: boolean; _file: string }
interface AtlasEvent { id: string; year: number; place: string; _file: string }
interface Debate { id: string; links: string[] }
interface Source { id: string }
interface Data {
  frame: { start: number; end: number; shown_regions: string[] };
  places: Place[]; religion_profiles: Profile[]; diffusions: Diffusion[]; exemplars: Exemplar[]; events: AtlasEvent[];
  debates: Debate[]; sources: Source[];
}

const yearIn = (s: Span, frame: { start: number; end: number }) => {
  const y = Math.max(s.start, frame.start);
  return Math.min(y, s.end === null ? frame.end : Math.max(s.start, s.end - 1), frame.end);
};

async function openAtlas(page: Page): Promise<{ data: Data; errors: string[] }> {
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error' || (m.type() === 'warning' && /could not be loaded/.test(m.text()))) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  // every record, so with everything shown (the AP World view has its own spec)
  await page.goto('./?view=all');
  await expect(page.locator('#map')).toHaveAttribute('data-ready', 'true', { timeout: 45_000 });
  const data: Data = await page.evaluate(async () => (await (await fetch('data/africa.json')).json()));
  return { data, errors };
}

/** Sets the year and waits until the markers and arcs for it are on the map (they arrive in slices). */
const setYear = (page: Page, y: number) => page.evaluate((year) => (window as unknown as { __atlas: { setYear: (y: number) => Promise<unknown> } }).__atlas.setYear(year), y);
/** A span that ends before the frame starts is never on the slider (a pre-1200 profile kept for context). */
const beforeFrame = (s: Span, frame: { start: number }) => s.end !== null && s.end <= frame.start;

test.describe('Phase 2 acceptance', () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== 'desktop', 'runs once at 1280x720');
  });

  test('every place, profile, exemplar and event is on the map within its span and opens a card', async ({ page }) => {
    test.setTimeout(240_000);
    const { data, errors } = await openAtlas(page);
    const shown = new Set(data.frame.shown_regions);
    const places = data.places.filter((p) => shown.has(p._file) && p.kind !== 'external');
    expect(places.length).toBeGreaterThan(70);
    const missing: string[] = [];

    // Places: at a year inside the span, the marker is visible and its card opens with the place's profiles.
    for (const p of places) {
      if (p.span && beforeFrame(p.span, data.frame)) continue;
      const y = p.span ? yearIn(p.span, data.frame) : data.frame.start;
      await setYear(page, y);
      const marker = page.locator(`.place-marker[data-place="${p.id}"]`);
      if (!(await marker.isVisible())) { missing.push(`place ${p.id} at ${y}`); continue; }
      await page.evaluate((id) => (window as unknown as { __atlas: { cards: { openPlace: (id: string) => void } } }).__atlas.cards.openPlace(id), p.id);
      await expect(page.locator('.card')).toHaveAttribute('data-id', p.id);
      let cur = y;
      for (const r of data.religion_profiles.filter((r) => r.place === p.id && !beforeFrame(r.span, data.frame))) {
        const ry = yearIn(r.span, data.frame);
        if (ry !== cur) { await setYear(page, ry); cur = ry; }
        const row = page.locator(`.card tr[data-profile="${r.id}"]`);
        if ((await row.count()) === 0) missing.push(`profile ${r.id} at ${ry}`);
      }
    }
    // Exemplars on the slider show from their span start; the rest are reachable from their place's card.
    for (const x of data.exemplars.filter((e) => shown.has(e._file))) {
      // Not on the slider (by choice, or because it dates from after the frame): reachable from the place card.
      if (x.on_slider === false || x.span.start > data.frame.end) {
        await page.evaluate((id) => (window as unknown as { __atlas: { cards: { openPlace: (id: string) => void } } }).__atlas.cards.openPlace(id), x.place);
        if ((await page.locator(`.card [data-exemplar="${x.id}"]`).count()) === 0) missing.push(`later exemplar ${x.id} on ${x.place}`);
        continue;
      }
      const y = Math.min(Math.max(x.span.start, data.frame.start), data.frame.end);
      await setYear(page, y);
      const m = page.locator(`.exemplar-marker[data-exemplar="${x.id}"]`);
      if (!(await m.isVisible())) { missing.push(`exemplar ${x.id} at ${y}`); continue; }
      await m.dispatchEvent('click');
      await expect(page.locator('.card')).toHaveAttribute('data-id', x.id);
    }
    for (const e of data.events.filter((e) => shown.has(e._file))) {
      if (e.year < data.frame.start || e.year > data.frame.end) continue; // outside the slider: context only
      await setYear(page, e.year);
      const m = page.locator(`.event-marker[data-event="${e.id}"]`);
      if (!(await m.isVisible())) { missing.push(`event ${e.id} at ${e.year}`); continue; }
      await m.dispatchEvent('click');
      await expect(page.locator('.card')).toHaveAttribute('data-id', e.id);
    }
    expect(missing).toEqual([]);
    expect(errors).toEqual([]);
  });

  test('every diffusion draws an arc within its span and opens a card; external ends get an edge label', async ({ page }) => {
    test.setTimeout(240_000);
    const { data, errors } = await openAtlas(page);
    const shown = new Set(data.frame.shown_regions);
    const lens: string = await page.evaluate(() => (window as unknown as { __atlas: { lens: string } }).__atlas.lens);
    const places = new Map(data.places.map((p) => [p.id, p]));
    const missing: string[] = [];
    const diffusions = data.diffusions.filter((d) => shown.has(d._file));
    expect(diffusions.some((d) => d.lens === lens)).toBe(true);
    for (const d of diffusions) {
      if (beforeFrame(d.span, data.frame)) continue;
      const y = yearIn(d.span, data.frame);
      await setYear(page, y);
      // Other lenses' arcs are not drawn (lens tabs come in Phase 3); their cards open from the place card.
      if (d.lens !== lens) {
        await page.evaluate((id) => (window as unknown as { __atlas: { cards: { openPlace: (id: string) => void } } }).__atlas.cards.openPlace(id), d.to);
        if ((await page.locator(`.card [data-diffusion="${d.id}"]`).count()) === 0) missing.push(`other-lens diffusion ${d.id} on ${d.to}`);
        continue;
      }
      const drawn = await page.evaluate((id) => {
        const map = (window as unknown as { __atlas: { map: { querySourceFeatures: (s: string) => { properties: Record<string, string> }[] } } }).__atlas.map;
        return map.querySourceFeatures('arcs').filter((f) => f.properties.diffusion === id).length;
      }, d.id);
      if (!drawn) { missing.push(`arc ${d.id} at ${y}`); continue; }
      const glyph = page.locator(`.arc-glyph[data-diffusion="${d.id}"]`).first();
      await glyph.dispatchEvent('click');
      await expect(page.locator('.card')).toHaveAttribute('data-id', d.id);
      for (const end of [...d.from, d.to]) {
        if (places.get(end)?.kind === 'external' && (await page.locator(`.arc-edge[data-external="${end}"]`).count()) === 0) {
          missing.push(`edge label for ${end} on ${d.id}`);
        }
      }
    }
    expect(missing).toEqual([]);
    expect(errors).toEqual([]);
  });

  test('every debate and source is reachable from a card', async ({ page }) => {
    test.setTimeout(240_000);
    const { data, errors } = await openAtlas(page);
    const shown = new Set(data.frame.shown_regions);
    const ids = new Set<string>([
      ...data.places.filter((p) => shown.has(p._file)).map((p) => p.id),
      ...data.diffusions.filter((d) => shown.has(d._file)).map((d) => d.id),
      ...data.exemplars.filter((e) => shown.has(e._file)).map((e) => e.id),
      ...data.events.filter((e) => shown.has(e._file)).map((e) => e.id),
    ]);
    const missing: string[] = [];
    for (const db of data.debates) {
      const link = db.links.find((l) => ids.has(l));
      if (!link) { missing.push(`debate ${db.id} links nothing shown`); continue; }
      await page.evaluate((id) => (window as unknown as { __atlas: { cards: { openPlace: (id: string) => void; openDiffusion: (id: string) => void; openExemplar: (id: string) => void; openEvent: (id: string) => void } } }).__atlas.cards[
        id.startsWith('pl-') ? 'openPlace' : id.startsWith('df-') ? 'openDiffusion' : id.startsWith('ex-') ? 'openExemplar' : 'openEvent'](id), link);
      const btn = page.locator(`.card [data-debate="${db.id}"] button`);
      if ((await btn.count()) === 0) { missing.push(`debate ${db.id} not on ${link}`); continue; }
      await btn.click();
      await expect(page.locator('.card')).toHaveAttribute('data-id', db.id);
      await expect(page.locator('.card .positions li')).not.toHaveCount(0);
    }
    // Sources: cited by at least one shown record, and the source card opens from the citing card.
    const cited = new Map<string, { kind: string; id: string; year?: number }>();
    const lists: [string, { id: string; evidence?: string[]; _file?: string; place?: string }[]][] = [
      ['place', data.places as unknown as { id: string; evidence?: string[]; _file?: string }[]],
      ['diffusion', data.diffusions as unknown as { id: string; evidence?: string[]; _file?: string }[]],
      ['exemplar', data.exemplars as unknown as { id: string; evidence?: string[]; _file?: string }[]],
      ['event', data.events as unknown as { id: string; evidence?: string[]; _file?: string }[]],
    ];
    for (const [kind, recs] of lists) for (const r of recs) if (!r._file || shown.has(r._file)) for (const s of r.evidence ?? []) if (!cited.has(s)) cited.set(s, { kind, id: r.id });
    // A profile's sources are listed on its place's card at a year inside the profile's span.
    for (const r of data.religion_profiles) if (shown.has(r._file) && !beforeFrame(r.span, data.frame)) for (const s of (r as unknown as { evidence: string[] }).evidence ?? []) if (!cited.has(s)) cited.set(s, { kind: 'place', id: r.place, year: yearIn(r.span, data.frame) });
    let checked = 0;
    for (const s of data.sources) {
      const via = cited.get(s.id);
      if (!via) { missing.push(`source ${s.id} cited by nothing shown`); continue; }
      if (checked++ % 7) continue; // every seventh source is clicked through; the rest are checked by citation
      if (via.year !== undefined) await setYear(page, via.year);
      await page.evaluate(({ kind, id }) => {
        const cards = (window as unknown as { __atlas: { cards: Record<string, (id: string) => void> } }).__atlas.cards;
        cards[`open${kind[0].toUpperCase()}${kind.slice(1)}`](id);
      }, via);
      const btn = page.locator(`.card [data-source="${s.id}"] button`);
      if ((await btn.count()) === 0) { missing.push(`source ${s.id} not listed on ${via.kind} ${via.id}`); continue; }
      await btn.click();
      await expect(page.locator('.card')).toHaveAttribute('data-id', s.id);
    }
    expect(missing).toEqual([]);
    expect(errors).toEqual([]);
  });

  test('the first load transfers under 5 MB without images', async ({ page }) => {
    let bytes = 0;
    page.on('response', async (r) => {
      const len = Number((await r.allHeaders())['content-length'] || 0);
      bytes += len || (await r.body().catch(() => Buffer.alloc(0))).length;
    });
    await page.goto('./');
    await expect(page.locator('#map')).toHaveAttribute('data-ready', 'true', { timeout: 45_000 });
    await page.waitForTimeout(500);
    console.log(`first load: ${(bytes / 1024).toFixed(0)} KB transferred`);
    expect(bytes).toBeLessThan(5 * 1024 * 1024);
  });
});
