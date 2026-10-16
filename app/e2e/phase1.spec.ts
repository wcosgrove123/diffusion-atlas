import { type Page, expect, test } from '@playwright/test';

// Phase 1 acceptance checks 1 to 5 (docs/build-plan.md). Check 6 (Lighthouse) is in lighthouse.spec.ts.
// Expected values are read from the built data (data/africa.json, data/taxonomy.json), never typed in here,
// except where the build plan names them (the keyframe years in check 4).

interface Span { start: number; end: number | null }
interface Trad { tradition: string; share: string; local_form?: string | null }
interface Profile { id: string; place: string; stratum: string; span: Span; relation: string; traditions: Trad[]; confidence: string; _file: string }
interface AtlasEvent { id: string; year: number; title: string; keyframe?: boolean; _file: string }
interface Data { frame: { start: number; shown_regions: string[]; regions: { id: string; label: string }[] }; religion_profiles: Profile[]; events: AtlasEvent[] }
interface Taxonomy { religion: { relation_labels: Record<string, string> } }

const covers = (s: Span, y: number) => s.start <= y && (s.end === null || y < s.end);
// product-spec 3.1: donut segments sized dominant 3, significant 2, minority 1, trace 0.5
const SHARE_WEIGHT: Record<string, number> = { dominant: 3, significant: 2, minority: 1, trace: 0.5 };

async function openAt(page: Page, year: number): Promise<void> {
  await page.goto(`./?year=${year}`);
  await expect(page.locator('#map')).toHaveAttribute('data-ready', 'true', { timeout: 45_000 });
  await expect(page.locator('#year')).toHaveText(String(year));
  // markers arrive in slices; ready waits for the first full set, so the page is complete here
}

async function load(page: Page): Promise<{ data: Data; tax: Taxonomy }> {
  return page.evaluate(async () => ({
    data: await (await fetch('data/africa.json')).json(),
    tax: await (await fetch('data/taxonomy.json')).json(),
  }));
}

function profileAt(data: Data, place: string, stratum: string, year: number): Profile {
  const p = data.religion_profiles.find((r) => r.place === place && r.stratum === stratum && covers(r.span, year));
  expect(p, `${place} ${stratum} profile covering ${year}`).toBeTruthy();
  return p!;
}

/** Properties of the rendered polity features for a place, on one of the religion layers. */
async function rendered(page: Page, layer: string, place: string): Promise<Record<string, unknown>[]> {
  return page.evaluate(([layer, place]) => {
    const map = (window as unknown as { __atlas: { map: { queryRenderedFeatures: (o: object) => { properties: Record<string, unknown> }[] } } }).__atlas.map;
    return map.queryRenderedFeatures({ layers: [layer] }).filter((f) => f.properties.place_id === place).map((f) => f.properties);
  }, [layer, place] as const);
}

