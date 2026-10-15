// The time slider (docs/product-spec.md 5): year steps across the module frame, keyframe ticks, previous and
// next keyframe, play. Keys: arrows step a year, Shift+arrows step keyframes, Space plays or pauses.
import type { Atlas, YearState } from '../atlas';
import { nextKeyframe, prevKeyframe } from '../data/profiles';
import { h } from './dom';

export const PLAY_YEARS_PER_SECOND = 5;
export const KEYFRAME_PAUSE_MS = 3000;

export class Timeline {
  readonly el: HTMLElement;
  private range: HTMLInputElement;
  private yearOut: HTMLElement;
  private playBtn: HTMLButtonElement;
  private timer: number | null = null;

  constructor(private atlas: Atlas, private state: YearState, private onKeyframe: (eventId: string) => void) {
    const { start, end } = atlas.frame;
    this.range = h('input', {
      type: 'range', min: start, max: end, step: 1, value: state.year, class: 'timeline__range',
      'aria-label': 'Year', 'aria-valuetext': String(state.year),
    });
    this.range.addEventListener('input', () => this.state.set(Number(this.range.value)));
    this.range.addEventListener('keydown', (e) => {
      if (e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        this.stepKeyframe(e.key === 'ArrowRight' ? 1 : -1);
      }
    });
    this.yearOut = h('output', { class: 'timeline__year', 'aria-live': 'polite', id: 'year' }, String(state.year));
    this.playBtn = h('button', { type: 'button', class: 'btn timeline__play', 'aria-pressed': 'false', onclick: () => this.togglePlay() }, 'Play');
    const ticks = h('div', { class: 'timeline__ticks', 'aria-hidden': 'true' }, atlas.keyframes.map((k) =>
      h('span', { class: 'timeline__tick', style: `left:${((k.year - start) / (end - start)) * 100}%`, title: `${k.year}: ${k.title}` })));
    this.el = h('div', { class: 'timeline', role: 'group', 'aria-label': 'Time' },
      this.yearOut,
      h('div', { class: 'timeline__buttons' },
        h('button', { type: 'button', class: 'btn', id: 'prev-keyframe', 'aria-label': 'Previous keyframe', onclick: () => this.stepKeyframe(-1) }, 'Prev'),
        this.playBtn,
        h('button', { type: 'button', class: 'btn', id: 'next-keyframe', 'aria-label': 'Next keyframe', onclick: () => this.stepKeyframe(1) }, 'Next')),
      h('div', { class: 'timeline__track' }, this.range, ticks),
      h('p', { class: 'timeline__ends', 'aria-hidden': 'true' }, h('span', {}, String(start)), h('span', {}, String(end))));
    state.on((y) => this.show(y));

    // Arrows step a year and Space plays, unless a control that uses those keys has focus.
    document.addEventListener('keydown', (e) => {
      const t = e.target as HTMLElement;
      if (t === this.range || t.closest('input, select, textarea, [contenteditable], .maplibregl-canvas, .card')) return;
      if (e.key === ' ' && !t.closest('button, summary, a')) {
        e.preventDefault();
        this.togglePlay();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        if (e.shiftKey) this.stepKeyframe(dir);
        else this.state.set(this.state.year + dir);
      }
    });
  }

  private show(y: number): void {
    this.range.value = String(y);
    this.range.setAttribute('aria-valuetext', String(y));
    this.yearOut.textContent = String(y);
  }

  stepKeyframe(dir: 1 | -1): void {
    this.stop();
    const k = dir > 0 ? nextKeyframe(this.atlas.keyframes, this.state.year) : prevKeyframe(this.atlas.keyframes, this.state.year);
    if (!k) return;
    this.state.set(k.year);
    this.onKeyframe(k.id);
  }

  togglePlay(): void {
    if (this.timer !== null) this.stop();
    else this.play();
  }

  private play(): void {
    if (this.state.year >= this.atlas.frame.end) this.state.set(this.atlas.frame.start);
    this.playBtn.textContent = 'Pause';
    this.playBtn.setAttribute('aria-pressed', 'true');
    const tick = () => {
      const y = this.state.year + 1;
      if (y > this.atlas.frame.end) return this.stop();
      this.state.set(y);
      const k = this.atlas.keyframes.find((e) => e.year === y);
      if (k) this.onKeyframe(k.id);
      this.timer = window.setTimeout(tick, k ? KEYFRAME_PAUSE_MS : 1000 / PLAY_YEARS_PER_SECOND);
    };
    this.timer = window.setTimeout(tick, 1000 / PLAY_YEARS_PER_SECOND);
  }

  stop(): void {
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = null;
    this.playBtn.textContent = 'Play';
    this.playBtn.setAttribute('aria-pressed', 'false');
  }
}
