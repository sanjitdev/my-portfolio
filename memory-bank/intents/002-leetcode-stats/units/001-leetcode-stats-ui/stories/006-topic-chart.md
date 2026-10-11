---
id: 006-topic-chart
unit: 001-leetcode-stats-ui
intent: 002-leetcode-stats
status: draft
priority: must
created: 2026-10-11T15:50:00Z
assigned_bolt: null
implemented: false
---

# Story: 006-topic-chart

## User Story

**As a** recruiter
**I want** to see which problem topics I've solved the most
**So that** I can identify my strongest areas at a glance

## Acceptance Criteria

- [ ] **Given** the data source provides topic/tag stats, **When** the page renders, **Then** the topic chart shows the top 8 topics by solved count as a horizontal bar chart
- [ ] **Given** the chart renders, **When** a recruiter views it, **Then** each bar is labeled with the topic name and count
- [ ] **Given** the chart renders, **When** viewed on mobile, **Then** bars remain readable (labels do not truncate)
- [ ] **Given** the chart renders, **When** viewing in light/dark mode, **Then** bar colors and labels are readable in both themes
- [ ] **Given** `prefers-reduced-motion` is set, **When** the chart animates in, **Then** it appears without animation
- [ ] **Given** the data source does not provide topic tags, **When** the page renders, **Then** the topic chart section is hidden entirely (no empty placeholder)
- [ ] **Given** the chart renders, **When** a screen reader user navigates to it, **Then** the chart has an `aria-label` summarizing the top topics

## Technical Notes

- File: `src/components/leetcode/TopicChart.tsx`.
- Sort topics by count descending and take top 8.
- Long topic names ("Dynamic Programming") must truncate or wrap cleanly.
- Use the same charts library as `005-difficulty-chart` for consistency.

## Dependencies

### Requires

- `001-leetcode-data`

### Enables

- None

## Edge Cases

| Scenario                                  | Expected Behavior                                       |
| ----------------------------------------- | ------------------------------------------------------- |
| Topic tags unavailable from data source   | Hide the entire section (no error, no empty placeholder) |
| Two topics tied at the same count         | Sort alphabetically as tiebreaker                       |
| Topic name > 30 chars                     | Truncate with ellipsis or wrap to two lines             |

## Out of Scope

- Clickable bars that filter other charts
- "All topics" view (top 8 only)
- Per-topic acceptance rate