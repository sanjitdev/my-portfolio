---
id: 006-leetcode-stats-ui-polish
unit: 001-leetcode-stats-ui
intent: 002-leetcode-stats
type: simple-construction-bolt
status: complete
stories:
  - 008-contest-timeline
created: 2026-10-11T15:55:00Z
started: 2026-10-11T17:25:00Z
completed: 2026-10-11T17:45:00Z
current_stage: null
stages_completed:
  - name: plan
    completed: 2026-10-11T17:25:00Z
    artifact: implementation-plan.md
  - name: implement
    completed: 2026-10-11T17:45:00Z
    artifact: implementation-walkthrough.md
  - name: test
    completed: 2026-10-11T17:45:00Z
    artifact: test-walkthrough.md
requires_bolts:
  - 004-leetcode-stats-ui-foundation
  - 005-leetcode-stats-ui-visualizations
enables_bolts: []
requires_units:
  - 001-portfolio-ui
blocks: false
complexity:
  avg_complexity: 1
  avg_uncertainty: 1
  max_dependencies: 1
  testing_scope: 2
---

# Bolt: 006-leetcode-stats-ui-polish

## Overview

Third and final bolt for the LeetCode stats feature. Adds the contest rating timeline (current rating + badge + last 20 contests sparkline), refines the stale-data banner, polishes the "View on LeetCode" CTA, and ships developer documentation (`docs/leetcode.md`). After this bolt, the page is **production-ready**.

## Objective

Round out the page with the contest-rating story (Should-have), sharpen the stale-state UX, and document the feature so future maintainers understand the data flow and how to force a revalidation.

## Stories Included

- **008-contest-timeline**: Contest rating sparkline + badge + "Top X%" (Should)

## Additional Polish Tasks (within this bolt)

- **Stale-data banner refinement**: subtle visual treatment for `isStale: true` (not alarming — a known constraint)
- **CTA polish**: ensure "View on LeetCode" uses official LeetCode branding/colors and opens in a new tab with `rel="noopener noreferrer"`
- **Dev doc**: `docs/leetcode.md` covering env var, data source, ISR cadence, and how to force a revalidation
- **Story-index update**: mark all 8 stories `✅ IMPLEMENTED` in `memory-bank/story-index.md`

## Bolt Type

**Type**: Simple Construction Bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. plan**: Pending → `implementation-plan.md`
- [ ] **2. implement**: Pending → `src/components/leetcode/{ContestTimeline,StaleDataBanner,LeetCodeCta}.tsx`, `docs/leetcode.md`, story-index update
- [ ] **3. test-verify**: Pending → `test-report.md`

## Dependencies

### Requires

- `004-leetcode-stats-ui-foundation`
- `005-leetcode-stats-ui-visualizations`

### Enables

- None (this is the final bolt for this intent)

## Expected Outputs

- `src/components/leetcode/ContestTimeline.tsx`
- `src/components/leetcode/StaleDataBanner.tsx`
- `src/components/leetcode/LeetCodeCta.tsx`
- `docs/leetcode.md`
- Updated `memory-bank/story-index.md` (all 8 stories marked `✅ IMPLEMENTED`)
- Updated `memory-bank/intents/002-leetcode-stats/inception-log.md` (status: complete)

## Success Criteria

- [ ] Contest timeline shows current rating, badge name, and sparkline of last 20 contests
- [ ] Contest section hides gracefully when the user has zero contest history
- [ ] Stale-data banner appears only when `isStale: true`, with a subtle (non-alarming) visual treatment
- [ ] "View on LeetCode" CTA links to `https://leetcode.com/sanjit12/`, opens in a new tab with `rel="noopener noreferrer"`
- [ ] `docs/leetcode.md` documents `LEETCODE_USERNAME`, the data source, ISR cadence, and how to force a revalidation
- [ ] Story index is updated: all 8 stories marked `✅ IMPLEMENTED`
- [ ] Inception log is marked complete
- [ ] Lighthouse Performance ≥ 90 on `/leetcode`
- [ ] p95 LCP < 2.5s cold, < 1.0s warm
- [ ] TypeScript strict-mode checks pass
- [ ] ESLint passes
- [ ] Vitest passes
- [ ] Live URL updated at the end: `https://sanjit-dev.vercel.app/leetcode`

## Notes

- The contest section uses the same charts library as `005-difficulty-chart` for consistency.
- LeetCode badge tiers: Knight (2000+), Guardian (2500+), Hero (3000+); below 2400 = no badge text.
- This bolt also serves as the **shipping bolt** — it owns the final story-index update and inception-log completion.