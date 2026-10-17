import './styles.css';
import { buildAtlas, visibleIn, YearState } from './atlas';
import { defaultLens } from './data/profiles';
import { frameLabel, pickModule, shownBounds } from './data/frame';
import { loadModuleData, loadModuleGeo, loadModuleIndex, loadTaxonomy } from './data/load';
import { ARC_SOURCE, ArcLayer, addArcLayers } from './map/arcs';
import { type Band, bandAttributes, bandFor } from './map/bands';
import { createMap } from './map/createMap';
import { MarkerLayer } from './map/markers';
import { keyframeRegion, regionBounds, regionCamera } from './map/view';
import { POLITY_LAYERS, POLITY_SOURCE, addReligionLayers, polityFeatures, updateReligionLayers } from './map/religionLayer';
import { Cards } from './ui/cards';
import { buildLegend } from './ui/legend';
import { Timeline } from './ui/timeline';
import { applyUiPalette, traditionColors } from './theme/palette';
import { h } from './ui/dom';

/**
 * Let the browser paint and handle input between startup steps. Each step then runs as its own short task, which
 * keeps a slow Chromebook responsive while the map starts (and is what Lighthouse's blocking-time check measures).
 */
const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

async function start(): Promise<void> {
  applyUiPalette(document.documentElement);
  const status = document.getElementById('map-status')!;
  const title = document.getElementById('module-title')!;
  const container = document.getElementById('map')!;
  const stage = document.querySelector('.stage')!;
  status.textContent = 'Loading the map';
  try {
    const params = new URLSearchParams(location.search);
    const index = await loadModuleIndex();
    const frame = pickModule(index.modules, params.get('module'));
    title.textContent = frameLabel(frame);
    document.title = `Diffusion Atlas: ${frameLabel(frame)}`;
    const [geo, data, tax] = await Promise.all([loadModuleGeo(frame.id), loadModuleData(frame.id), loadTaxonomy()]);
    await nextTask();
    const atlas = buildAtlas(data, geo, tax);
    // One lens at a time (product-spec 7). Lens tabs arrive in Phase 3; until then the map shows the default lens.
    const lens = defaultLens(tax);
    const startYear = Number(params.get('year')) || frame.start;
    const state = new YearState(frame, frame.start);
    state.set(startYear);

    const cards = new Cards(atlas, () => state.year, (y) => state.set(y));
    const timeline = new Timeline(atlas, state, (id) => { cards.openEvent(id, false); goToKeyframe(id); }, (region) => goToRegion(region));
    stage.append(buildLegend(atlas, lens), cards.el);
    document.getElementById('controls')!.append(timeline.el);

    // The "AP World only" view (docs/decisions-for-wil.md, 20): everything else stays loaded, just not drawn.
    let apOnly = atlas.ap !== null && (params.get('view') ?? atlas.ap.defaultView) === 'ap';
    let visible = visibleIn(atlas, apOnly);
    timeline.setVisible(visible);
    const redraws: (() => void)[] = [];
    if (atlas.ap) {
      const box = h('input', { type: 'checkbox', id: 'ap-only', checked: apOnly });
      box.addEventListener('change', () => {
        apOnly = box.checked;
        visible = visibleIn(atlas, apOnly);
        timeline.setVisible(visible);
        for (const r of redraws) r();
      });
      // In the button row, so the controls keep their height (no layout shift when the switch appears).
      timeline.el.querySelector('.timeline__buttons')!.append(h('label', { class: 'view-switch', for: 'ap-only' }, box, ' AP World only'));
    }
    const legend = document.getElementById('legend')!;
    const wide = window.matchMedia('(min-width: 900px)').matches;
    // Wide screens open with the legend showing.
    if (wide) legend.setAttribute('open', '');
    await nextTask();

    const bounds = shownBounds(frame, atlas.places, geo);
    const map = createMap(container, geo, bounds);
    // Keep the view clear of an open legend.
    const padding = { top: 16, bottom: 16, right: 16, left: wide ? legend.offsetWidth + 28 : 16 };
    const bands = frame.zoom_bands;
    // Zoom bands (map/bands.ts): the stage carries the band, so the stylesheet and the legend follow it.
    let band: Band = bandFor(map.getZoom(), bands);
    const applyBand = () => { for (const [k, v] of Object.entries(bandAttributes(band))) (stage as HTMLElement).dataset[k] = v; };
    // The map opens at region zoom on the current keyframe's region: a poster, not the whole continent at once.
    const regionView = (region: string | null) => {
      const b = region && regionBounds(atlas, region);
      return b ? regionCamera(map, b, bands, padding) : null;
    };
    const opening = regionView(keyframeRegion(timeline.keyframes, state.year));
    if (opening) map.jumpTo(opening);
    else if (wide) map.fitBounds(bounds, { padding, animate: false });
    band = bandFor(map.getZoom(), bands);
    applyBand();
    // The region dropdown moves the map to that region; a keyframe stepped to while off screen brings its region in.
    const goToRegion = (region: string) => { const cam = regionView(region); if (cam) map.easeTo({ ...cam, duration: 600 }); };
    const goToKeyframe = (id: string) => {
      const ev = atlas.eventById.get(id);
      const place = ev && atlas.placeById.get(ev.place);
      if (ev && place?.location && !map.getBounds().contains([place.location.lon, place.location.lat])) goToRegion(ev._file);
    };

    map.once('load', async () => {
      addReligionLayers(map, 'rivers');
      updateReligionLayers(map, polityFeatures(data, geo, state.year, visible));
      addArcLayers(map);
      // Ready (for people and tests) once the map has drawn this first view and the markers are on it.
      const pending = new Set(['map', 'markers']);
      const done = (what: string) => {
        pending.delete(what);
        if (pending.size) return;
        performance.mark('atlas:map-ready');
        container.dataset.ready = 'true';
        status.textContent = '';
      };
      map.once('idle', () => done('map'));
      await nextTask();

      const markers = new MarkerLayer(map, atlas, {
        openPlace: (id) => cards.openPlace(id), openEvent: (id) => cards.openEvent(id), openExemplar: (id) => cards.openExemplar(id),
      });
      const arcs = new ArcLayer(map, atlas, {
        openDiffusion: (id) => cards.openDiffusion(id),
        // A corridor clicked when zoomed out: zoom in on its arcs, to region zoom at least.
        zoomTo: (b) => { const cam = regionCamera(map, b, bands, padding); if (cam) map.easeTo({ ...cam, duration: 600 }); },
      });
      // Markers and glyphs arrive in small slices (src/scheduler.ts); ready waits for the first full set.
      let drawing: Promise<unknown> = Promise.all([markers.update(state.year, visible, band), arcs.update(state.year, lens, visible, band)]);
      const firstDraw = drawing;
      const draw = (y: number) => {
        updateReligionLayers(map, polityFeatures(data, geo, y, visible));
        drawing = Promise.all([markers.update(y, visible, band), arcs.update(y, lens, visible, band)]);
        cards.refresh();
      };
      state.on(draw);
      redraws.push(() => draw(state.year));
      // Crossing into another band redraws the markers and arcs for it (once the zoom settles, not per frame).
      map.on('zoomend', () => {
        const b = bandFor(map.getZoom(), bands);
        if (b === band) return;
        band = b;
        applyBand();
        draw(state.year);
      });
      // For automated tests: resolves once the markers and arcs for the latest year are on the map and the map's
      // sources have finished loading the new data (setData hands it to a worker).
      testHooks.drawn = async () => {
        const t0 = performance.now();
        while (map.isMoving() && performance.now() - t0 < 3000) await new Promise((r) => requestAnimationFrame(r));
        await drawing;
        while (!(map.isSourceLoaded(POLITY_SOURCE) && map.isSourceLoaded(ARC_SOURCE)) && performance.now() - t0 < 3000) {
          await new Promise((r) => requestAnimationFrame(r));
        }
      };
      const clickable = [POLITY_LAYERS.fill, POLITY_LAYERS.ring];
      map.on('click', (e) => {
        if (e.defaultPrevented) return; // an arc took the click
        const hit = map.queryRenderedFeatures(e.point, { layers: clickable })[0];
        if (hit) cards.openPlace(String(hit.properties.place_id));
      });
      for (const id of clickable) {
        map.on('mouseenter', id, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', id, () => { map.getCanvas().style.cursor = ''; });
      }
      await firstDraw;
      done('markers');
    });
    // Exposed for automated browser tests only.
    const testHooks: { drawn: () => Promise<unknown> } = { drawn: () => Promise.resolve() };
    Object.assign(window as unknown as Record<string, unknown>, {
      __atlasMap: map,
      __atlas: {
        map, atlas, state, cards, timeline, lens, colors: traditionColors,
        setYear: (y: number) => { state.set(y); return testHooks.drawn(); },
        setApOnly: (on: boolean) => {
          const box = document.getElementById('ap-only') as HTMLInputElement | null;
          if (box && box.checked !== on) { box.checked = on; box.dispatchEvent(new Event('change')); }
          return testHooks.drawn();
        },
        // Jump to a zoom level (and center) and wait for the band's markers and arcs.
        setZoom: (zoom: number, center?: [number, number]) => { map.jumpTo({ zoom, ...(center ? { center } : {}) }); return testHooks.drawn(); },
        band: () => (stage as HTMLElement).dataset.band,
      },
    });
  } catch (err) {
    console.error(err);
    status.textContent = 'The map could not load. Try reloading the page.';
  }
}

void start();
