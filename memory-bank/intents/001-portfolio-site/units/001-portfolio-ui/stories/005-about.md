---
id: 005-about
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: ready
priority: must
created: 2026-10-08T20:52:00Z
assigned_bolt: 001-portfolio-ui-sections
implemented: false
---

# Story: 005-about

## User Story

**As a** visitor
**I want** to read a clear summary of the candidate's professional background
**So that** I understand their expertise at a glance

## Acceptance Criteria

- [ ] **Given** the About section renders, **When** I read the heading, **Then** it says "About"
- [ ] **Given** the section is rendered, **When** I read the body, **Then** the summary text from `cv.summary` appears as a readable paragraph
- [ ] **Given** the section renders on a wide viewport (≥ 1024px), **When** I view it, **Then** the text doesn't exceed ~80 characters per line (optimal reading)
- [ ] **Given** the section renders on mobile, **When** I view it, **Then** the text wraps to viewport width with comfortable padding
- [ ] **Given** dark mode is active, **When** I view the section, **Then** text colors are legible (WCAG AA contrast)
- [ ] **Given** `prefers-reduced-motion: reduce`, **When** the section enters the viewport, **Then** no fade-in animation plays

## Technical Notes

- Component: `components/about/AboutSection.tsx`
- Receives `summary: string` as prop
- Uses `Container`, `Section id="about"`, `Heading as="h2"` from shared
- Paragraph: `<p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">`
- Subtle fade-in on viewport entry via `IntersectionObserver` (client component for the wrapper), respects `prefers-reduced-motion`

## Dependencies

### Requires
- 002-cv-data
- 003-shared-components

### Enables
- 013-nav (About is a nav target)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty summary | Section renders the heading but no paragraph (or "Summary not provided" placeholder) |
| Very long summary (>500 chars) | Renders fully, no truncation |
| Summary contains HTML/special chars | Rendered as plain text (React escapes by default) |

## Out of Scope

- Markdown rendering (summary is plain text per current data)
- Section dividers or decorative graphics (minimal design)