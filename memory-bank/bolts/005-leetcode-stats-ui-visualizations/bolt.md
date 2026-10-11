---
id: 005-leetcode-stats-ui-visualizations
unit: 001-leetcode-stats-ui
intent: 002-leetcode-stats
type: simple-construction-bolt
status: in-progress
stories:
  - 004-kpi-cards
  - 005-difficulty-chart
  - 006-topic-chart
  - 007-activity-heatmap
created: 2026-10-11T15:55:00Z
started: 2026-10-11T17:00:00Z
completed: null
current_stage: test
stages_completed:
  - name: plan
    completed: 2026-10-11T17:00:00Z
    artifact: implementation-plan.md
  - name: implement
    completed: 2026-10-11T17:15:00Z
    artifact: implementation-walkthrough.md
  - name: test
    completed: 2026-10-11T17:20:00Z
    artifact: test-walkthrough.md
requires_bolts:
  - 004-leetcode-stats-ui-foundation
enables_bolts:
  - 006-leetcode-stats-ui-polish
requires_units:
  - 001-portfolio-ui
blocks: false
complexity:
  avg_complexity: 2
  avg_uncertainty: 2
  max_dependencies: 2
  testing_scope: 2
---

# Bolt: 005-leetcode-stats-ui-visualizations

## Overview

Second bolt for the LeetCode stats feature. Builds the visual heart of the page: the four headline KPI tiles, the difficulty distribution chart, the topic/tag distribution chart, and the 90-day activity heatmap. After this bolt, the page is **visually complete** (minus the contest timeline and final polish).

## Objective

Render the four most-recruiter-impactful visualizations on top of the data layer established in Bolt 4, using a single charts library for consistency (likely Recharts). All charts must respect light/dark themes and `prefers-reduced-motion`.

## Stories Included

- **004-kpi-cards**: Four headline KPI tiles — Total Solved, Acceptance Rate, Global Ranking, Contribution Points (Must)
- **005-difficulty-chart**: Difficulty distribution chart (donut or stacked bar) with Easy/Medium/Hard counts and percentages (Must)
- **006-topic-chart**: Topic/tag distribution bar chart — top 8 topics by solved count (Must)
- **007-activity-heatmap**: 90-day GitHub-style activity heatmap with 5 intensity buckets (Must)

## Bolt Type

**Type**: Simple Construction Bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. plan**: Pending → `implementation-plan.md`
- [ ] **2. implement**: Pending → `src/components/leetcode/{KpiCards,DifficultyChart,TopicChart,ActivityHeatmap}.tsx`
- [ ] **3. test-verify**: Pending → `test-report.md`

## Dependencies

### Requires

- `004-leetcode-stats-ui-foundation` (data layer + route must exist)

### Enables

- `006-leetcode-stats-ui-polish` (contest timeline + dev doc)

## Expected Outputs

- `src/components/leetcode/KpiCards.tsx`
- `src/components/leetcode/DifficultyChart.tsx`
- `src/components/leetcode/TopicChart.tsx`
- `src/components/leetcode/ActivityHeatmap.tsx`
- Optional per-component tests under `src/components/leetcode/__tests__/`
- Updated `src/app/leetcode/page.tsx` to compose all four visualizations
- (Likely) added `recharts` (or chosen alternative) to `package.json`

## Success Criteria

- [ ] All four KPIs render with the correct numbers and labels
- [ ] Difficulty chart shows Easy/Medium/Hard with counts, percentages, and color-coded segments
- [ ] Topic chart shows the top 8 topics sorted by count descending
- [ ] Activity heatmap renders 90 days with 5 intensity buckets, month labels, and weekday labels
- [ ] All charts and the heatmap render correctly in both light and dark themes
- [ ] All chart animations are disabled under `prefers-reduced-motion`
- [ ] All charts have `aria-label`s summarizing the data for screen readers
- [ ] Topic chart hides gracefully when topic tags are missing from the data
- [ ] All visualizations stack/scroll cleanly on mobile (≤375px)
- [ ] TypeScript strict-mode checks pass
- [ ] ESLint passes

## Notes

- **Decision required during this bolt**: charts library. Recommended: **Recharts** (React-native, lightweight, decent SSR). If Recharts cannot render the heatmap cleanly, fall back to **Visx** for the heatmap only.
- KPI count-up animation: prefer a tiny custom implementation over a heavy library. Respect `prefers-reduced-motion`.
- Heatmap is the highest-risk item in this bolt (custom SVG vs. Visx trade-off). Spike a prototype before committing.
- All four visualizations share the same `LeetCodeFetchResult` data; ensure the components are typed end-to-end.