---
id: 003-leetcode-home-callout
unit: 001-leetcode-stats-ui
intent: 002-leetcode-stats
status: complete
priority: must
created: 2026-10-11T15:50:00Z
assigned_bolt: 004-leetcode-stats-ui-foundation
implemented: true
---

# Story: 003-leetcode-home-callout

## User Story

**As a** recruiter landing on the portfolio home page
**I want** to see a teaser that links to the LeetCode stats page
**So that** I notice the problem-solving showcase immediately and click through

## Acceptance Criteria

- [ ] **Given** the home page is rendered, **When** a recruiter scrolls the page, **Then** they see a visible callout card linking to `/leetcode`
- [ ] **Given** the recruiter clicks the callout, **When** the click is processed, **Then** they navigate to `/leetcode`
- [ ] **Given** the callout is rendered, **When** a recruiter reads it, **Then** they see a short headline, a single prominent number (e.g., "X problems solved"), and a "View problem-solving stats →" link
- [ ] **Given** the callout is rendered, **When** viewing it in light/dark mode, **Then** colors and contrast are correct
- [ ] **Given** the callout is rendered, **When** viewing it on mobile, **Then** it stacks cleanly within the home page layout
- [ ] **Given** the home page is generated at build time, **When** the callout is rendered, **Then** it does not cause a per-request fetch (the number is bundled at build / ISR time)

## Technical Notes

- This is a teaser, not a full stats preview — keep it lightweight (1 headline + 1 number + 1 link).
- Position: between the "Skills" section and the "Contact" section (logical career-flow order).
- File: `src/components/home/leetcode-callout.tsx`.
- The single number can come from a lightweight server-side call to the same fetcher, but at build time / ISR only.
- Match the design language of existing `src/components/home/` cards (e.g., `recommendations`, `projects`).

## Dependencies

### Requires

- `001-leetcode-data` (needs the fetcher to read the headline number)

### Enables

- None (this is a leaf story)

## Edge Cases

| Scenario                                       | Expected Behavior                            |
| ---------------------------------------------- | -------------------------------------------- |
| LeetCode data source is down at build time     | Callout shows a neutral "See problem-solving stats" link without a number |
| Mobile viewport                                | Stacks above or below existing section      |

## Out of Scope

- Multiple numbers or charts on the home page (keep it a teaser)
- A modal or popup (the callout is an inline card)
- Personalised messaging based on referrer