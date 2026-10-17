import { expect, test } from '@playwright/test';

// Phase 0 acceptance: the site shows the module's base map (land, coast, rivers, lakes; no modern borders),
// makes no requests off its own origin, and logs no errors. Runs at 1280x720 and at 360x740.

test('the base map loads from our own files only', async ({ page }, info) => {
  const errors: string[] = [];
  const offsite: string[] = [];
  page.on('console', (m) => {
    // A pattern image MapLibre could not find draws nothing (a hole in the map), and it only warns.
    if (m.type() === 'error' || (m.type() === 'warning' && /could not be loaded/.test(m.text()))) errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  const failed: string[] = [];
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  page.on('request', (r) => {
    const url = new URL(r.url());
    if (!['127.0.0.1', 'localhost'].includes(url.hostname) && url.protocol !== 'blob:' && url.protocol !== 'data:') {
      offsite.push(r.url());
    }
  });

  await page.goto('./');
  await expect(page.locator('#map')).toHaveAttribute('data-ready', 'true', { timeout: 45_000 });
  const readyMs = await page.evaluate(() => performance.getEntriesByName('atlas:map-ready')[0]?.startTime ?? -1);
  info.annotations.push({ type: 'map-ready-ms', description: String(Math.round(readyMs)) });

  // The header names the module from the data, not from code.
  const frame = await page.evaluate(async () => (await (await fetch('data/modules.json')).json()).modules[0]);
  await expect(page.locator('#module-title')).toContainText(frame.title);

  const rendered = await page.evaluate(() => {
    const map = (window as unknown as { __atlasMap: { queryRenderedFeatures: (o: object) => unknown[] } }).__atlasMap;
    const n = (id: string) => map.queryRenderedFeatures({ layers: [id] }).length;
    return { land: n('land'), coastline: n('coastline'), rivers: n('rivers'), lakes: n('lakes') };
  });
  expect(rendered.land).toBeGreaterThan(0);
  expect(rendered.coastline).toBeGreaterThan(0);
  expect(rendered.rivers).toBeGreaterThan(0);
  expect(rendered.lakes).toBeGreaterThan(0);

  // Every place of the shown regions is on screen at the first view, on a phone as well as a laptop.
  // (With every region shown, that is the whole module; Phase 1 shows the West Africa slice.)
  const offscreen = await page.evaluate(async () => {
    const data = await (await fetch('data/africa.json')).json();
    const shown = new Set(data.frame.shown_regions);
    const map = (window as unknown as { __atlasMap: { getBounds: () => { contains: (p: [number, number]) => boolean } } }).__atlasMap;
    const b = map.getBounds();
    return data.places.filter((p: { _file: string; location?: { lon: number; lat: number } }) => shown.has(p._file) && p.location)
      .filter((p: { location: { lon: number; lat: number } }) => !b.contains([p.location.lon, p.location.lat]))
      .map((p: { id: string }) => p.id);
  });
  expect(offscreen).toEqual([]);

  // No horizontal page scroll at phone width.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);

  await page.screenshot({ path: info.outputPath(`base-map-${info.project.name}.png`) });
  expect(offsite, 'requests to other hosts').toEqual([]);
  expect(failed, 'failed requests').toEqual([]);
  expect(errors, 'console errors').toEqual([]);
});
