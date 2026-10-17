import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

// Screenshots for docs/geometry-review.md: every polity shape, at a year inside its span, framed on the shape,
// with the shape's edge traced in black so the drawn extent is easy to judge. Off by default:
//   GEOMETRY_REVIEW=1 PW_CHANNEL=msedge npx playwright test geometry-review --project=desktop

const out = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs/geometry-review');

interface Shape { place_id: string; year_from: number; year_to: number | null; bounds: [number, number, number, number]; geometry: object }

test('geometry review screenshots', async ({ page }, info) => {
  test.skip(!process.env.GEOMETRY_REVIEW || info.project.name !== 'desktop', 'set GEOMETRY_REVIEW=1 to regenerate');
  test.setTimeout(300_000);
  mkdirSync(out, { recursive: true });
  await page.setViewportSize({ width: 1100, height: 760 });
  await page.goto('./');
  await expect(page.locator('#map')).toHaveAttribute('data-ready', 'true', { timeout: 45_000 });
  const shapes: Shape[] = await page.evaluate(async () => {
    const geo = await (await fetch('data/africa-geo.json')).json();
    return geo.polities.features.map((f: { properties: Shape; geometry: { type: string; coordinates: number[][][] | number[][][][] } }) => {
      const polys = (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates) as number[][][][];
      const pts = polys.flatMap((p) => p[0]);
      const xs = pts.map((c) => c[0]);
      const ys = pts.map((c) => c[1]);
      return { ...f.properties, geometry: f.geometry, bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
    });
  });
  for (const s of shapes) {
    const frame: { start: number; end: number } = await page.evaluate(() =>
      (window as unknown as { __atlas: { atlas: { frame: { start: number; end: number } } } }).__atlas.atlas.frame);
    const year = Math.min(Math.max(s.year_from, frame.start), (s.year_to ?? frame.end) - 1, frame.end);
    await page.evaluate(({ s, year }) => {
      const w = window as unknown as { __atlas: { map: any; setYear: (y: number) => void; cards: { close: () => void } } };
      const map = w.__atlas.map;
      w.__atlas.cards.close();
      document.getElementById('legend')?.removeAttribute('open');
      w.__atlas.setYear(year);
      if (map.getLayer('review-edge')) map.removeLayer('review-edge');
      if (map.getSource('review')) map.removeSource('review');
      map.addSource('review', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: s.geometry } });
      map.addLayer({ id: 'review-edge', type: 'line', source: 'review', paint: { 'line-color': 'black', 'line-width': 2 } });
      const [x0, y0, x1, y1] = s.bounds;
      map.fitBounds([[x0, y0], [x1, y1]], { padding: 90, animate: false, maxZoom: 7 });
    }, { s, year });
    await page.waitForFunction(() => (window as unknown as { __atlas: { map: { loaded: () => boolean } } }).__atlas.map.loaded());
    await page.waitForTimeout(600);
    await page.screenshot({ path: resolve(out, `${s.place_id}-${s.year_from}.jpg`), type: 'jpeg', quality: 80 });
  }
});
