---
stage: implement
bolt: 006-leetcode-stats-ui-polish
created: 2026-10-11T17:25:00Z
---

# Implementation Plan: Bolt 006 — LeetCode Stats Polish

## Decision: data-layer extension is the linchpin

The contest timeline (story 008) needs aggregate fields the current fetcher
discards: `attendedContestsCount`, `globalRanking`, `topPercentage`,
`contestBadge.name`. The fix is a new sibling type `LeetCodeContestSummary`
on `LeetCodeFetchResult`. No new GraphQL query — `CONTEST_QUERY` already
returns `userContestRanking` with all the data we need.

## Files to create

```
src/components/leetcode/
  ContestTimeline.tsx
  ContestTimeline.test.tsx
```

## Files to modify

- `src/lib/leetcode/types.ts` — add `LeetCodeContestSummarySchema`, extend `LeetCodeFetchResultSchema`
- `src/lib/leetcode/fetcher.ts` — populate `contestSummary` from `userContestRanking`
- `src/lib/leetcode/fetcher.test.ts` — extend contest fixtures + 1 new assertion
- `src/components/leetcode/StaleDataBanner.tsx` — minor polish (subtle status dot)
- `src/components/leetcode/LeetCodeCta.tsx` — add `aria-label` for screen readers
- `src/app/leetcode/page.tsx` — mount `<ContestTimeline />`
- `docs/leetcode.md` — visualizations section + file map

## Key design details

### `LeetCodeContestSummary` (new in `types.ts`)

```ts
export const LeetCodeContestSummarySchema = z.object({
  currentRating: z.number().int(),
  globalRanking: z.number().int().positive(),
  topPercentage: z.number().min(0).max(100).nullable(),
  attendedContestsCount: z.number().int().nonnegative(),
  badgeName: z.string().nullable(), // 'Knight' | 'Guardian' | 'Hero' | null
});
```

The fetcher's `getLeetCodePageData()` returns:

```ts
contestSummary: data.userContestRanking
  ? {
      currentRating: data.userContestRanking.rating,
      globalRanking: data.userContestRanking.globalRanking,
      topPercentage: data.userContestRanking.topPercentage > 0
        ? data.userContestRanking.topPercentage
        : null,
      attendedContestsCount: data.userContestRanking.attendedContestsCount,
      badgeName: data.userContestRanking.contestBadge?.name ?? null,
    }
  : null,
```

### `ContestTimeline` component

Layout (single `<section>`):

```
[Contest rating eyebrow]                    [Knight pill]   (if badgeName)
[Big rating number]      [Sparkline SVG]    [Top 4.2% globally]   (if topPercentage)
                                              Attended 32 contests
```

- Returns `null` if `contests.length === 0` OR `summary === null` OR `summary.attendedContestsCount === 0`
- Sparkline: viewBox 600×80, line + filled area + one `<circle>` per data point with `<title>` tooltip
- Rating range auto-computed: `min(ratings) - 50 .. max(ratings) + 50` to fill the height
- 1 contest → single dot at center
- 2 contests → single straight line
- All contests use `accent-500` for the line color (consistent with topic chart)

### Stale banner polish

Add a small live-status dot (pulsing if user hasn't opted out of animations).
The dot is in the same amber color family as the rest of the banner. The
pulse animation is `availability-pulse` (already exists in `globals.css`).

### CTA polish

Just add `aria-label="View full profile on LeetCode (opens in new tab)"` —
the visible text is fine.

## Test plan

- New `ContestTimeline.test.tsx`:
  1. Renders current rating + badge pill
  2. Renders "Top X% globally" line
  3. Returns null when contests is empty
  4. Returns null when summary is null
  5. Sparkline has the right number of points
  6. Accessible `aria-label`
- Update `fetcher.test.ts`:
  - Extend `EMPTY_CONTESTS` to match new `userContestRanking` shape
  - Add 1 new test: `contestSummary is populated from userContestRanking on success`
- All 276 existing tests must continue to pass

## Verification

```bash
bun run test       # all tests pass
bunx tsc --noEmit  # TypeScript clean
bun run build      # /leetcode still static + 1h ISR
```
