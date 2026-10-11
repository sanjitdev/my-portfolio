---
stage: implement
bolt: 005-leetcode-stats-ui-visualizations
created: 2026-10-11T17:00:00Z
---

# Implementation Plan: Bolt 005 — LeetCode Stats Visualizations

## Decision: pure custom SVG/CSS, no chart library

After reviewing the four visualizations, all are simple geometric shapes:

- **Donut**: 3 SVG `<circle>` strokes with `stroke-dasharray` (~30 lines of JSX)
- **Horizontal bars**: 8 `<div>` rows with `width: %` (~40 lines of JSX)
- **Heatmap**: 90 SVG `<rect>` elements in a 13×7 grid (~80 lines of JSX)
- **KPI cards**: pure HTML grid, no chart needed

Adding Recharts (~50KB+ gz) or Visx (modular but heavy) to render these would
inflate the client bundle for no visual gain. A hand-rolled approach matches
the project's minimalist dependency surface (Bolt 004 already declined
`alfa-leetcode-api` / `leetcode-query` wrappers for the same reason) and gives
full control over the design system.

## Component architecture

All four components are **server components** by default — they only need to
read from the `LeetCodeFetchResult` payload and emit static HTML. The one
client-only piece is the count-up animation on KPI tiles, which lives in a
small `useCountUp` hook (marked `'use client'`).

### `useCountUp` hook

```ts
'use client';
import { useEffect, useState } from 'react';

export function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(target); // SSR returns final value
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}
```

The initial state is `target` (so SSR HTML contains the final value — no
hydration mismatch). On mount, the effect resets to 0 and animates up.

## Difficulty chart — SVG donut math

`viewBox="0 0 100 100"`, radius `r = 38`, stroke-width `14`, circumference `C = 2πr ≈ 238.76`.

For each segment, `<circle>` is rotated so its 0° starts at 12 o'clock:
`transform="rotate(-90 50 50)"`. Each segment's `stroke-dasharray` is
`"<arc> <C-arc>"` and `stroke-dashoffset` is the cumulative offset of prior
segments.

## Heatmap — 90 days in a 13×7 grid

- 13 columns × 7 rows = 91 cells (the fetcher returns 90, so we leave one
  empty cell at the end for layout cleanliness, or align to start-of-week).
- We align so the **last day** lands on its correct weekday in the rightmost
  column. The first cell of the first column may be empty (pre-90-day).
- Cell: 12×12, gap 2 → total ~180×100. We add a `<text>` label below the
  first week of each new month.
- Bucket function: `bucketFor(count) → 0|1|2|3|4`.

## Test strategy

- 4 new component tests (~5 tests each = ~20 new tests)
- All existing 250 tests must continue to pass
- Total expected: ~270 tests
