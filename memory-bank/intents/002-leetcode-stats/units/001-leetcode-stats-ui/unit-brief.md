---
unit: 001-leetcode-stats-ui
intent: 002-leetcode-stats
unit_type: frontend
default_bolt_type: simple-construction-bolt
phase: construction
status: complete
created: 2026-10-11T15:45:00Z
updated: 2026-10-11T17:45:00Z
---

# Unit Brief: 001-leetcode-stats-ui

## Purpose

Add a recruiter-facing `/leetcode` page to the existing Next.js portfolio that fetches and visualizes the public LeetCode profile of user `sanjit12`. The page must be scannable in under 5 seconds, render reliably even when the LeetCode data source is degraded, and reuse the existing portfolio's design system, layout, and theme.

## Scope

### In Scope

- Server-side data fetch (ISR, ~1h revalidate) of the `sanjit12` LeetCode profile
- Typed normalization layer (`LeetCodeProfile`, `LeetCodeActivity`, etc.)
- A new `/leetcode` route using the existing site layout
- Main nav entry linking to `/leetcode`
- Home-page callout card linking to `/leetcode`
- KPI cards (Total Solved, Acceptance Rate, Global Ranking, Contribution Points)
- Difficulty distribution chart (donut or stacked bar)
- Topic/tag distribution chart (horizontal bar)
- 90-day activity heatmap
- Contest rating sparkline + badge + "Top X%" rank
- "View on LeetCode" CTA
- Graceful stale-data banner when the API fails
- Light/dark theme parity
- `prefers-reduced-motion` support for chart animations

### Out of Scope

- Admin / "refresh now" button
- Per-topic personal-bests or time-spent stats
- More than 20 contests in the rating timeline
- New charts library additions beyond what the design system needs
- Analytics or telemetry on `/leetcode`

---

## Assigned Requirements

These FRs from the intent are assigned to this unit. Stories are derived from these.

| FR    | Requirement                                              | Priority |
| ----- | -------------------------------------------------------- | -------- |
| FR-1  | Dedicated LeetCode page route (+ nav + home highlight)   | Must     |
| FR-2  | Fetch live LeetCode profile data (server-side, ISR)      | Must     |
| FR-3  | Visual difficulty distribution chart                    | Must     |
| FR-4  | Visual topic/tag distribution                            | Must     |
| FR-5  | Headline KPI cards                                       | Must     |
| FR-6  | Recent activity / streak heatmap (90 days)               | Must     |
| FR-7  | Contest rating / badge timeline                          | Should   |
| FR-8  | Graceful error / stale state                             | Must     |
| FR-9  | Link to live LeetCode profile                            | Should   |

---

## Domain Concepts

### Key Entities (TypeScript types)

| Entity             | Description                                        | Key Attributes                                                                 |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| `LeetCodeProfile`  | Top-level normalized profile                       | `username`, `totalSolved`, `easySolved`, `mediumSolved`, `hardSolved`, `acceptanceRate`, `ranking`, `contributionPoints` |
| `LeetCodeTopicStat`| Solved count per topic tag                          | `tagName`, `tagSlug`, `solvedCount`                                            |
| `LeetCodeActivity` | Per-day submission counts over a recent window     | `date` (ISO), `count` (int) — array of 90 entries                              |
| `LeetCodeContest`  | Single contest rating snapshot                      | `contestName`, `attendedAt`, `rating`, `ranking`, `topPercentage`              |
| `LeetCodeFetchResult` | Wrapper that always renders safely              | `profile`, `activity`, `contests`, `fetchedAt` (ISO), `isStale` (bool), `error?` |

### Key Operations

| Operation            | Description                                            | Inputs                  | Outputs                |
| -------------------- | ------------------------------------------------------ | ----------------------- | ---------------------- |
| `fetchLeetCodeProfile` | Server-side fetch + normalize                       | `username: string`      | `LeetCodeFetchResult`  |
| `getLeetCodePageData`  | Top-level data loader used by the page              | none (reads env var)    | `LeetCodeFetchResult`  |

---

## Story Summary

| Metric        | Count |
| ------------- | ----- |
| Total Stories | 8     |
| Must Have     | 7     |
| Should Have   | 1     |
| Could Have    | 0     |

### Stories

| Story ID  | Title                                | Priority | Status     |
| --------- | ------------------------------------ | -------- | ---------- |
| 001       | LeetCode data layer                  | Must     | ✅ Implemented (Bolt 004) |
| 002       | LeetCode route and nav entry         | Must     | ✅ Implemented (Bolt 004) |
| 003       | Home-page LeetCode callout           | Must     | ✅ Implemented (Bolt 004) |
| 004       | KPI cards                            | Must     | ✅ Implemented (Bolt 005) |
| 005       | Difficulty distribution chart        | Must     | ✅ Implemented (Bolt 005) |
| 006       | Topic distribution chart             | Must     | ✅ Implemented (Bolt 005) |
| 007       | 90-day activity heatmap              | Must     | ✅ Implemented (Bolt 005) |
| 008       | Contest rating timeline + badge      | Should   | ✅ Implemented (Bolt 006) |

---

## Dependencies

### Depends On

