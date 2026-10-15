import { expect, test } from '@playwright/test';

// Phase 0 acceptance: the site shows the module's base map (land, coast, rivers, lakes; no modern borders),
// makes no requests off its own origin, and logs no errors.

test('the base map loads from our own files only', async ({ page }, info) => {
  const errors: string[] = [];
  const offsite: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
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

  // The whole module bbox is on screen at the first view, on a phone as well as a laptop.
  const fits = await page.evaluate((bbox: number[]) => {
    const map = (window as unknown as { __atlasMap: { getBounds: () => { toArray: () => number[][] } } }).__atlasMap;
    const [[w, s], [e, n]] = map.getBounds().toArray();
    return { w: w <= bbox[0] + 1, e: e >= bbox[2] - 1, s: s <= bbox[1] + 1, n: n >= bbox[3] - 1 };
  }, frame.bbox);
  expect(fits).toEqual({ w: true, e: true, s: true, n: true });

  // No horizontal page scroll at phone width.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);

  await page.screenshot({ path: info.outputPath(`base-map-${info.project.name}.png`) });
  expect(offsite, 'requests to other hosts').toEqual([]);
  expect(failed, 'failed requests').toEqual([]);
  expect(errors, 'console errors').toEqual([]);
});
