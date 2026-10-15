// Copy what the static site serves as plain files into app/public/ (gitignored):
//   data/build/*.json            -> public/data/      (built by the Python pipeline; the app reads only these)
//   MapLibre worker + shared chunk -> public/vendor/maplibre/ (MapLibre loads its worker by URL; self-hosted)
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const build = resolve(app, '../data/build');
const pub = join(app, 'public');

if (!existsSync(join(build, 'modules.json'))) {
  console.error('data/build/modules.json is missing. From the repo root run:\n' +
    '  python3 tools/build_data.py africa && python3 tools/export_taxonomy.py && python3 tools/build_geometry.py africa');
  process.exit(1);
}

rmSync(join(pub, 'data'), { recursive: true, force: true });
mkdirSync(join(pub, 'data'), { recursive: true });
const json = readdirSync(build).filter((f) => f.endsWith('.json'));
for (const f of json) copyFileSync(join(build, f), join(pub, 'data', f));

const mlDist = join(app, 'node_modules/maplibre-gl/dist');
const vendor = join(pub, 'vendor/maplibre');
mkdirSync(vendor, { recursive: true });
for (const f of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) copyFileSync(join(mlDist, f), join(vendor, f));
copyFileSync(join(app, 'node_modules/maplibre-gl/LICENSE.txt'), join(vendor, 'LICENSE.txt'));

console.log(`synced ${json.length} data files and the MapLibre worker into app/public/`);
