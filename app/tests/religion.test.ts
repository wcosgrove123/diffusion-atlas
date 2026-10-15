import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { ModuleData, ReligionProfile, Taxonomy } from '../src/data/types';
import {
  covers, donutSegments, eventsNear, keyframes, nearestSnapshot, nextKeyframe, prevKeyframe, profileAt, rankedTraditions,
  sameReligion, shownEvents, shownPlaces,
} from '../src/data/profiles';
import { FILL_TILE, parsePatternId, patternId, patternImage, patternKind, profileLook } from '../src/map/patterns';
import { traditionColors, traditionColorsDark } from '../src/theme/palette';

const build = resolve(fileURLToPath(new URL('../../data/build', import.meta.url)));
const haveBuild = existsSync(resolve(build, 'africa.json'));
const read = <T>(f: string): T => JSON.parse(readFileSync(resolve(build, f), 'utf8')) as T;

const profile = (over: Partial<ReligionProfile>): ReligionProfile => ({
  id: 'rp-x', place: 'pl-x', span: { start: 1300, end: 1400 }, stratum: 'court', traditions: [], relation: 'exclusive',
  summary: '', evidence: [], confidence: 'high', _file: 'x', ...over,
});

describe('profile lookup', () => {
  it('uses start <= year < end, with null end open', () => {
    expect(covers({ start: 1300, end: 1400 }, 1300)).toBe(true);
    expect(covers({ start: 1300, end: 1400 }, 1399)).toBe(true);
    expect(covers({ start: 1300, end: 1400 }, 1400)).toBe(false);
    expect(covers({ start: 1300, end: null }, 1999)).toBe(true);
  });

  it('ranks traditions by share, keeping data order on ties', () => {
    const p = profile({
      relation: 'contested', traditions: [
        { family: 'abrahamic', tradition: 'islam', share: 'significant' },
        { family: 'local', tradition: 'indigenous', share: 'significant' },
        { family: 'abrahamic', tradition: 'judaism', share: 'dominant' },
      ],
    });
    expect(rankedTraditions(p).map((t) => t.tradition)).toEqual(['judaism', 'islam', 'indigenous']);
  });

  it('sizes donut segments 3 / 2 / 1 / 0.5 and skips unknown shares', () => {
    const p = profile({
      traditions: [
        { family: 'abrahamic', tradition: 'islam', share: 'dominant' },
        { family: 'local', tradition: 'indigenous', share: 'trace' },
        { family: 'abrahamic', tradition: 'judaism', share: 'unknown' },
      ],
    });
    expect(donutSegments(p)).toEqual([
      { tradition: 'islam', share: 'dominant', fraction: 3 / 3.5 },
      { tradition: 'indigenous', share: 'trace', fraction: 0.5 / 3.5 },
    ]);
  });

  it('treats a court identical to the fill as the same (the ring is omitted)', () => {
    const t = [{ family: 'abrahamic', tradition: 'islam', share: 'dominant' }];
    expect(sameReligion(profile({ traditions: t }), profile({ stratum: 'rural', traditions: t }))).toBe(true);
    expect(sameReligion(profile({ traditions: t }), profile({ stratum: 'rural', relation: 'undocumented', traditions: [] }))).toBe(false);
    expect(sameReligion(profile({ traditions: t }), null)).toBe(false);
  });

  it('finds the nearest Polity Profile snapshot', () => {
    expect(nearestSnapshot([{ year: 1240 }, { year: 1330 }], 1300)?.year).toBe(1330);
    expect(nearestSnapshot([{ year: 1240 }, { year: 1330 }], 1250)?.year).toBe(1240);
    expect(nearestSnapshot([], 1250)).toBeNull();
  });
});

