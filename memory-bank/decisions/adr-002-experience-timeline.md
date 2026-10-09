---
id: adr-002
title: Experience section as an editorial vertical timeline with collapsible responsibilities
status: accepted
date: 2026-10-09
bolt: post-bolt-evolution (free-form, not in original 3-bolt plan)
commit: c7ad81a
supersedes: null
---

# ADR-002: Experience as a vertical timeline with progressive disclosure

## Context

The original `ExperienceSection` rendered all 5+ jobs as full cards, each showing every responsibility inline. With the candidate's 5 entries × 7 responsibilities, the page became a wall of text and hard to scan. The user explicitly asked for the experience section to "show the work experience in a professional way" rather than "just a list."

## Decision

Restructure the experience section as an **editorial vertical timeline** with **progressive disclosure** of responsibilities:

1. **Vertical timeline rail**: A thin gradient line (accent at top → muted at bottom) runs down the left of every entry. A node (dot) sits at each role. The "current" role (end_date === "Present") has an accent-colored dot with a soft ring; past roles get muted dots that turn accent on hover.

2. **Date column on desktop** (≥ 768px): A 5.5rem left column on each entry shows the start year, end year, and duration in monospaced small-caps. The "Present" end date is rendered as a label rather than a year.

3. **Progressive disclosure**: Responsibilities are **collapsed by default** behind a toggle button labeled "N responsibilities" (or "Hide details" when open). Only the **most recent role** is open by default to give a quick sense of current work; older roles stay closed so the page scans cleanly.

4. **Smooth height transition**: Uses the CSS `grid-template-rows: 0fr` → `1fr` trick (no JS measurement) with a 300ms `ease-out` transition. Respects `prefers-reduced-motion` (snaps to open in print). The chevron icon rotates 180° when expanded.

5. **Component split**: `ExperienceCard` became a `'use client'` component (was server). It receives `defaultExpanded?: boolean` (used by the section to open only the first entry). `ExperienceSection` still server-renders, draws the rail, and provides the `<ol>` wrapper.

## Consequences

### Positive
- The page is now scannable: a visitor sees 5 dot+title combos first, can read the most recent responsibilities, and only opens older roles if interested.
- The timeline rail is a strong visual signal of chronology — better than cards stacked in a grid.
- The toggle pattern is accessible (`aria-expanded`, `aria-controls`, button) and works with keyboard + screen readers.
- All existing tests still pass after updating them for the new render output (3 new tests added: collapse default, expand on click, defaultExpanded).

### Negative
- `ExperienceCard` is now a client component, adding a small amount of JS to the bundle (~2 kB for the toggle logic). Acceptable tradeoff for the UX win.
- The date column on desktop adds visual weight — but it's structurally informative.

### Neutral
- The CSS grid-row transition is a relatively new browser feature, but it's supported in all modern browsers (Chrome 117+, Firefox 121+, Safari 17.4+). Falls back gracefully (responsibilities are always rendered in the DOM, just clipped to 0 height when collapsed).
- `prefers-reduced-motion` snaps the transition to 0ms, so users who disable motion get the same final state instantly.

## Alternatives Considered

- **`<details>` / `<summary>` element**: Native collapsible. Rejected — the visual styling is harder to match to the design, and you can't get the same smooth height transition without `interpolate-size` (still experimental).
- **Always expanded, but with `line-clamp` truncation**: Rejected — the user wanted a more professional layout, not just truncated text. The toggle pattern is clearer about what it does.
- **Show all responsibilities inline but with smaller font and more spacing**: Rejected — still a wall of text, just smaller. The progressive disclosure pattern is the right UX.
- **Modal or popover on click**: Rejected — loses the editorial continuity of reading down the timeline.

## Notes

The toggle pattern is reusable — if other sections grow (e.g., a future "Projects" section with multiple bullet points), the same component pattern can be extracted into a shared `<Collapsible>` primitive. Not extracted yet (YAGNI).
