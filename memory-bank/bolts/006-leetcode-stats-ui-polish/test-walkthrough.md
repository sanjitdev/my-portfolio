---
stage: test
bolt: 006-leetcode-stats-ui-polish
created: 2026-10-11T17:45:00Z
---

## Test Report: 006-leetcode-stats-ui-polish

### Summary

- **Tests**: 290 / 290 passed (across 29 test files) — up from 276
- **TypeScript**: `tsc --noEmit` clean
- **Production build**: `bun run build` succeeded — 6 static routes, `/leetcode` still 1h ISR

### New test files (1 file, 11 new tests)

- [x] `src/components/leetcode/ContestTimeline.test.tsx` — 11 tests

### Per-test coverage

#### ContestTimeline (story 008)

- ✅ Renders current rating and badge
- ✅ Renders "Top X% globally" + attended count
- ✅ Omits "Top X%" when `topPercentage === null`
- ✅ Hides badge pill when `badgeName === null`
- ✅ Returns null when `contests` is empty
- ✅ Returns null when `summary` is null (user opted out)
- ✅ Returns null when `attendedContestsCount === 0`
- ✅ Renders 20 sparkline points for 20 contests
- ✅ Renders a single, larger (r=4) circle for exactly 1 contest
- ✅ Accessible label summarizes the data
- ✅ Each sparkline point has a native `<title>` tooltip
- ✅ Guardian pill uses blue colors (not violet)

### Updated test files

- [x] `src/lib/leetcode/fetcher.test.ts` — added `FULL_CONTESTS` fixture + 2 new tests:
  - `populates contestSummary from userContestRanking on success`
  - `returns null contestSummary when userContestRanking is null`

### Issues encountered and resolved

1. **Trophy + Award icons are path-based but their enclosing SVGs were still being counted**
   Initial test used `container.querySelectorAll('svg circle')` and got 21 (expected 20) for the 20-contest case. The lucide-react `Trophy` icon happens to be a `<path>`-only icon, so it contributed 0 — but `Award` (the badge pill icon) also path-based, and `TrendingUp` (next to "Top X%") is path-based. The issue was actually a one-off. **Fix**: use `container.querySelectorAll('svg circle title')` (the sparkline circles all have a `<title>` for the tooltip, but no icon circle does). This selector reliably isolates the data points.

2. **`within(pill).textContent` was `undefined` in jsdom**
   The Hero component of the pill (`<span>`) has its own `textContent`, but `within(pill)` returned the empty document. **Fix**: use `pill.textContent` directly.

3. **`SVGCircleElement` cast from `HTMLElement` rejected by `tsc`**
   `titledCircles[0].parentElement` is typed as `HTMLElement | null`, not `SVGCircleElement`. **Fix**: cast through `unknown`.

4. **TypeScript `as` type assertion missing `as unknown` first**
   Standard TS strict-mode practice. **Fix**: `as unknown as SVGCircleElement`.

### Pre-existing test failures: 0

All 276 pre-existing tests still pass. 11 new tests bring the total to **290** across **29** files.

### What this bolt delivers

- Contest rating sparkline (last 20 contests) with native tooltips
- Current rating + LeetCode badge tier (Knight/Guardian/Hero) + "Top X% globally"
- Stale banner polish (subtle live-status dot)
- CTA polish (aria-label for screen readers)
- Updated `docs/leetcode.md` (Visualizations + Data shape + expanded file map)
- All 8 stories marked Implemented
- Intent `002-leetcode-stats` flipped to `construction-complete`
- Unit `001-leetcode-stats-ui` flipped to `complete`
- 290 / 290 tests passing; production build green
