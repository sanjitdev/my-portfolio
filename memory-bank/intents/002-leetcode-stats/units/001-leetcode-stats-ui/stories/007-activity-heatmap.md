---
id: 007-activity-heatmap
unit: 001-leetcode-stats-ui
intent: 002-leetcode-stats
status: draft
priority: must
created: 2026-10-11T15:50:00Z
assigned_bolt: null
implemented: false
---

# Story: 007-activity-heatmap

## User Story

**As a** recruiter
**I want** to see a calendar heatmap of recent activity
**So that** I can tell whether the candidate is actively practicing or has gone stale

## Acceptance Criteria

- [ ] **Given** the page renders, **When** the heatmap appears, **Then** it shows 90 days of activity (12+ weeks × 7 days) in a GitHub-style grid
- [ ] **Given** the heatmap renders, **When** a recruiter views it, **Then** each day is colored by intensity using 5 buckets: 0, 1-2, 3-5, 6-9, 10+ submissions
- [ ] **Given** the heatmap renders, **When** a recruiter hovers over a day, **Then** a tooltip shows the date and submission count
- [ ] **Given** the heatmap renders, **When** viewing in light/dark mode, **Then** the 5-bucket scale is clearly distinguishable in both themes
- [ ] **Given** the heatmap renders, **When** viewing on mobile, **Then** it remains horizontally scrollable or scales down without losing the day granularity
- [ ] **Given** `prefers-reduced-motion` is set, **When** the heatmap animates in, **Then** it appears without animation
- [ ] **Given** the heatmap renders, **When** a screen reader user navigates to it, **Then** it has an `aria-label` summarizing total submissions and active days
- [ ] **Given** the heatmap renders, **When** a recruiter looks at the bottom row, **Then** they see month labels (e.g., "Aug", "Sep", "Oct")
- [ ] **Given** the heatmap renders, **When** a recruiter looks at the left column, **Then** they see weekday labels (Mon, Wed, Fri) for orientation

## Technical Notes

- File: `src/components/leetcode/ActivityHeatmap.tsx`.
- Implementation choice: **custom SVG** (preferred, lightweight) or **Visx Heatmap** (if a heavier lib is needed for accessibility).
- Bucket colors should follow a single-hue ramp (e.g., emerald at 4 intensities) and have a parallel ramp for dark mode (lighter, not darker).
- Layout: weeks as columns (Mon → Sun), each cell is a small square (10-12px), with month labels below the appropriate columns.

## Dependencies

### Requires

- `001-leetcode-data`

### Enables

- None

## Edge Cases

| Scenario                                  | Expected Behavior                              |
| ----------------------------------------- | ---------------------------------------------- |
| Activity data is empty                    | Heatmap renders with all-zero cells; banner says "No submissions in the last 90 days" |
| Activity data has gaps (no entries)       | Treat as 0 submissions                         |
| Date is in the future (clock skew)       | Clamp to "today"                               |
| Submission count > 10                     | Bucket 5 (highest intensity)                   |

## Out of Scope

- Multi-year heatmap (90 days only)
- Streak counter (could be added later as a small text stat)
- Per-day problem links