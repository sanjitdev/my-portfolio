---
id: 004-leetcode-stats-ui-foundation
unit: 001-leetcode-stats-ui
intent: 002-leetcode-stats
type: simple-construction-bolt
status: complete
stories:
  - 001-leetcode-data
  - 002-leetcode-route-and-nav
  - 003-leetcode-home-callout
created: 2026-10-11T15:55:00Z
started: 2026-10-11T16:05:00Z
completed: 2026-10-11T16:45:00Z
current_stage: null
stages_completed:
  - name: plan
    completed: 2026-10-11T16:10:00Z
    artifact: implementation-plan.md
  - name: implement
    completed: 2026-10-11T16:25:00Z
    artifact: implementation-walkthrough.md
  - name: test
    completed: 2026-10-11T16:40:00Z
    artifact: test-walkthrough.md
requires_bolts: []
enables_bolts:
  - 005-leetcode-stats-ui-visualizations
  - 006-leetcode-stats-ui-polish
requires_units:
  - 001-portfolio-ui
blocks: false
complexity:
  avg_complexity: 2
  avg_uncertainty: 3
  max_dependencies: 2
  testing_scope: 2
---

# Bolt: 004-leetcode-stats-ui-foundation

## Overview

First bolt for the LeetCode stats feature. Establishes the server-side data layer (types, fetcher, normalization, env config, stale-state fallback), the `/leetcode` route in the Next.js App Router, the main nav entry, and the home-page callout card. After this bolt, the page is reachable, navigable, and renders the data layer's typed payload — even if the visualizations are still minimal placeholders.

## Objective

Prove the end-to-end pipeline: env var → server-side fetch → typed payload → ISR-cached render → nav link → home callout. The LeetCode data source library choice is the biggest decision in this bolt — the fetcher must abstract it so the choice can be swapped without touching the page.

## Stories Included

- **001-leetcode-data**: Data layer — types, server-side fetcher, env config, normalization, stale-data handling (Must)
- **002-leetcode-route-and-nav**: `/leetcode` route + main nav entry (Must)
- **003-leetcode-home-callout**: Home-page callout card linking to `/leetcode` (Must)

## Bolt Type

**Type**: Simple Construction Bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. plan**: Pending → `implementation-plan.md`
- [ ] **2. implement**: Pending → `src/lib/leetcode/`, `src/app/leetcode/`, `src/components/home/leetcode-callout.tsx`, nav update
- [ ] **3. test-verify**: Pending → `test-report.md`

## Dependencies

### Requires

- `001-portfolio-ui` (the existing portfolio must exist — reuses layout, design system, nav)
- None of the prior LeetCode bolts exist (this is the first)

### Enables

- `005-leetcode-stats-ui-visualizations` (the charts need the data layer + route to exist)
- `006-leetcode-stats-ui-polish` (contest timeline and final polish)

## Expected Outputs

- `src/lib/leetcode/types.ts`
- `src/lib/leetcode/schemas.ts` (Zod)
- `src/lib/leetcode/normalize.ts`
- `src/lib/leetcode/fetcher.ts`
- `src/lib/leetcode/fetcher.test.ts`
- `src/app/leetcode/page.tsx`
- `src/app/leetcode/loading.tsx`
- `src/components/home/leetcode-callout.tsx`
- Updated `src/components/nav/` (new entry for `/leetcode`)
- `.env.example` updated with `LEETCODE_USERNAME`

## Success Criteria

- [ ] `getLeetCodePageData()` returns a fully typed `LeetCodeFetchResult`
- [ ] `/leetcode` is reachable and renders successfully on Vercel preview
- [ ] Main nav contains a "LeetCode" entry pointing to `/leetcode` with active-state support
- [ ] Home page has a visible callout card linking to `/leetcode`
- [ ] When the LeetCode data source fails, the page renders with `isStale: true` and a "data may be stale" indicator — never a 5xx
- [ ] `LEETCODE_USERNAME` is configurable via env var; default is `sanjit12`
- [ ] No `LEETCODE_USERNAME` value appears in any client-side bundle
- [ ] Vitest unit tests pass for the data layer normalization and stale-state fallback
- [ ] TypeScript strict-mode checks pass
- [ ] ESLint passes

## Notes

- **Decision required during this bolt**: which LeetCode data source library to use. Recommended order of preference: (1) `alfa-leetcode-api`, (2) `leetcode-query`, (3) direct GraphQL against `https://leetcode.com/graphql`. The fetcher's interface is fixed; only the implementation behind it changes.
- The home-page callout should not duplicate the content of `/leetcode`; it is a teaser with a single number and a link.
- The page must use `export const revalidate = 3600` for ISR.
- The fetcher should fall back to a **last-known-good** payload kept in a module-level variable (per server instance), so that an outage of the data source does not break the page during the 1-hour ISR window.