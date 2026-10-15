import './styles.css';
import { frameLabel, pickModule } from './data/frame';
import { loadModuleGeo, loadModuleIndex } from './data/load';
import { createMap } from './map/createMap';
import { applyUiPalette } from './theme/palette';

async function start(): Promise<void> {
  applyUiPalette(document.documentElement);
  const status = document.getElementById('map-status')!;
  const title = document.getElementById('module-title')!;
  const container = document.getElementById('map')!;
  status.textContent = 'Loading the map';
  try {
    const index = await loadModuleIndex();
    const frame = pickModule(index.modules, new URLSearchParams(location.search).get('module'));
    title.textContent = frameLabel(frame);
    document.title = `Diffusion Atlas: ${frameLabel(frame)}`;
    const geo = await loadModuleGeo(frame.id);
    const map = createMap(container, geo);
    map.once('load', () => {
      performance.mark('atlas:map-ready');
      container.dataset.ready = 'true';
      status.textContent = '';
    });
    // Exposed for automated browser tests only.
    (window as unknown as { __atlasMap?: unknown }).__atlasMap = map;
  } catch (err) {
    console.error(err);
    status.textContent = 'The map could not load. Try reloading the page.';
  }
}

void start();
