import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { type Page, expect, test } from '@playwright/test';

// Zoom tiers (src/map/bands.ts, taxonomy section 8): the map opens at region zoom on the current keyframe's region;
// zoomed out it shows course landmarks as dots, states as shapes and one corridor line per route family; at region
// zoom the places are circles and each arrow draws on its own, with off-map names on hover; close up everything
// shows. Thresholds and tiers come from the built data. With ZOOM_SHOTS=1 the test also saves a screenshot per
// band and keyframe under docs/zoom-tiers/ for Wil.
//
// The two keyframes are named here (as the build plan names its years): 1324, Mansa Musa's hajj (West), and
// 1331, Ibn Battuta at Kilwa (Swahili coast). Their regions and places are read from the data.
const KEYFRAME_YEARS = [1324, 1331];

interface Data {
  frame: { zoom_bands: { mid: number; near: number } };
  places: { id: string; kind: string; prominence?: string; location?: { lat: number; lon: number } | null; _file: string }[];
  events: { id: string; year: number; place: string; keyframe?: boolean; _file: string }[];
}
interface Tax { prominence: Record<string, { label: string }> }

type Band = 'far' | 'mid' | 'near';
const zoomIn = (band: Band, b: { mid: number; near: number }) => (band === 'far' ? b.mid - 1 : band === 'mid' ? (b.mid + b.near) / 2 : b.near + 0.75);

async function open(page: Page, query: string): Promise<{ data: Data; tax: Tax }> {
  await page.goto(`./${query}`);
  await expect(page.locator('#map')).toHaveAttribute('data-ready', 'true', { timeout: 45_000 });
  return page.evaluate(async () => ({
    data: await (await fetch('data/africa.json')).json(),
    tax: await (await fetch('data/taxonomy.json')).json(),
  }));
}

const atlas = (page: Page) => ({
  zoom: () => page.evaluate(() => (window as unknown as { __atlas: { map: { getZoom: () => number } } }).__atlas.map.getZoom()),
  band: () => page.evaluate(() => (window as unknown as { __atlas: { band: () => string } }).__atlas.band()),
  setZoom: (z: number, center?: [number, number]) => page.evaluate(([z, c]) => (window as unknown as { __atlas: { setZoom: (z: number, c?: [number, number]) => Promise<unknown> } }).__atlas.setZoom(z as number, c as [number, number] | undefined), [z, center] as const),
  arcs: () => page.evaluate(() => {
    const map = (window as unknown as { __atlas: { map: { querySourceFeatures: (s: string) => { properties: Record<string, string> }[] } } }).__atlas.map;
    return map.querySourceFeatures('arcs').map((f) => ({ diffusion: f.properties.diffusion, corridor: f.properties.corridor }));
  }),
  shownRanks: () => page.evaluate(() => [...document.querySelectorAll<HTMLElement>('.place-marker:not([hidden])')].map((m) => Number(m.dataset.rank))),
});

