// Time-sliced work. Startup builds a few hundred DOM markers and glyphs; done in one go that is a long task that
// blocks input on a slow Chromebook. These helpers run a list of jobs a few milliseconds at a time, yielding to the
// browser between slices, so every task stays short and the page stays responsive.

/** Milliseconds of work per slice. About 8 ms here is about 32 ms on a phone four times slower. */
const BUDGET_MS = 8;

const yieldToBrowser = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/**
 * Run `fn` for every item, in slices. Resolves when all are done. If `token.cancelled` becomes true (a newer run
 * started), stops early and resolves false.
 */
export async function chunked<T>(items: Iterable<T>, fn: (item: T) => void, token: { cancelled: boolean } = { cancelled: false }): Promise<boolean> {
  let t0 = performance.now();
  for (const item of items) {
    if (token.cancelled) return false;
    fn(item);
    if (performance.now() - t0 > BUDGET_MS) {
      await yieldToBrowser();
      t0 = performance.now();
    }
  }
  return true;
}

/** A handle that cancels the previous run each time a new one starts. */
export class RunToken {
  private current = { cancelled: false };

  next(): { cancelled: boolean } {
    this.current.cancelled = true;
    this.current = { cancelled: false };
    return this.current;
  }
}
