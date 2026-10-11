---
id: 005-difficulty-chart
unit: 001-leetcode-stats-ui
intent: 002-leetcode-stats
status: draft
priority: must
created: 2026-10-11T15:50:00Z
assigned_bolt: null
implemented: false
---

# Story: 005-difficulty-chart

## User Story

**As a** recruiter
**I want** to see how many problems I've solved at each difficulty
**So that** I can quickly judge the breadth and depth of my problem-solving

## Acceptance Criteria

- [ ] **Given** the page renders, **When** the difficulty chart appears, **Then** it shows three segments: Easy, Medium, Hard with counts and percentages
- [ ] **Given** the chart renders, **When** a recruiter views it, **Then** segments are color-coded (Easy = green, Medium = amber, Hard = red) in both light and dark themes
- [ ] **Given** the chart renders, **When** a recruiter hovers over a segment, **Then** a tooltip shows the exact count and percentage
- [ ] **Given** the chart renders, **When** viewing on mobile, **Then** it scales responsively without overflow
- [ ] **Given** the user has zero solved in any difficulty, **When** the chart renders, **Then** that segment is shown at 0% with a subtle placeholder
- [ ] **Given** `prefers-reduced-motion` is set, **When** the chart animates in, **Then** it appears without animation
- [ ] **Given** the chart renders, **When** a screen reader user navigates to it, **Then** the chart has an `aria-label` summarizing the breakdown (e.g., "Difficulty distribution: 150 Easy, 200 Medium, 62 Hard")

## Technical Notes

- File: `src/components/leetcode/DifficultyChart.tsx`.
- Visual type: **donut chart** (recommended) or stacked horizontal bar — choose based on what reads best with the existing chart library.
- Use the same charts library as `006-topic-chart` and `007-activity-heatmap` for consistency.
- Donut center can show the total solved count as a big number (single most important stat).
- Total: `easySolved + mediumSolved + hardSolved` should equal `totalSolved`; if not, display the donut from the per-difficulty counts and surface a console warning.

## Dependencies

### Requires

- `001-leetcode-data`
- `002-leetcode-route-and-nav`

### Enables

- None

## Edge Cases

| Scenario                                | Expected Behavior                                  |
| --------------------------------------- | -------------------------------------------------- |
| Total solved count > sum of difficulties | Use the per-difficulty counts; surface a dev-mode console warning |
| All zero                                | Render an empty state with "No problems solved yet" |
| Negative count (data anomaly)           | Clamp to 0                                          |

## Out of Scope

- Acceptance rate per difficulty (separate stat)
- Trend vs previous month