| Unit                  | Reason                                                |
| --------------------- | ----------------------------------------------------- |
| `001-portfolio-ui`    | Reuses layout, design system, theme, nav, and build config |

### Depended By

None — this is a leaf feature.

### External Dependencies

| System                          | Purpose                                  | Risk         |
| ------------------------------- | ---------------------------------------- | ------------ |
| LeetCode data source (TBD lib)  | Public profile + activity data           | Medium       |
| Charts library (TBD)            | Visualizations (Recharts most likely)    | Low          |
| Vercel ISR                      | Caching + revalidation                   | Low          |

---

## Technical Context

### Suggested Technology

- **Language**: TypeScript (strict, existing project)
- **Framework**: Next.js 16 App Router with Server Components
- **Styling**: Tailwind CSS v4 (existing) — design tokens from `design-system/`
- **Charts library**: **TBD** — Recharts is the most likely default (lightweight, React-native, good SSR). If Recharts can't render the heatmap cleanly, fall back to Visx for that one component.
- **Data source**: **TBD** — `alfa-leetcode-api` or `leetcode-query` are the leading community wrappers. If neither works at runtime, fall back to the public LeetCode GraphQL endpoint directly.
- **Validation**: Zod (existing) for type safety at the data boundary
- **Testing**: Vitest (existing)

### Integration Points

| Integration              | Type         | Protocol                                  |
| ------------------------ | ------------ | ----------------------------------------- |
| LeetCode data source     | Outbound API | HTTPS / GraphQL (or REST via wrapper)     |
| Existing portfolio layout | Component   | Reuse `<main>`, `<Container>`, etc.       |
| Existing nav              | Component   | Add new entry to the same nav config      |
| Home page                 | Component   | Add a `<LeetCodeCallout />` to home       |

### Data Storage

| Data             | Type    | Volume              | Retention   |
| ---------------- | ------- | ------------------- | ----------- |
| LeetCode profile | JSON    | ~10 KB              | ISR-cached 1h |
| Recent activity  | JSON    | ~3 KB (90 days)     | ISR-cached 1h |
| Contest history  | JSON    | ~2 KB (20 contests) | ISR-cached 1h |

No persistent storage — Vercel ISR cache only.

---

## Constraints

- Server-side fetch only; no LeetCode calls from the browser
- `LEETCODE_USERNAME` must be configurable via env var (default `sanjit12`)
- All charts must respect light/dark theme
- All animations must respect `prefers-reduced-motion`
- ISR revalidate window: `3600` seconds (1 hour)
- No paid LeetCode API tiers
- Reuse `Section`, `Container`, `Heading` from `src/components/shared/` where possible
- Follow the existing `kebab-case.ts` / `PascalCase.tsx` naming conventions
- Tests required for the data layer normalization; component smoke tests encouraged

---

## Success Criteria

### Functional

- [x] `/leetcode` renders successfully on Vercel preview
- [x] Nav contains a "LeetCode" entry pointing to `/leetcode`
- [x] Home page has a visible callout linking to `/leetcode`
- [x] All four KPI cards display the correct numbers
- [x] Difficulty chart shows Easy/Medium/Hard with counts and percentages
- [x] Topic chart shows the top 8 topics with counts
- [x] Activity heatmap renders 90 days with intensity buckets
- [x] Contest timeline shows current rating + badge + last 20 contests
- [x] "View on LeetCode" CTA opens `https://leetcode.com/sanjit12/` in a new tab
- [x] When the LeetCode data source returns an error, page renders with a "data may be stale" banner and the last-known data (no 5xx)

### Non-Functional

- [x] Light and dark themes both render correctly for all charts and the heatmap
- [x] `prefers-reduced-motion` disables chart animations
- [x] No `LEETCODE_USERNAME` value in any client-side bundle

### Quality

- [x] All TypeScript strict-mode checks pass
- [x] Vitest passes (290 tests)
- [x] All acceptance criteria met
- [x] `docs/leetcode.md` documents env var, data source, visualizations, and how to force a revalidation

---

## Bolt Suggestions

Based on stories and complexity, three bolts are recommended:

| Bolt                              | Type   | Stories                                       | Objective                                            |
| --------------------------------- | ------ | --------------------------------------------- | ---------------------------------------------------- |
| `004-leetcode-stats-ui-foundation` | Simple | 001, 002, 003                                 | Data layer + route + nav + home callout              |
| `005-leetcode-stats-ui-visualizations` | Simple | 004, 005, 006, 007                            | KPI cards + 3 charts (difficulty, topic, heatmap)    |
| `006-leetcode-stats-ui-polish`    | Simple | 008, plus stale-state refinement + dev doc    | Contest timeline + final polish + dev doc            |

---

## Notes

- The LeetCode data source library choice is the single biggest technical unknown. If both `alfa-leetcode-api` and `leetcode-query` are unreliable, the Construction Agent should fall back to direct GraphQL calls against `https://leetcode.com/graphql`.
- Heatmap intensity buckets should match GitHub's convention (0, 1-2, 3-5, 6-9, 10+ submissions) for visual familiarity.
- The stale-data banner should be subtle (not alarming) — it's a known constraint of the data source, not an error.
- The home-page callout should NOT duplicate the content of `/leetcode`; it should be a teaser with a strong "see more" link.
