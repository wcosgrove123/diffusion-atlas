import './styles.css';
import { buildAtlas, YearState } from './atlas';
import { frameLabel, pickModule, shownBounds } from './data/frame';
import { loadModuleData, loadModuleGeo, loadModuleIndex, loadTaxonomy } from './data/load';
import { createMap } from './map/createMap';
import { MarkerLayer } from './map/markers';
import { POLITY_LAYERS, addReligionLayers, polityFeatures, updateReligionLayers } from './map/religionLayer';
import { Cards } from './ui/cards';
import { buildLegend } from './ui/legend';
import { Timeline } from './ui/timeline';
import { applyUiPalette, traditionColors } from './theme/palette';

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
    const startYear = Number(params.get('year')) || frame.start;
    const state = new YearState(frame, frame.start);
    state.set(startYear);

    const cards = new Cards(atlas, () => state.year, (y) => state.set(y));
    const timeline = new Timeline(atlas, state, (id) => cards.openEvent(id, false));
    stage.append(buildLegend(atlas), cards.el);
    document.getElementById('controls')!.append(timeline.el);
    const legend = document.getElementById('legend')!;
    const wide = window.matchMedia('(min-width: 900px)').matches;
    // Wide screens open with the legend showing.
    if (wide) legend.setAttribute('open', '');
    await nextTask();

    const bounds = shownBounds(frame, atlas.places, geo);
    const map = createMap(container, geo, bounds);
    // Keep the first view clear of an open legend.
    if (wide) map.fitBounds(bounds, { padding: { top: 16, bottom: 16, right: 16, left: legend.offsetWidth + 28 }, animate: false });

    map.once('load', async () => {
      addReligionLayers(map, 'rivers');
      updateReligionLayers(map, polityFeatures(data, geo, state.year));
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

      const markers = new MarkerLayer(map, atlas, { openPlace: (id) => cards.openPlace(id), openEvent: (id) => cards.openEvent(id) });
      markers.update(state.year);
      state.on((y) => {
        updateReligionLayers(map, polityFeatures(data, geo, y));
        markers.update(y);
        cards.refresh();
      });
      // Town and point names crowd each other at continent scale; they show on hover and focus there, and always
      // when closer.
      const zoomClass = () => container.classList.toggle('map--far', map.getZoom() < 5);
      map.on('zoom', zoomClass);
      zoomClass();
      const clickable = [POLITY_LAYERS.fill, POLITY_LAYERS.ring];
      map.on('click', (e) => {
        const hit = map.queryRenderedFeatures(e.point, { layers: clickable })[0];
        if (hit) cards.openPlace(String(hit.properties.place_id));
      });
      for (const id of clickable) {
        map.on('mouseenter', id, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', id, () => { map.getCanvas().style.cursor = ''; });
      }
      done('markers');
    });
    // Exposed for automated browser tests only.
    Object.assign(window as unknown as Record<string, unknown>, {
      __atlasMap: map,
      __atlas: { map, atlas, state, cards, timeline, colors: traditionColors, setYear: (y: number) => state.set(y) },
    });
  } catch (err) {
    console.error(err);
    status.textContent = 'The map could not load. Try reloading the page.';
  }
}

void start();
