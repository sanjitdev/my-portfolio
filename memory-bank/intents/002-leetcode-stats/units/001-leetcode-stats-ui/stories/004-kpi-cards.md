---
id: 004-kpi-cards
unit: 001-leetcode-stats-ui
intent: 002-leetcode-stats
status: draft
priority: must
created: 2026-10-11T15:50:00Z
assigned_bolt: null
implemented: false
---

# Story: 004-kpi-cards

## User Story

**As a** recruiter
**I want** to see four headline numbers from the LeetCode profile at the top of the page
**So that** I can absorb the most important stats in under 5 seconds

## Acceptance Criteria

- [ ] **Given** the page renders, **When** the KPI section appears, **Then** it shows four tiles: **Total Solved**, **Acceptance Rate**, **Global Ranking**, **Contribution Points**
- [ ] **Given** the KPI tiles are rendered, **When** a recruiter views them, **Then** each tile has a large number, a label, and an icon (consistent across tiles)
- [ ] **Given** the KPI tiles are rendered, **When** viewing them on desktop, **Then** they appear in a single horizontal row; on mobile they stack 2x2 or 1x4
- [ ] **Given** the page first paints, **When** the numbers animate in, **Then** they count up from 0 to their final value (unless `prefers-reduced-motion` is set, in which case they appear instantly)
- [ ] **Given** the data is stale, **When** the tiles render, **Then** the numbers still display the cached values (not zero, not "unavailable")
- [ ] **Given** a KPI value is missing from the data (e.g., global ranking hidden by user), **When** the tile renders, **Then** it shows "—" with a subtle "not available" tooltip
- [ ] **Given** the page is rendered, **When** a recruiter uses a screen reader, **Then** each KPI is announced with its label and number (e.g., "Total Solved: 412")

## Technical Notes

- File: `src/components/leetcode/KpiCards.tsx`.
- Icons: use `lucide-react` (already in `001-portfolio-ui`).
- Count-up animation: prefer a lightweight approach (CSS + small JS) or a tiny library; do not pull in a heavy animation framework.
- Match typography scale of existing hero stats in `src/components/hero/`.

## Dependencies

### Requires

- `001-leetcode-data`
- `002-leetcode-route-and-nav` (the tiles live on the page)

### Enables

- None

## Edge Cases

| Scenario                                  | Expected Behavior                          |
| ----------------------------------------- | ------------------------------------------ |
| Global ranking is null (user opted out)   | Tile shows "—" with tooltip                |
| Acceptance rate is 0                      | Tile shows "0%"                            |
| Contribution points > 9999                | Format with thousands separator             |
| `prefers-reduced-motion`                  | No count-up animation; numbers appear instantly |

## Out of Scope

- Tooltips with full breakdowns (numbers + labels only)
- Per-KPI drilldown routes
- Animated number particle effects