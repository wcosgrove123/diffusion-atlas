// Serve dist/ the way GitHub Pages does: under BASE_PATH, gzip for text files, index.html for directories.
// The browser tests and the Lighthouse check run against this, so transfer sizes match the live site.
// Usage: node scripts/serve.mjs [port]   (env BASE_PATH, default "/")
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGzip } from 'node:zlib';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const port = Number(process.argv[2] || 4317);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.txt': 'text/plain', '.png': 'image/png', '.svg': 'image/svg+xml',
};
const GZIP = new Set(['.html', '.js', '.mjs', '.css', '.json', '.txt', '.svg']);

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (!url.pathname.startsWith(base)) {
    res.writeHead(404).end('not found');
    return;
  }
  let file = normalize(join(dist, decodeURIComponent(url.pathname.slice(base.length))));
  if (!file.startsWith(dist)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(404).end('not found');
    return;
  }
  const ext = extname(file);
  const headers = { 'Content-Type': TYPES[ext] ?? 'application/octet-stream', 'Cache-Control': 'max-age=600' };
  if (GZIP.has(ext) && /\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''))) {
    res.writeHead(200, { ...headers, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' });
    createReadStream(file).pipe(createGzip()).pipe(res);
  } else {
    res.writeHead(200, headers);
    createReadStream(file).pipe(res);
  }
}).listen(port, '127.0.0.1', () => console.log(`serving ${dist} at http://127.0.0.1:${port}${base}`));
