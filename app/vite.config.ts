import { defineConfig } from 'vitest/config';

// GitHub Pages serves the site at /<repo-name>/. CI sets BASE_PATH from the repository name,
// so the repo name decision (docs/decisions-for-wil.md) does not need a code change.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500, // MapLibre (about 1 MB minified) is the one large dependency
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'], // e2e/ is Playwright's
  },
});
