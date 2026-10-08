---
id: 010-languages
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: complete
priority: could
created: '2026-10-08T20:52:00Z'
assigned_bolt: 001-portfolio-ui-sections
implemented: true
---

# Story: 010-languages

## User Story

**As a** visitor
**I want** to see the languages the candidate speaks and their proficiency levels
**So that** I can assess communication fit for distributed/remote teams

## Acceptance Criteria

- [ ] **Given** the Languages section renders, **When** I read the heading, **Then** it says "Languages"
- [ ] **Given** `languages` has entries, **When** I view the section, **Then** each language is shown with its proficiency level
- [ ] **Given** I view the layout, **When** I look at it, **Then** languages and proficiency are visually paired (e.g., "Bengali — Native or Bilingual")
- [ ] **Given** `languages` is empty, **When** the section renders, **Then** the entire section is hidden
- [ ] **Given** dark mode is active, **When** I view items, **Then** contrast is WCAG AA compliant

## Technical Notes

- Component: `components/languages/LanguagesSection.tsx`
- Receives `languages: { language: string; proficiency: string }[]` as prop
- Layout: list or grid (2 columns on desktop, 1 on mobile)
- Use a subtle divider (`—` or `·`) between language and proficiency
- Conditionally render the entire section if empty

## Dependencies

### Requires
- 002-cv-data
- 003-shared-components

### Enables
- 013-nav (Languages is a nav target)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty languages array | Section hidden |
| Many languages (10+) | All render in a clean grid |
| Long proficiency text | Wraps within the cell |

## Out of Scope

- CEFR level conversion (proficiency is text as-is from CV)
- Flag icons (would need new assets and could feel exclusionary)