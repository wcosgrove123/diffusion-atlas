import { type Page, expect, test } from '@playwright/test';

// The "AP World only" view (docs/decisions-for-wil.md, 20): students open on the records the AP World curriculum
// names (plus what follows them); "AP World only" unticked shows everything. Expected ids come from the built data.

interface Data {
  frame: { start: number; end: number };
  places: { id: string; kind: string; span?: { start: number; end: number | null } | null; _file: string }[];
  events: { id: string; year: number; keyframe?: boolean }[];
  ap_world: { default_view: string; why: Record<string, string> } | null;
}

async function open(page: Page, query = ''): Promise<Data> {
  await page.goto(`./${query}`);
  await expect(page.locator('#map')).toHaveAttribute('data-ready', 'true', { timeout: 45_000 });
  return page.evaluate(async () => (await (await fetch('data/africa.json')).json()));
}

test.describe('AP World only view', () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== 'desktop', 'runs once at 1280x720');
  });

  test('opens on the AP set, and the switch brings everything back', async ({ page }) => {
    const data = await open(page);
    test.skip(!data.ap_world, 'this module has no AP World list');
    const ap = data.ap_world!;
    expect(ap.default_view).toBe('ap');
    await expect(page.locator('#ap-only')).toBeChecked();

    // The three CED examples for State Building in Africa are in the set and on the map.
    const named = Object.entries(ap.why).filter(([id, why]) => id.startsWith('pl-') && why.startsWith('named')).map(([id]) => id);
    expect(named.length).toBeGreaterThan(20);
    for (const id of ['pl-great-zimbabwe', 'pl-ethiopia-solomonic', 'pl-hausa-states']) expect(named).toContain(id);

    // A place outside the set is hidden at a year inside its span; with the switch off it shows.
    const hidden = data.places.filter((p) => p.kind !== 'external' && !ap.why[p.id] && p.span && p.span.start <= 1340 && (p.span.end === null || p.span.end > 1340));
    expect(hidden.length).toBeGreaterThan(5);
    const setYear = (y: number) => page.evaluate((year) => (window as unknown as { __atlas: { setYear: (y: number) => Promise<unknown> } }).__atlas.setYear(year), y);
    await setYear(1340);
    for (const p of hidden.slice(0, 6)) await expect(page.locator(`.place-marker[data-place="${p.id}"]`)).toBeHidden();
    await expect(page.locator('.place-marker[data-place="pl-mali"]')).toBeVisible();
    const polities = await page.evaluate(() => (window as unknown as { __atlas: { map: { querySourceFeatures: (s: string) => { properties: { place_id: string } }[] } } }).__atlas.map
      .querySourceFeatures('polities').map((f) => f.properties.place_id));
    for (const p of hidden) expect(polities).not.toContain(p.id);

    // Keyframes of hidden places are skipped by the stepping.
    const kfHidden = data.events.filter((e) => e.keyframe && !ap.why[e.id]);
    expect(kfHidden.length).toBeGreaterThan(0);
    expect(await page.locator('.timeline__tick').count()).toBe(data.events.filter((e) => e.keyframe && ap.why[e.id]).length);

    // Everything: the switch off.
    await page.evaluate(() => (window as unknown as { __atlas: { setApOnly: (on: boolean) => Promise<unknown> } }).__atlas.setApOnly(false));
    for (const p of hidden.slice(0, 6)) await expect(page.locator(`.place-marker[data-place="${p.id}"]`)).toBeVisible();
    expect(await page.locator('.timeline__tick').count()).toBe(data.events.filter((e) => e.keyframe).length);

    // The card says which side of the line a record is on.
    await page.evaluate((id) => (window as unknown as { __atlas: { cards: { openPlace: (id: string) => void } } }).__atlas.cards.openPlace(id), hidden[0].id);
    await expect(page.locator('.card .chip--ap-out')).toBeVisible();
    await page.evaluate(() => (window as unknown as { __atlas: { cards: { openPlace: (id: string) => void } } }).__atlas.cards.openPlace('pl-mali'));
    await expect(page.locator('.card .chip--ap-in')).toBeVisible();
  });

  test('?view=all opens on everything', async ({ page }) => {
    const data = await open(page, '?view=all');
    test.skip(!data.ap_world, 'this module has no AP World list');
    await expect(page.locator('#ap-only')).not.toBeChecked();
  });
});
