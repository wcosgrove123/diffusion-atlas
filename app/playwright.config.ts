import { defineConfig, devices } from '@playwright/test';

// Browser smoke tests against the production build (npm run build first; CI does).
// Locally, set PW_CHANNEL=chrome or msedge to use an installed browser instead of downloading one.
const channel = process.env.PW_CHANNEL || undefined;
// The site is built and previewed under BASE_PATH (/<repo>/ on GitHub Pages), so test it there too.
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const origin = 'http://127.0.0.1:4317';

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'e2e/.results',
  timeout: 60_000,
  reporter: [['list']],
  use: {
    baseURL: origin + base,
    channel,
    // Headless browsers render WebGL in software; ask for the GPU path where one exists.
    launchOptions: { args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=default'] },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel, viewport: { width: 1280, height: 720 } } },
    { name: 'phone', use: { ...devices['Pixel 7'], channel, viewport: { width: 360, height: 740 } } },
  ],
  webServer: {
    // Serves dist/ with gzip like GitHub Pages (scripts/serve.mjs), so sizes and timings match the live site.
    command: 'node scripts/serve.mjs 4317',
    url: origin + base,
    reuseExistingServer: !process.env.CI,
  },
});