test.describe('Zoom tiers', () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== 'desktop', 'runs once at 1280x720');
  });

  test('opens at region zoom on the current keyframe\'s region, and the legend names the bands', async ({ page }) => {
    const { data, tax } = await open(page, '?year=1324');
    const bands = data.frame.zoom_bands;
    const zoom = await atlas(page).zoom();
    expect(zoom).toBeGreaterThanOrEqual(bands.mid);
    expect(zoom).toBeLessThan(bands.near);
    expect(await atlas(page).band()).toBe('mid');
    // The keyframe's place is on screen.
    const kf = data.events.find((e) => e.keyframe && e.year === 1324)!;
    const box = (await page.locator(`.place-marker[data-place="${kf.place}"]`).boundingBox())!;
    const view = page.viewportSize()!;
    expect(box.x).toBeGreaterThan(0);
    expect(box.x + box.width).toBeLessThan(view.width);
    expect(box.y).toBeGreaterThan(0);
    expect(box.y + box.height).toBeLessThan(view.height);
    // Three legend lines, one per band, naming the tiers by their taxonomy labels.
    await page.locator('#legend').evaluate((d) => d.setAttribute('open', ''));
    const lines = page.locator('.legend__zoom li');
    await expect(lines).toHaveCount(3);
    const labels = Object.values(tax.prominence).map((p) => p.label.toLowerCase());
    const text = (await lines.allTextContents()).join(' ').toLowerCase();
    for (const l of labels) expect(text).toContain(l);
    await expect(lines.nth(1)).toHaveCSS('font-weight', '700'); // the band the map is in
  });

  test('the region dropdown moves the map to that region at region zoom', async ({ page }) => {
    const { data } = await open(page, '?year=1324');
    const before = await page.evaluate(() => (window as unknown as { __atlas: { map: { getCenter: () => { lng: number } } } }).__atlas.map.getCenter().lng);
    // the region of the Kilwa keyframe, a different one from the opening region
    const other = data.events.find((e) => e.keyframe && e.year === 1331)!._file;
    await page.locator('#keyframe-region').selectOption(other);
    await expect.poll(() => page.evaluate(() => (window as unknown as { __atlas: { map: { getCenter: () => { lng: number }; isMoving: () => boolean } } }).__atlas.map.isMoving())).toBe(false);
    const after = await page.evaluate(() => (window as unknown as { __atlas: { map: { getCenter: () => { lng: number } } } }).__atlas.map.getCenter().lng);
    expect(Math.abs(after - before)).toBeGreaterThan(5);
    expect(await atlas(page).band()).toBe('mid');
  });

  for (const year of KEYFRAME_YEARS) {
    test(`at ${year}: dots and corridors zoomed out, circles and arrows at region zoom, everything close up`, async ({ page }) => {
      test.setTimeout(120_000);
      const { data } = await open(page, `?year=${year}`);
      const bands = data.frame.zoom_bands;
      const kf = data.events.find((e) => e.keyframe && e.year === year)!;
      const place = data.places.find((p) => p.id === kf.place)!;
      const center: [number, number] = [place.location!.lon, place.location!.lat];
      const shots = process.env.ZOOM_SHOTS ? resolve('..', 'docs', 'zoom-tiers') : null;
      if (shots) mkdirSync(shots, { recursive: true });
      const a = atlas(page);

      // Far: course landmarks as dots, corridors only, nothing else.
      await a.setZoom(zoomIn('far', bands), [20, 8]);
      expect(await a.band()).toBe('far');
      expect(await page.locator('.place-marker[data-marker="dot"]:not([hidden])').count()).toBeGreaterThan(5);
      expect(await page.locator('.place-marker[data-marker="donut"]:not([hidden])').count()).toBe(0);
      expect(new Set(await a.shownRanks())).toEqual(new Set([0]));
      const corridors = await a.arcs();
      expect(corridors.length).toBeGreaterThan(0);
      expect(corridors.every((f) => !f.diffusion && f.corridor)).toBe(true);
      expect(await page.locator('.arc-glyph').count()).toBe(0);
      expect(await page.locator('.arc-edge').count()).toBe(0);
      expect(await page.locator('.event-marker').count()).toBe(0);
      expect(await page.locator('.exemplar-marker').count()).toBe(0);
      if (shots) await page.screenshot({ path: resolve(shots, `${year}-far.jpg`), type: 'jpeg', quality: 82 });

      // Mid: circles, each arrow on its own with its glyph; off-map names only on hover.
      await a.setZoom(zoomIn('mid', bands), center);
      expect(await a.band()).toBe('mid');
      expect(await page.locator('.place-marker[data-marker="donut"]:not([hidden])').count()).toBeGreaterThan(0);
      expect(await page.locator('.place-marker[data-marker="dot"]:not([hidden])').count()).toBe(0);
      expect(await page.locator('.place-marker__badge').count()).toBe(0);
      expect(Math.max(...(await a.shownRanks()))).toBeLessThanOrEqual(1);
      const arcs = await a.arcs();
      expect(arcs.length).toBeGreaterThan(0);
      expect(arcs.every((f) => f.diffusion)).toBe(true);
      expect(await page.locator('.arc-glyph').count()).toBeGreaterThan(0);
      // Off-map names: hidden until a click (or hover) opens the label. Edge labels sit at the frame edge, so most
      // are off screen at region zoom; a click is dispatched to the element, a hover only when one is on screen.
      const edge = page.locator('.arc-edge').first();
      if (await edge.count()) {
        await expect(edge.locator('.arc-edge__text')).toBeHidden();
        await edge.dispatchEvent('click');
        await expect(edge.locator('.arc-edge__text')).toBeVisible();
        await edge.dispatchEvent('click');
        await expect(edge.locator('.arc-edge__text')).toBeHidden();
        const view = page.viewportSize()!;
        for (const el of await page.locator('.arc-edge').all()) {
          const b = await el.boundingBox();
          if (!b || b.x < 0 || b.y < 0 || b.x + b.width > view.width || b.y + b.height > view.height) continue;
          await el.hover();
          await expect(el.locator('.arc-edge__text')).toBeVisible();
          await page.mouse.move(0, 0);
          break;
        }
      }
      if (shots) await page.screenshot({ path: resolve(shots, `${year}-mid.jpg`), type: 'jpeg', quality: 82 });

      // Near: everything, with badges, exemplars and the off-map names showing.
      await a.setZoom(zoomIn('near', bands), center);
      expect(await a.band()).toBe('near');
      expect(await page.locator('.exemplar-marker').count()).toBeGreaterThan(0);
      if (await edge.count()) await expect(edge.locator('.arc-edge__text')).toBeVisible();
      if (shots) await page.screenshot({ path: resolve(shots, `${year}-near.jpg`), type: 'jpeg', quality: 82 });
    });
  }

  test('the near band is the only one that shows every tier', async ({ page }) => {
    const { data, tax } = await open(page, '?view=all&year=1324');
    const bands = data.frame.zoom_bands;
    const a = atlas(page);
    const tiers = Object.keys(tax.prominence);
    await a.setZoom(zoomIn('near', bands));
    expect(new Set(await a.shownRanks()).size).toBe(tiers.length);
    await a.setZoom(zoomIn('mid', bands));
    expect(Math.max(...(await a.shownRanks()))).toBe(1);
  });
});
