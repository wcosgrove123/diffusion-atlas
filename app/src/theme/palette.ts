// The one place colors live (docs/product-spec.md 3.4). Nothing else in the app may contain a hex code.
// Phase 0 holds only the physical base map and the page chrome. Tradition and lens colors arrive in
// Phase 1, keyed by taxonomy values and checked for color-vision deficiency and contrast before they ship.

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
};

/** CSS custom property name for a palette key: textMuted -> --c-text-muted */
export function cssVarName(key: string): string {
  return `--c-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}

/** Expose UI colors to CSS as custom properties so stylesheets never hold hex codes. */
export function applyUiPalette(root: HTMLElement, ui: UiPalette = uiPalette): void {
  for (const [key, value] of Object.entries(ui)) root.style.setProperty(cssVarName(key), value);
}
