import { describe, expect, it } from 'vitest';
import { frameBounds, frameLabel, panBounds, pickModule } from '../src/data/frame';
import { dataUrl } from '../src/data/load';
import type { ModuleFrame } from '../src/data/types';

const a: ModuleFrame = { id: 'a', title: 'Region A', start: 1200, end: 1450, bbox: [-20, -36, 60, 40], view_bbox: [-72, -64, 112, 70] };
const b: ModuleFrame = { id: 'b', title: 'Region B', start: 900, end: 1100, bbox: [60, -10, 150, 55], view_bbox: [50, -20, 160, 65] };

describe('module frames', () => {
  it('turns a bbox into MapLibre bounds', () => {
    expect(frameBounds(a)).toEqual([[-20, -36], [60, 40]]);
  });

  it('pans within the view box the pipeline clipped the base map to', () => {
    expect(panBounds(a)).toEqual([[-72, -64], [112, 70]]);
    expect(panBounds(b)).toEqual([[50, -20], [160, 65]]);
  });

  it('picks the requested module, else the first', () => {
    expect(pickModule([a, b], 'b')).toBe(b);
    expect(pickModule([a, b], 'nope')).toBe(a);
    expect(pickModule([a, b], null)).toBe(a);
    expect(() => pickModule([], null)).toThrow();
  });

  it('labels a frame with its own years (nothing assumes one module)', () => {
    expect(frameLabel(b)).toBe('Region B, 900–1100');
  });
});

describe('data urls', () => {
  it('respects the GitHub Pages base path', () => {
    expect(dataUrl('modules.json', '/')).toBe('/data/modules.json');
    expect(dataUrl('modules.json', '/diffusion-atlas/')).toBe('/diffusion-atlas/data/modules.json');
    expect(dataUrl('modules.json', '/diffusion-atlas')).toBe('/diffusion-atlas/data/modules.json');
  });
});
