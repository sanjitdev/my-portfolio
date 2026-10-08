---
id: 011-honors
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: ready
priority: could
created: 2026-10-08T20:52:00Z
assigned_bolt: 001-portfolio-ui-sections
implemented: false
---

# Story: 011-honors

## User Story

**As a** visitor
**I want** to see awards and honors the candidate has received
**So that** I can recognize external validation of their work

## Acceptance Criteria

- [ ] **Given** the Honors & Awards section renders, **When** I read the heading, **Then** it says "Honors & Awards"
- [ ] **Given** `honors_awards` has entries, **When** I view the section, **Then** each award name is shown as a list item
- [ ] **Given** I view the list, **When** I look at the layout, **Then** items have a clear visual treatment (icon + text)
- [ ] **Given** `honors_awards` is empty, **When** the section renders, **Then** the entire section is hidden
- [ ] **Given** dark mode is active, **When** I view items, **Then** contrast is WCAG AA compliant

## Technical Notes

- Component: `components/honors/HonorsSection.tsx`
- Receives `awards: string[]` as prop
- Use `lucide-react`'s `Trophy` or `Award` icon
- Layout: vertical list with icon + text, similar to Certifications
- Conditionally render the entire section if empty

## Dependencies

### Requires
- 002-cv-data
- 003-shared-components

### Enables
- 013-nav (Honors is a nav target; may be hidden in nav if empty)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty awards array | Section hidden AND not added to nav (013-nav must handle this) |
| Long award names | Wrap within the row |

## Out of Scope

- Award date display (not in current CV data)
- Awarding organization display (not in current CV data)
- Clickable awards with external links (no URLs)