---
stage: implement
bolt: 006-leetcode-stats-ui-polish
created: 2026-10-11T17:45:00Z
---

## Implementation Walkthrough: Bolt 006 — LeetCode Stats Polish

### Files created

| Path | Purpose |
| ---- | ------- |
| `src/components/leetcode/ContestTimeline.tsx` | Current rating + badge pill + "Top X% globally" + sparkline (last 20 contests) |
| `src/components/leetcode/ContestTimeline.test.tsx` | 11 tests |

### Files modified

- `src/lib/leetcode/types.ts` — added `LeetCodeContestSummarySchema`; extended `LeetCodeFetchResultSchema` with `contestSummary`
- `src/lib/leetcode/fetcher.ts` — `fetchLeetCodeContests` now returns `{ contests, summary }`; `getLeetCodePageData` wires the summary through
- `src/lib/leetcode/fetcher.test.ts` — added `FULL_CONTESTS` fixture + 2 new assertions for `contestSummary` shape
- `src/components/leetcode/StaleDataBanner.tsx` — added pulsing status dot via `availability-dot` keyframe
- `src/components/leetcode/LeetCodeCta.tsx` — added `aria-label="View full profile on LeetCode (opens in a new tab)"`
- `src/app/leetcode/page.tsx` — mounted `<ContestTimeline contests={data.contests} summary={data.contestSummary} />` between the difficulty/topic row and the heatmap
- `docs/leetcode.md` — added "Visualizations" + "Data shape" sections; expanded "What lives where"

### Memory-bank cascade

- `memory-bank/story-index.md` — all 8 stories flipped to ✅ IMPLEMENTED
- `memory-bank/intents/002-leetcode-stats/units/001-leetcode-stats-ui/unit-brief.md` — `status: complete`, `phase: construction`; story table updated
- `memory-bank/intents/002-leetcode-stats/units/001-leetcode-stats-ui/construction-log.md` — bolt 006 closed; execution summary: 3/3 bolts complete
- `memory-bank/intents/002-leetcode-stats/inception-log.md` — `status: complete`, `phase: construction-complete`; construction summary table added
- `memory-bank/intents/002-leetcode-stats/units/001-leetcode-stats-ui/stories/008-contest-timeline.md` — `status: complete`, `implemented: true`
- `memory-bank/bolts/006-.../bolt.md` — `status: complete`, `completed: 2026-10-11T17:45:00Z`

### Key design decisions

#### Data-layer first

The contest timeline story required aggregate fields the fetcher was discarding (`attendedContestsCount`, `globalRanking`, `topPercentage`, `contestBadge.name`). Rather than add a second GraphQL query, I added a new sibling type `LeetCodeContestSummary` on `LeetCodeFetchResult` and refactored `fetchLeetCodeContests` to return `{ contests, summary }` from the existing `CONTEST_QUERY` response. Zero new API calls.

#### Sparkline design

- ViewBox 600×80, single SVG
- `<path>` for the line + `<path>` for the filled area below it (using a `<linearGradient>` that's `currentColor`-driven so light/dark themes work via Tailwind `text-accent-500` / `text-accent-400`)
- One `<circle>` per data point with `<title>` for native tooltip (contest name + date + rating + topPercentage)
- Rating range auto-scales to `min - max(20, 10%) .. max + max(20, 10%)` so the line uses the full height
- 1 contest → single 4px-radius dot at center; 2+ → 2.5px-radius dots
- No animation; the global `prefers-reduced-motion` rule already disables transitions

#### Badge tier styling

Each badge gets its own color ramp — Knight (violet), Guardian (blue), Hero (orange). The pill uses `bg-{color}-100 dark:bg-{color}-950/40` with a subtle `ring-1 ring-{color}-200` border for a more refined look.

#### Stale banner polish

Added a small `availability-dot` indicator (the same keyframe the "Open to opportunities" badge uses) to convey "live-but-degraded" status without making the banner feel like an error.

#### CTA polish

Just an `aria-label` addition so screen readers announce "View full profile on LeetCode (opens in a new tab)" — the visible text is unchanged.

### Verification

```bash
bun run test       # 290/290 pass
bunx tsc --noEmit  # clean
bun run build      # 6 static routes, /leetcode 1h ISR
```

### Bundle impact

Zero new dependencies.