import { describe, expect, it } from 'vitest';
import { BANDS, BAND_DETAIL, bandAttributes, bandFor, showsIn, tierRank, tiers, zoomIn } from '../src/map/bands';
import { clampToRegionZoom, keyframeRegion } from '../src/map/view';
import type { AtlasEvent } from '../src/data/types';

// Zoom bands (src/map/bands.ts): thresholds from the module frame, tiers from the taxonomy, the band table once.

const bands = { mid: 4, near: 5.5 };
const tax = { prominence: { continent: { label: 'Course landmarks', definition: '' }, region: { label: 'Other course places', definition: '' }, local: { label: 'Places beyond the course', definition: '' } } };

describe('band selection', () => {
  it('is far below mid, mid up to near, near from there on', () => {
    expect(bandFor(2.5, bands)).toBe('far');
    expect(bandFor(3.99, bands)).toBe('far');
    expect(bandFor(4, bands)).toBe('mid');
    expect(bandFor(5.49, bands)).toBe('mid');
    expect(bandFor(5.5, bands)).toBe('near');
    expect(bandFor(9, bands)).toBe('near');
  });

  it('gives a zoom inside each band', () => {
    for (const b of BANDS) expect(bandFor(zoomIn(b, bands), bands)).toBe(b);
  });

  it('reads the thresholds from the frame, not from code', () => {
    const other = { mid: 2, near: 3 };
    expect(bandFor(2.5, other)).toBe('mid');
    expect(bandFor(3.5, other)).toBe('near');
  });

  it('holds a region camera inside the mid band', () => {
    expect(bandFor(clampToRegionZoom(2, bands), bands)).toBe('mid');
    expect(bandFor(clampToRegionZoom(8, bands), bands)).toBe('mid');
    expect(clampToRegionZoom(4.5, bands)).toBe(4.5);
  });
});

describe('what a band shows', () => {
  const order = tiers(tax);

  it('ranks tiers in taxonomy order; unknown tiers rank last', () => {
    expect(order).toEqual(['continent', 'region', 'local']);
    expect(tierRank('continent', order)).toBe(0);
    expect(tierRank('local', order)).toBe(2);
    expect(tierRank(undefined, order)).toBe(3);
    expect(tierRank('huge', order)).toBe(3);
  });

  it('admits one more tier per band and everything close up', () => {
    expect(showsIn('far', 'continent', order)).toBe(true);
    expect(showsIn('far', 'region', order)).toBe(false);
    expect(showsIn('mid', 'region', order)).toBe(true);
    expect(showsIn('mid', 'local', order)).toBe(false);
    expect(showsIn('near', 'local', order)).toBe(true);
    expect(showsIn('near', undefined, order)).toBe(true);
    // a record with no tier (older data) shows only close up
    expect(showsIn('far', undefined, order)).toBe(false);
  });

  it('grows the marker family with zoom: dot, donut, donut with badges', () => {
    expect(BAND_DETAIL.far.marker).toBe('dot');
    expect(BAND_DETAIL.far.badges).toBe(false);
    expect(BAND_DETAIL.mid.marker).toBe('donut');
    expect(BAND_DETAIL.mid.badges).toBe(false);
    expect(BAND_DETAIL.near.marker).toBe('donut');
    expect(BAND_DETAIL.near.badges).toBe(true);
  });

  it('collapses arcs to corridors only when zoomed out, and never labels edges there', () => {
    expect(BAND_DETAIL.far.arcs).toBe('corridor');
    expect(BAND_DETAIL.far.edgeLabels).toBe('none');
    expect(BAND_DETAIL.mid.arcs).toBe('arc');
    expect(BAND_DETAIL.mid.edgeLabels).toBe('hover');
    expect(BAND_DETAIL.near.edgeLabels).toBe('always');
    expect(BAND_DETAIL.far.events).toBe(false);
    expect(BAND_DETAIL.far.exemplars).toBe(false);
    expect(BAND_DETAIL.near.exemplars).toBe(true);
  });

  it('hands the stylesheet the band as data attributes', () => {
    expect(bandAttributes('mid')).toEqual({ band: 'mid', names: 'short', townNames: 'top', edgeLabels: 'hover' });
  });
});

describe('the opening region', () => {
  const kf = (year: number, file: string): AtlasEvent => ({ id: `ev-${year}-${file}`, year, place: 'pl-x', title: '', summary: '', evidence: [], confidence: 'high', keyframe: true, _file: file });
  const keyframes = [kf(1235, 'west'), kf(1270, 'horn'), kf(1324, 'west'), kf(1331, 'coast')];

  it('is the latest keyframe at or before the year', () => {
    expect(keyframeRegion(keyframes, 1300)).toBe('horn');
    expect(keyframeRegion(keyframes, 1324)).toBe('west');
    expect(keyframeRegion(keyframes, 1450)).toBe('coast');
  });

  it('is the first keyframe before any, and null without keyframes', () => {
    expect(keyframeRegion(keyframes, 1200)).toBe('west');
    expect(keyframeRegion([], 1300)).toBeNull();
  });
});
