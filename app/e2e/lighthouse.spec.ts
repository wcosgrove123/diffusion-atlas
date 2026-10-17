import { chromium, expect, test } from '@playwright/test';
import lighthouse from 'lighthouse';

// Phase 1 acceptance check 6 (docs/build-plan.md): Lighthouse performance on a throttled mid-tier mobile >= 80.
// Lighthouse's default config is that profile: a Moto G Power class phone, 4x CPU slowdown, slow 4G, simulated.
// It runs against scripts/serve.mjs, which gzips like GitHub Pages. Scores vary from run to run on a busy machine,
// so the check takes the median of three runs, as Lighthouse's own guidance recommends.
//
// The bar is 80 on a machine with a graphics chip, like the classroom Chromebooks. GitHub's test runners have none,
// so they draw the map in software and score about 70 for the same site; CI sets LIGHTHOUSE_MIN=65 there, which
// still catches a real slowdown (docs/decisions-for-wil.md, 16). Run it on a GPU machine before a release.

const PORT = 9333;
const RUNS = 3;
const MIN_SCORE = Number(process.env.LIGHTHOUSE_MIN || 80);

test(`Lighthouse performance on a throttled mid-tier mobile is at least ${MIN_SCORE}`, async ({ baseURL }, info) => {
  test.skip(info.project.name !== 'desktop', 'one run is enough; Lighthouse sets its own device');
  test.setTimeout(360_000);
  const browser = await chromium.launch({
    channel: process.env.PW_CHANNEL || undefined,
    args: [`--remote-debugging-port=${PORT}`, '--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=default'],
  });
  const scores: number[] = [];
  try {
    for (let i = 0; i < RUNS; i++) {
      const result = await lighthouse(`${baseURL}?year=1352`, {
        port: PORT, output: 'json', logLevel: 'error', onlyCategories: ['performance'],
      });
      const lhr = result!.lhr;
      const score = Math.round((lhr.categories.performance.score ?? 0) * 100);
      scores.push(score);
      const audit = (id: string) => lhr.audits[id]?.displayValue ?? '';
      const line = `run ${i + 1}: performance ${score}; FCP ${audit('first-contentful-paint')}, `
        + `LCP ${audit('largest-contentful-paint')}, TBT ${audit('total-blocking-time')}, `
        + `CLS ${audit('cumulative-layout-shift')}, SI ${audit('speed-index')}, ${audit('total-byte-weight')}`;
      info.annotations.push({ type: 'lighthouse', description: line });
      console.log(line);
    }
  } finally {
    await browser.close();
  }
  const median = [...scores].sort((a, b) => a - b)[Math.floor(RUNS / 2)];
  console.log(`median performance ${median} (${scores.join(', ')})`);
  expect(median).toBeGreaterThanOrEqual(MIN_SCORE);
});