test.describe('Phase 1 acceptance', () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== 'desktop', 'acceptance runs once at 1280x720; smoke.spec covers the phone layout');
  });

  test('1. at 1352 Mali\'s court ring shows the relation the data gives, and the card lists both traditions', async ({ page }) => {
    await openAt(page, 1352);
    const { data } = await load(page);
    const court = profileAt(data, 'pl-mali', 'court', 1352);
    expect(court.id).toMatch(/^rp-mali-court-/);
    expect(court.traditions.length).toBeGreaterThanOrEqual(2);

    const ring = await rendered(page, 'court-ring', 'pl-mali');
    expect(ring.length, 'Mali court ring on screen').toBeGreaterThan(0);
    expect(ring[0].court_profile).toBe(court.id);
    expect(ring[0].court_relation).toBe(court.relation);
    // The ring's pattern is the relation's pattern, not plain solid color.
    expect(String(ring[0].ring_pattern)).toContain(`-${court.relation}-`);
    expect(String(ring[0].ring_pattern)).not.toContain('exclusive');
    const colors = await page.evaluate((id) => {
      const map = (window as unknown as { __atlas: { map: { style: { getImage: (id: string) => { data: { data: Uint8Array } } } } } }).__atlas.map;
      const px = map.style.getImage(id).data.data;
      const set = new Set<number>();
      for (let i = 0; i < px.length; i += 4) set.add((px[i] << 16) | (px[i + 1] << 8) | px[i + 2]);
      return set.size;
    }, String(ring[0].ring_pattern));
    expect(colors, 'two traditions drawn in the ring pattern').toBeGreaterThanOrEqual(2);

    await page.locator('.place-marker[data-place="pl-mali"]').dispatchEvent('click');
    const row = page.locator('.card tr[data-stratum="court"]');
    await expect(row).toHaveAttribute('data-profile', court.id);
    for (const t of court.traditions) {
      await expect(row.locator(`[data-tradition="${t.tradition}"]`)).toBeVisible();
      if (t.local_form) await expect(row).toContainText(t.local_form);
    }
    expect(court.traditions.some((t) => t.local_form), 'at least one local_form to show').toBe(true);
  });

  test('2. at 1352 Mali\'s rural fill reads "No direct evidence" when the rural profile is undocumented', async ({ page }) => {
    await openAt(page, 1352);
    const { data, tax } = await load(page);
    const rural = profileAt(data, 'pl-mali', 'rural', 1352);
    const fill = await rendered(page, 'polity-fill', 'pl-mali');
    expect(fill.length, 'Mali fill on screen').toBeGreaterThan(0);
    expect(fill[0].rural_profile).toBe(rural.id);
    expect(fill[0].rural_relation).toBe(rural.relation);
    const label = tax.religion.relation_labels[rural.relation];
    await page.locator('.place-marker[data-place="pl-mali"]').dispatchEvent('click');
    const row = page.locator('.card tr[data-stratum="rural"]');
    await expect(row).toHaveAttribute('data-relation', rural.relation);
    await expect(row).toContainText(label);
    if (rural.relation === 'undocumented') {
      expect(label).toBe('No direct evidence');
      expect(fill[0].fill_pattern).toBe('pat-fill-undocumented');
      await expect(page.locator('.legend li[data-relation="undocumented"]')).toContainText(label);
    }
  });

  test('3. Timbuktu\'s donut at 1340 matches its urban profile shares', async ({ page }) => {
    await openAt(page, 1340);
    const { data } = await load(page);
    const urban = profileAt(data, 'pl-timbuktu', 'urban', 1340);
    const weighted = urban.traditions.filter((t) => SHARE_WEIGHT[t.share]);
    const total = weighted.reduce((s, t) => s + SHARE_WEIGHT[t.share], 0);
    const expected = weighted.map((t) => ({ tradition: t.tradition, share: t.share, fraction: SHARE_WEIGHT[t.share] / total }));

    const marker = page.locator('.place-marker[data-place="pl-timbuktu"]');
    await expect(marker).toBeVisible();
    await expect(marker).toHaveAttribute('data-profile', urban.id);
    const drawn = JSON.parse((await marker.getAttribute('data-segments'))!);
    const key = (s: { tradition: string; fraction: number }) => `${s.tradition}:${s.fraction.toFixed(4)}`;
    expect(drawn.map(key).sort()).toEqual(expected.map(key).sort());

    // The pixels agree: the middle of each segment is closest to that tradition's color. The donut is a canvas, or
    // an image of one when another town shares the look.
    const sampled = await marker.locator('.place-marker__glyph').evaluate(async (glyph: HTMLElement, segs: { tradition: string; fraction: number }[]) => {
      const w = window as unknown as { __atlas: { colors: Record<string, string> } };
      const el = glyph.firstElementChild as HTMLCanvasElement | HTMLImageElement;
      let c: HTMLCanvasElement;
      if (el instanceof HTMLImageElement) {
        await el.decode();
        c = document.createElement('canvas');
        c.width = el.naturalWidth;
        c.height = el.naturalHeight;
        c.getContext('2d')!.drawImage(el, 0, 0);
      } else {
        c = el;
      }
      const ctx = c.getContext('2d')!;
      const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      const size = c.width;
      const out: string[] = [];
      let a0 = -Math.PI / 2;
      for (const s of segs) {
        const mid = a0 + s.fraction * Math.PI;
        a0 += s.fraction * Math.PI * 2;
        const r = size * 0.24; // between the inner hole and the relation band
        const px = ctx.getImageData(Math.round(size / 2 + Math.cos(mid) * r), Math.round(size / 2 + Math.sin(mid) * r), 1, 1).data;
        // opacity follows confidence, over the white keyline: compare against each color at every candidate alpha
        let best = ['', Infinity] as [string, number];
        for (const [t, hex] of Object.entries(w.__atlas.colors)) {
          for (const alpha of [1, 0.75, 0.5]) {
            const c2 = rgb(hex).map((v) => v * alpha + 255 * (1 - alpha));
            const d = Math.hypot(px[0] - c2[0], px[1] - c2[1], px[2] - c2[2]);
            if (d < best[1]) best = [t, d];
          }
        }
        out.push(best[0]);
      }
      return out;
    }, drawn);
    expect(sampled).toEqual(drawn.map((s: { tradition: string }) => s.tradition));
  });

  test('4. stepping keyframes visits 1235, 1324, 1352, 1433 in order, each with its card', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('#map')).toHaveAttribute('data-ready', 'true', { timeout: 45_000 });
    const { data } = await load(page);
    // The build plan names the West (wsahel) keyframes: choose that region in the keyframe filter.
    const region = 'wsahel';
    expect(data.frame.shown_regions).toContain(region);
    await page.locator('#keyframe-region').selectOption(region);
    const kfs = data.events.filter((e) => e.keyframe && e._file === region).sort((a, b) => a.year - b.year);
    expect(kfs.map((e) => e.year)).toEqual([1235, 1324, 1352, 1433]);
    await expect(page.locator('#year')).toHaveText(String(data.frame.start));
    for (const k of kfs) {
      await page.locator('#next-keyframe').click();
      await expect(page.locator('#year')).toHaveText(String(k.year));
      const card = page.locator('.card');
      await expect(card).toBeVisible();
      await expect(card).toHaveAttribute('data-kind', 'event');
      await expect(card).toHaveAttribute('data-id', k.id);
      await expect(card.locator('#card-title')).toHaveText(k.title);
    }
    // Shift+arrows step keyframes from the keyboard too.
    await page.locator('.timeline__range').focus();
    await page.keyboard.press('Shift+ArrowLeft');
    await expect(page.locator('#year')).toHaveText(String(kfs.at(-2)!.year));
  });

  test('5. with color-blind simulation, relations still differ by pattern', async ({ page }) => {
    await openAt(page, 1352);
    const { tax } = await load(page);
    const relations = Object.keys(tax.religion.relation_labels);

    // On the map: each relation drawn gets its own pattern, so the pattern alone tells relations apart.
    const props = await page.evaluate(() => {
      const map = (window as unknown as { __atlas: { map: { queryRenderedFeatures: (o: object) => { properties: Record<string, string> }[] } } }).__atlas.map;
      return map.queryRenderedFeatures({ layers: ['polity-fill', 'court-ring'] }).map((f) => f.properties);
    });
    const kindOf = (id: string) => /^pat-(?:fill|ring)-([a-z]+)/.exec(id)![1];
    const pairs = props.flatMap((p) => [[p.rural_relation, p.fill_pattern], [p.court_relation, p.ring_pattern]]).filter(([r, id]) => r && id);
    expect(pairs.length).toBeGreaterThan(0);
    for (const [r, id] of pairs) expect(kindOf(id)).toBe(r);

    // In the legend (the same pattern code draws map and legend): every pair of relation swatches still looks
    // different under each simulated color-vision deficiency, as the screen shows them.
    const cdp = await page.context().newCDPSession(page);
    for (const type of ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'] as const) {
      await cdp.send('Emulation.setEmulatedVisionDeficiency', { type });
      const shots: string[] = [];
      for (const r of relations) {
        const sw = page.locator(`.legend canvas.legend__relation[data-relation="${r}"]`);
        shots.push((await sw.screenshot()).toString('base64'));
      }
      const diff = await page.evaluate(async (pngs) => {
        const lum = async (b64: string) => {
          const img = new Image();
          img.src = `data:image/png;base64,${b64}`;
          await img.decode();
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          const d = ctx.getImageData(0, 0, c.width, c.height).data;
          const out: number[] = [];
          for (let i = 0; i < d.length; i += 4) out.push(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]);
          return out;
        };
        const ls = await Promise.all(pngs.map(lum));
        // share of pixels whose brightness differs clearly between two swatches
        const res: number[][] = [];
        for (let i = 0; i < ls.length; i++) {
          res.push(ls.map((other) => {
            const n = Math.min(ls[i].length, other.length);
            let k = 0;
            for (let p = 0; p < n; p++) if (Math.abs(ls[i][p] - other[p]) > 20) k++;
            return k / n;
          }));
        }
        return res;
      }, shots);
      for (let i = 0; i < relations.length; i++) {
        for (let j = i + 1; j < relations.length; j++) {
          expect(diff[i][j], `${type}: ${relations[i]} vs ${relations[j]}`).toBeGreaterThan(0.08);
        }
      }
    }
    await cdp.send('Emulation.setEmulatedVisionDeficiency', { type: 'none' });
  });
});
