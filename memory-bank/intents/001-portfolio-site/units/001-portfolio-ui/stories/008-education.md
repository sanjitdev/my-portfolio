---
id: 008-education
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: ready
priority: should
created: 2026-10-08T20:52:00Z
assigned_bolt: 001-portfolio-ui-sections
implemented: false
---

# Story: 008-education

## User Story

**As a** visitor
**I want** to see the candidate's educational background
**So that** I understand their academic foundation

## Acceptance Criteria

- [ ] **Given** the Education section renders, **When** I read the heading, **Then** it says "Education"
- [ ] **Given** `education` has entries, **When** I view the section, **Then** each entry shows institution, degree, and date range
- [ ] **Given** an entry has a `field_of_study`, **When** it renders, **Then** the field is shown
- [ ] **Given** I view on mobile, **When** entries stack, **Then** they remain readable
- [ ] **Given** `education` is empty, **When** the section renders, **Then** the entire section is hidden (not just empty)
- [ ] **Given** dark mode is active, **When** I view entries, **Then** colors adapt properly

## Technical Notes

- Component: `components/education/EducationSection.tsx`
- Receives `education: Education[]` as prop
- Use `Card` primitive for each entry
- Layout: institution + degree on top, dates below
- Conditionally render the entire section if the array is empty (`education.length > 0` check)

## Dependencies

### Requires
- 002-cv-data
- 003-shared-components

### Enables
- 013-nav (Education is a nav target)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty education array | Section hidden entirely |
| Missing `end_date` (ongoing) | Show "{start} – Present" or just "{start}" |
| Missing `degree` (just institution) | Show institution only |

## Out of Scope

- GPA display (not in CV)
- Course listings (not in CV)
- Institution logos (would need new assets)