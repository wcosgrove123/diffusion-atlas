// Tiny DOM helpers. Text always goes in as text nodes, never as HTML, so data text renders exactly as built.
type Attrs = Record<string, string | number | boolean | null | undefined | EventListener>;
type Child = Node | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K, attrs: Attrs = {}, ...children: (Child | Child[])[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (typeof v === 'function') el.addEventListener(k.replace(/^on/, ''), v);
    else if (k === 'class') el.className = String(v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    el.append(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return el;
}

/** Display form of a taxonomy key: "sunni-maliki" -> "Sunni maliki". The key itself is never changed. */
export function keyLabel(key: string): string {
  const s = key.replace(/-/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Years for display: "1352", "about 1350" (no en or em dashes in student text). */
export function yearText(y: number, approx?: boolean): string {
  return approx ? `about ${y}` : String(y);
}

export function spanText(start: number, end: number | null | undefined, approx?: boolean): string {
  return `${approx ? 'about ' : ''}${start} to ${end ?? 'later'}`;
}
