import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateStyleMin } from '@maplibre/maplibre-gl-style-spec';
import { describe, expect, it } from 'vitest';
import type { ModuleGeo } from '../src/data/types';
import { BASE_LAYER_NAMES } from '../src/data/types';
import { buildBaseStyle } from '../src/map/basemap';
import { basePalette, cssVarName } from '../src/theme/palette';

const empty = { type: 'FeatureCollection' as const, features: [] };
const geo: ModuleGeo = {
  module: 'test',
  frame: { id: 'test', title: 'Test', start: 1000, end: 1100, bbox: [0, 0, 10, 10], view_bbox: [-5, -5, 15, 15], regions: [], shown_regions: [] },
  attribution: ['Natural Earth (public domain)'],
  base: Object.fromEntries(BASE_LAYER_NAMES.map((n) => [n, `test-base-${n}.json`])) as ModuleGeo['base'],
  polities: empty,
};

describe('base style', () => {
  const style = buildBaseStyle(geo, basePalette);

  it('is a valid MapLibre style', () => {
    expect(validateStyleMin(style)).toEqual([]);
  });

  it('makes no network requests outside the site (self-hosted only)', () => {
    const json = JSON.stringify(style);
    expect(json).not.toMatch(/https?:\/\//);
    expect(style.glyphs).toBeUndefined();
    expect(style.sprite).toBeUndefined();
    for (const s of Object.values(style.sources)) expect(s.type).toBe('geojson');
  });

  it('draws physical layers only, water above land and coast on top', () => {
    const ids = style.layers.map((l) => l.id);
    expect(ids[0]).toBe('land'); // the sea is the map container's background, not a layer
    expect(style.layers.some((l) => l.type === 'background')).toBe(false);
    expect(ids.indexOf('land')).toBeLessThan(ids.indexOf('lakes'));
    expect(ids.at(-1)).toBe('coastline');
    expect(ids.some((id) => /border|admin|countr/i.test(id))).toBe(false);
  });

  it('credits its sources', () => {
    expect(JSON.stringify(style.sources)).toContain('Natural Earth');
  });
});

describe('palette', () => {
  it('maps palette keys to CSS custom properties', () => {
    expect(cssVarName('textMuted')).toBe('--c-text-muted');
  });

  it('is the only source file with hex colors', () => {
    const app = fileURLToPath(new URL('..', import.meta.url));
    const files = ['index.html', ...readdirSync(resolve(app, 'src'), { recursive: true, encoding: 'utf8' })
      .filter((f) => /\.(ts|css)$/.test(f)).map((f) => `src/${f.replace(/\\/g, '/')}`)];
    expect(files).toContain('src/theme/palette.ts');
    for (const f of files.filter((x) => x !== 'src/theme/palette.ts')) {
      expect(readFileSync(resolve(app, f), 'utf8'), f).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    }
  });
});