describe('patterns', () => {
  const a = traditionColors.islam;
  const b = traditionColors.indigenous;
  const kinds = ['exclusive', 'plural', 'syncretic', 'coexisting', 'contested', 'undocumented'] as const;

  it('gives every relation its own pattern, so relations never rely on color alone', () => {
    const masks = kinds.map((k) => {
      const img = patternImage(k, a, b, 'fill', 1);
      // which pixels differ from the tile's first pixel: the pattern's shape, independent of its colors
      const px = (i: number) => [0, 1, 2].map((c) => img.data[i * 4 + c]);
      const first = px(0);
      return Array.from({ length: img.width * img.height }, (_, i) =>
        Math.hypot(...px(i).map((v, c) => v - first[c])) > 40 ? 1 : 0).join('');
    });
    expect(new Set(masks).size).toBe(kinds.length);
  });

  it('makes MapLibre-friendly power-of-two tiles', () => {
    for (const k of kinds) {
      const img = patternImage(k, a, b);
      expect(img.width & (img.width - 1)).toBe(0);
      expect(img.height & (img.height - 1)).toBe(0);
      expect(img.data.length).toBe(img.width * img.height * 4);
    }
    expect(FILL_TILE.w).toBe(32);
  });

  it('round-trips pattern ids', () => {
    const look = { kind: 'syncretic' as const, a, b };
    expect(parsePatternId(patternId(look, 'ring'))).toEqual({ shape: 'ring', ...look });
    expect(parsePatternId(patternId({ kind: 'undocumented', a, b }))?.kind).toBe('undocumented');
    expect(patternKind('a-relation-added-later')).toBe('plural');
  });

  it('draws two entries of one tradition in two shades', () => {
    const p = profile({
      relation: 'contested', traditions: [
        { family: 'abrahamic', tradition: 'christianity', share: 'dominant' },
        { family: 'abrahamic', tradition: 'christianity', share: 'significant' },
      ],
    });
    const look = profileLook(p);
    expect(look.a).toBe(traditionColors.christianity);
    expect(look.b).not.toBe(look.a);
  });
});

describe.skipIf(!haveBuild)('built data', () => {
  const data = haveBuild ? read<ModuleData>('africa.json') : (null as unknown as ModuleData);
  const tax = haveBuild ? read<Taxonomy>('taxonomy.json') : (null as unknown as Taxonomy);

  it('has a color for every taxonomy tradition, in both modes', () => {
    for (const t of Object.keys(tax.traditions)) {
      expect(traditionColors[t], t).toMatch(/^#[0-9a-f]{6}$/);
      expect(traditionColorsDark[t], t).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('has a student label for every relation', () => {
    expect(Object.keys(tax.religion.relation_labels).sort()).toEqual(Object.keys(tax.religion.relation).sort());
  });

  it('never has two profiles covering one year for one place, stratum and community', () => {
    const groups = new Map<string, ReligionProfile[]>();
    for (const p of data.religion_profiles) {
      const k = `${p.place}|${p.stratum}|${p.community_name ?? ''}`;
      groups.set(k, [...(groups.get(k) ?? []), p]);
    }
    for (const [k, ps] of groups) {
      const sorted = [...ps].sort((x, y) => x.span.start - y.span.start);
      for (let i = 1; i < sorted.length; i++) {
        const prevEnd = sorted[i - 1].span.end;
        expect(prevEnd !== null && prevEnd <= sorted[i].span.start, `${k}: ${sorted[i - 1].id} overlaps ${sorted[i].id}`).toBe(true);
      }
    }
  });

  it('finds Mali\'s court profile for 1352', () => {
    expect(profileAt(data.religion_profiles, 'pl-mali', 'court', 1352)?.id).toMatch(/^rp-mali-court-/);
  });

  it('steps the shown regions\' keyframes in order', () => {
    const kfs = keyframes(shownEvents(data));
    expect(kfs.length).toBeGreaterThan(0);
    const years = kfs.map((e) => e.year);
    expect(years).toEqual([...years].sort((x, y) => x - y));
    expect(nextKeyframe(kfs, data.frame.start)?.year).toBe(years[0]);
    expect(prevKeyframe(kfs, years[0])).toBeNull();
    expect(eventsNear(shownEvents(data), years[0]).some((e) => e.id === kfs[0].id)).toBe(true);
  });

  it('draws only places of the shown regions', () => {
    const shown = new Set(data.frame.shown_regions);
    expect(shownPlaces(data).every((p) => shown.has(p._file))).toBe(true);
  });
});
