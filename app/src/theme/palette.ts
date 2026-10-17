// The one place colors live (docs/product-spec.md 3.4). Nothing else in the app may contain a hex code.

export interface BasePalette {
  sea: string;
  land: string;
  coastline: string;
  lake: string;
  lakeEdge: string;
  river: string;
  playa: string;
}

export interface UiPalette {
  page: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  focus: string;
  chip: string;
  accent: string;
  accentText: string;
}

/** Colors the religion lens draws with, apart from the tradition colors. */
export interface MapInkPalette {
  /** "No direct evidence": gray crosshatch on a light gray ground */
  undocumentedInk: string;
  undocumentedGround: string;
  /** "No record": outline only */
  noRecord: string;
  /** feathered polity edge */
  softEdge: string;
  /** dotted border for basis inferred / projected */
  basisDots: string;
  /** keyline around donuts, badges and point markers so they read on any fill */
  keyline: string;
  eventMarker: string;
  keyframeMarker: string;
  labelHalo: string;
  /** exemplar markers (buildings, objects, texts) */
  exemplar: string;
  /** the dash that travels along an arc when it first appears */
  arcPulse: string;
  /** hatched edge of a nomadic sphere */
  nomadicHatch: string;
}

// Muted, paper-like base so religion fills read clearly on top of it, on a projector and on a Chromebook.
export const basePalette: BasePalette = {
  sea: '#d9e4e8',
  land: '#f3eee2',
  coastline: '#7f949e',
  lake: '#c3d6de',
  lakeEdge: '#7f949e',
  river: '#86a9ba',
  playa: '#e8dfc8',
};

export const uiPalette: UiPalette = {
  page: '#fbfaf6',
  surface: '#ffffff',
  text: '#1d2428',
  textMuted: '#4c5961',
  border: '#c9cfd2',
  focus: '#1f5fbf',
  chip: '#eef0ee',
  accent: '#1d2428',
  accentText: '#ffffff',
};

export const mapInk: MapInkPalette = {
  undocumentedInk: '#6f7477',
  undocumentedGround: '#e4e3df',
  noRecord: '#5f6b72',
  softEdge: '#3b4448',
  basisDots: '#1d2428',
  keyline: '#ffffff',
  eventMarker: '#1d2428',
  keyframeMarker: '#b0342a',
  labelHalo: '#fbfaf6',
  exemplar: '#2f3c43',
  arcPulse: '#ffffff',
  nomadicHatch: '#5a4a3a',
};

/**
 * Tradition colors, keyed by taxonomy tradition (data/build/taxonomy.json `traditions`). Hue families per
 * product-spec 3.4: islam green, christianity purple, judaism gold, indigenous terracotta; the rest are reserved
 * now so later modules stay consistent. Branches are shades of their tradition (see traditionShade).
 *
 * Checked with the dataviz skill's validator (validate_palette.js, OKLab dE x100, Machado 2009 CVD at severity 1),
 * light against basePalette.land #f3eee2, dark against #1f2326, on 2026-10-15:
 *   Africa module set (islam, christianity, judaism, indigenous), --pairs all (a map: any two can touch):
 *     light: band PASS, chroma PASS, CVD worst 10.1 (deutan, judaism/islam) PASS, normal-vision 15.0 PASS,
 *            contrast all >= 3:1 PASS
 *     dark:  band PASS, chroma PASS, CVD worst 9.5 (deutan, indigenous/judaism) PASS, normal-vision 16.1 PASS,
 *            contrast all >= 3:1 PASS
 *   All twelve in this order, adjacent pairs (the reserved hues are only checked against their neighbors;
 *   re-run --pairs all on the set a new module actually draws before it ships):
 *     light: CVD worst 14.1 PASS, normal-vision 16.2 PASS, contrast PASS
 *     dark:  CVD worst 9.5 PASS, normal-vision 16.0 PASS, contrast PASS
 * Never color alone: every relation also has a pattern (map/patterns.ts) and a text label from the taxonomy.
 */
export const traditionColors: Record<string, string> = {
  islam: '#3a9371',
  christianity: '#9065d0',
  judaism: '#9f7100',
  indigenous: '#873616',
  confucianism: '#0b5388',
  buddhism: '#cf6f19',
  daoism: '#2092a8',
  hinduism: '#85284d',
  zoroastrianism: '#697710',
  jainism: '#4b3f98',
  shinto: '#ac001e',
  manichaeism: '#722f7c',
};

/** The same twelve hues stepped for a dark base map (validated as above; the app draws the light base today). */
export const traditionColorsDark: Record<string, string> = {
  islam: '#248160',
  christianity: '#a06cc4',
  judaism: '#a09446',
  indigenous: '#bd4d00',
  confucianism: '#2c6fae',
  buddhism: '#de7515',
  daoism: '#239aa7',
  hinduism: '#fb3563',
  zoroastrianism: '#7f7311',
  jainism: '#6759da',
  shinto: '#c17273',
  manichaeism: '#b23ca1',
};

/**
 * Lens colors for diffusion arcs (docs/product-spec.md 4), keyed by taxonomy lens, distinct from the tradition
 * colors under them. Only one lens's arcs show at a time, so the set is checked on adjacent pairs with the
 * dataviz validator (light, surface #f3eee2, 2026-10-16): band PASS, chroma PASS, CVD worst adjacent 12.0 PASS,
 * normal-vision worst 17.1 PASS, contrast all >= 3:1 PASS; every lens color is at least 10 (OKLab dE x100) from
 * each of the four Africa tradition colors. Never color alone: mechanism is also a line style, outcome a glyph.
 */
export const lensColors: Record<string, string> = {
  religion: '#3774b5',
  language: '#c14d69',
  architecture: '#3442e5',
  knowledge: '#1689d7',
  'art-music': '#c8577f',
  social: '#617209',
  population: '#b01fbe',
  economy: '#297d22',
  technology: '#3d89c6',
  governance: '#853866',
};

export function lensColor(lens: string): string {
  return lensColors[lens] ?? mapInk.noRecord;
}

/** Color for a taxonomy tradition. An unknown tradition is a data or palette gap: it draws as the no-record ink. */
export function traditionColor(tradition: string, colors: Record<string, string> = traditionColors): string {
  return colors[tradition] ?? mapInk.noRecord;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function rgbToHex(rgb: number[]): string {
  return `#${rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
}

/** Mix a color toward black (amount > 0) or white (amount < 0). Used for the second entry of one tradition. */
export function shade(hex: string, amount: number): string {
  const target = amount > 0 ? 0 : 255;
  const a = Math.abs(amount);
  return rgbToHex(hexToRgb(hex).map((v) => v + (target - v) * a));
}

/** CSS custom property name for a palette key: textMuted -> --c-text-muted */
export function cssVarName(key: string): string {
  return `--c-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}

/** Expose UI colors to CSS as custom properties so stylesheets never hold hex codes. */
export function applyUiPalette(root: HTMLElement, ui: UiPalette = uiPalette): void {
  for (const [key, value] of Object.entries(ui)) root.style.setProperty(cssVarName(key), value);
  for (const [key, value] of Object.entries(mapInk)) root.style.setProperty(cssVarName(`ink-${key}`), value);
}
