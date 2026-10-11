---
id: 008-contest-timeline
unit: 001-leetcode-stats-ui
intent: 002-leetcode-stats
status: complete
priority: should
created: 2026-10-11T15:50:00Z
assigned_bolt: 006-leetcode-stats-ui-polish
implemented: true
---

# Story: 008-contest-timeline

## User Story

**As a** recruiter
**I want** to see the contest rating trend over time
**So that** I can gauge how the candidate performs under time pressure against peers

## Acceptance Criteria

- [ ] **Given** the data source provides contest history, **When** the page renders, **Then** the contest section shows the current rating, the badge name (e.g., "Knight", "Guardian"), and a sparkline of the last 20 contests
- [ ] **Given** the contest section renders, **When** a recruiter hovers over a point on the sparkline, **Then** a tooltip shows the contest name, date, and rating
- [ ] **Given** the data source provides a "Top X%" global rank, **When** the section renders, **Then** the rank is displayed (e.g., "Top 4.2% globally")
- [ ] **Given** the user has no contest history, **When** the page renders, **Then** the entire contest section is hidden (no empty placeholder)
- [ ] **Given** the contest section renders, **When** viewing in light/dark mode, **Then** the sparkline and badge are readable in both themes
- [ ] **Given** `prefers-reduced-motion` is set, **When** the sparkline animates in, **Then** it appears without animation
- [ ] **Given** the contest section renders, **When** a screen reader user navigates to it, **Then** it has an `aria-label` summarizing the current rating and badge

## Technical Notes

- File: `src/components/leetcode/ContestTimeline.tsx`.
- Badge tier mapping (LeetCode convention): Knight 2000+, Guardian 2500+, Hero 3000+; below 2400 = no badge text.
- Sparkline: use the same charts library as `005-difficulty-chart` and `006-topic-chart`.
- If only 1 contest exists, sparkline degrades to a single dot + the rating.

## Dependencies

### Requires

- `001-leetcode-data`
- `002-leetcode-route-and-nav`

### Enables

- None

## Edge Cases

| Scenario                                    | Expected Behavior                            |
| ------------------------------------------- | -------------------------------------------- |
| Zero contests                               | Hide entire section                          |
| Exactly 1 contest                           | Sparkline = single point + the rating text   |
| `Top X%` not provided by data source        | Omit the rank line, still show rating + badge |
| Rating is unusually low (e.g., 1200)        | Show rating with no badge text               |
| Last contest is > 1 year old              | Still show it on the sparkline, but de-emphasize with a tooltip note |

## Out of Scope

- Full contest history beyond 20 contests
- Per-contest problem set drilldown
- Predicted next rating