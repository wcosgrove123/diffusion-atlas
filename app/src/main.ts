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
    const atlas = buildAtlas(data, geo, tax);
    const startYear = Number(params.get('year')) || frame.start;
    const state = new YearState(frame, frame.start);
    state.set(startYear);

    const bounds = shownBounds(frame, atlas.places, geo);
    const map = createMap(container, geo, bounds);
    const cards = new Cards(atlas, () => state.year, (y) => state.set(y));
    const timeline = new Timeline(atlas, state, (id) => cards.openEvent(id, false));
    stage.append(buildLegend(atlas), cards.el);
    document.getElementById('controls')!.append(timeline.el);
    const legend = document.getElementById('legend')!;
    if (window.matchMedia('(min-width: 900px)').matches) {
      // Wide screens open with the legend showing; keep the first view clear of it.
      legend.setAttribute('open', '');
      map.fitBounds(bounds, { padding: { top: 16, bottom: 16, right: 16, left: legend.offsetWidth + 28 }, animate: false });
    }

    map.once('load', () => {
      addReligionLayers(map, 'rivers');
      const markers = new MarkerLayer(map, atlas, { openPlace: (id) => cards.openPlace(id), openEvent: (id) => cards.openEvent(id) });
      const draw = (y: number) => {
        updateReligionLayers(map, polityFeatures(data, geo, y));
        markers.update(y);
        cards.refresh();
      };
      state.on(draw);
      draw(state.year);
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
      map.once('idle', () => {
        performance.mark('atlas:map-ready');
        container.dataset.ready = 'true';
        status.textContent = '';
      });
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
