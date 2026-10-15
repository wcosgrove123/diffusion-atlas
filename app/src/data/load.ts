import type { ModuleGeo, ModuleIndex } from './types';

/** Resolve a data file under the site's base path (GitHub Pages serves the site at /<repo>/). */
export function dataUrl(file: string, base: string = import.meta.env.BASE_URL): string {
  return `${base.replace(/\/?$/, '/')}data/${file}`;
}

async function fetchJson<T>(file: string): Promise<T> {
  const res = await fetch(dataUrl(file));
  if (!res.ok) throw new Error(`Could not load ${file} (${res.status})`);
  return (await res.json()) as T;
}

export const loadModuleIndex = () => fetchJson<ModuleIndex>('modules.json');
export const loadModuleGeo = (id: string) => fetchJson<ModuleGeo>(`${id}-geo.json`);
