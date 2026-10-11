---
stage: implement
bolt: 005-leetcode-stats-ui-visualizations
created: 2026-10-11T17:15:00Z
---

## Implementation Walkthrough: 005-leetcode-stats-ui-visualizations

### Files created

| Path | Purpose |
| ---- | ------- |
| `src/components/leetcode/useCountUp.ts` | Client hook: rAF count-up, 900ms ease-out cubic, `prefers-reduced-motion` aware |
| `src/components/leetcode/KpiCards.tsx` | Client component: 4 KPI tiles, count-up animation, "—" fallback for missing ranking |
| `src/components/leetcode/KpiCards.test.tsx` | 7 tests |
| `src/components/leetcode/DifficultyChart.tsx` | Server: SVG donut + legend, 3 segments, total in center |
| `src/components/leetcode/DifficultyChart.test.tsx` | 5 tests |
| `src/components/leetcode/TopicChart.tsx` | Server: top-8 horizontal bars (pure CSS) |
| `src/components/leetcode/TopicChart.test.tsx` | 6 tests |
| `src/components/leetcode/ActivityHeatmap.tsx` | Server: 90-day SVG heatmap, 5-bucket scale, month + weekday labels |
| `src/components/leetcode/ActivityHeatmap.test.tsx` | 6 tests |

### Files modified

- `src/app/leetcode/page.tsx` — replaced `<StatsPlaceholder data={data} />` with the four new components, dropped the now-outdated "charts arrive in the next bolt" copy.
- `memory-bank/bolts/005-.../bolt.md` — stage transitions

### Files deleted

- `src/components/leetcode/StatsPlaceholder.tsx` — superseded by the four visualizations

### Key design decisions

#### Pure custom SVG/CSS, no chart library

After reviewing the four visualizations, all are simple geometric shapes. A hand-rolled approach keeps the bundle slim (no Recharts / Visx), matches the project's minimalist dependency surface (same rationale as Bolt 004's direct-GraphQL choice), and gives full control over the design system.

#### Client/server component boundaries

- `KpiCards` is a **client** component (`'use client'`) because it uses the `useCountUp` hook. The page is still a server component — the client boundary is at the visualization layer.
- The other three visualizations (`DifficultyChart`, `TopicChart`, `ActivityHeatmap`) are **server** components — they only emit static SVG / HTML and have no client-side state.

#### Count-up animation

The hook's initial state is `target`, so SSR HTML contains the final value (no hydration mismatch). On mount, it resets to 0 and animates up via `requestAnimationFrame` with an ease-out cubic curve. When `prefers-reduced-motion: reduce` is set, the animation is skipped entirely.

#### Heatmap alignment

13 columns × 7 rows, with the **last** day in the bottom-right corner of its column. The first column may have leading blanks to align with Monday. The `lastColDay` math:

```ts
const lastDow = lastDate.getUTCDay(); // Sun=0..Sat=6
const lastColDay = (lastDow + 6) % 7; // Mon=0..Sun=6
```

Month labels are placed under the first column where a new month begins.

#### Color buckets

5 buckets, single-hue emerald ramp:
- 0 → `fill-slate-100` / `dark:fill-slate-800`
- 1–2 → `fill-emerald-200` / `dark:fill-emerald-900`
- 3–5 → `fill-emerald-400` / `dark:fill-emerald-700`
- 6–9 → `fill-emerald-500` / `dark:fill-emerald-500`
- 10+ → `fill-emerald-700` / `dark:fill-emerald-300`

Dark mode uses a *lighter* (not darker) ramp — necessary because the cells sit on a dark background.

#### Topic chart scale

Bar fill width = `(count / max) * 100%`, where `max` is the **first item's** count (the sorted-descending top). The top bar is always 100% width. Track background is `bg-slate-100` / `dark:bg-slate-800` for the empty portion.

#### Difficulty donut

SVG with `viewBox="0 0 100 100"`, radius 38, stroke 14. Each segment is a `<circle>` with `stroke-dasharray` = `<arc> <C-arc>`, where `C = 2πr ≈ 238.76`. The first segment starts at 12 o'clock via `transform="rotate(-90 50 50)"`. Subsequent segments offset by the cumulative prior arc length.

### Verification

```bash
bun run test       # 276/276 pass
bunx tsc --noEmit  # clean
bun run build      # 6 static routes, /leetcode 1h ISR
```

### Bundle impact

Zero — no new dependencies added to `package.json`.
