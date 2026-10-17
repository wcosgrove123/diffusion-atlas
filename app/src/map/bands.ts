// Zoom bands (semantic zoom): the map shows less when zoomed out and more as you zoom in, so the opening view
// reads like a poster and detail appears on the way in. The thresholds come from the module frame
// (data/modules.yaml, zoom_bands); what each band shows is the table here and nowhere else. Which records a band
// shows comes from their prominence (taxonomy section 8): the band's rank admits that many tiers, most
// prominent first, and the last band admits every tier.
import type { ModuleFrame, Taxonomy } from '../data/types';

export type Band = 'far' | 'mid' | 'near';
export const BANDS: Band[] = ['far', 'mid', 'near'];

/** The band a map zoom level falls in: far below `mid`, near from `near` on. */
export function bandFor(zoom: number, bands: ModuleFrame['zoom_bands']): Band {
  if (zoom < bands.mid) return 'far';
  if (zoom < bands.near) return 'mid';
  return 'near';
}

/** A zoom level inside a band (its middle; the near band has no top, so a little past its start). */
export function zoomIn(band: Band, bands: ModuleFrame['zoom_bands']): number {
  if (band === 'far') return bands.mid - 1;
  if (band === 'mid') return (bands.mid + bands.near) / 2;
  return bands.near + 0.75;
}

/** Prominence tiers, most prominent first, as the taxonomy lists them. */
export function tiers(tax: Pick<Taxonomy, 'prominence'>): string[] {
  return Object.keys(tax.prominence ?? {});
}

/** The rank of a tier: 0 for the most prominent. A tier the taxonomy does not list ranks last. */
export function tierRank(tier: string | undefined, order: string[]): number {
  const i = order.indexOf(tier ?? '');
  return i < 0 ? order.length : i;
}

/** Does a record of this tier show in this band? The far band shows the first tier only; near shows all. */
export function showsIn(band: Band, tier: string | undefined, order: string[]): boolean {
  const b = BANDS.indexOf(band);
  if (b >= BANDS.length - 1) return true;
  return tierRank(tier, order) <= b;
}

/** How the map draws each band. The marker family gets richer with zoom: dot, donut, donut with badges. */
export interface BandDetail {
  /** town markers: a plain dot in the urban profile's pattern, or the share donut */
  marker: 'dot' | 'donut';
  /** community badges beside the donut */
  badges: boolean;
  /** area names: the short form (before any parenthesis) or the full name */
  names: 'short' | 'full';
  /** town and point names: none (hover shows one), the most prominent tier only, or all */
  townNames: 'none' | 'top' | 'all';
  /** event markers near the slider year */
  events: boolean;
  /** exemplar markers (things to see) */
  exemplars: boolean;
  /** arcs: one corridor line per route family, or each diffusion's own arc with its outcome glyph */
  arcs: 'corridor' | 'arc';
  /** labels naming the off-map end of an arc: never, on hover or focus, or always */
  edgeLabels: 'none' | 'hover' | 'always';
}

export const BAND_DETAIL: Record<Band, BandDetail> = {
  far: { marker: 'dot', badges: false, names: 'short', townNames: 'none', events: false, exemplars: false, arcs: 'corridor', edgeLabels: 'none' },
  mid: { marker: 'donut', badges: false, names: 'short', townNames: 'top', events: true, exemplars: false, arcs: 'arc', edgeLabels: 'hover' },
  near: { marker: 'donut', badges: true, names: 'full', townNames: 'all', events: true, exemplars: true, arcs: 'arc', edgeLabels: 'always' },
};

/** The data attributes a band puts on the stage element, which the stylesheet reads (no vocabulary in CSS). */
export function bandAttributes(band: Band): Record<string, string> {
  const d = BAND_DETAIL[band];
  return { band, names: d.names, townNames: d.townNames, edgeLabels: d.edgeLabels };
}
