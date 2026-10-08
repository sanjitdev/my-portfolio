---
id: 007-skills
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: ready
priority: must
created: 2026-10-08T20:52:00Z
assigned_bolt: 001-portfolio-ui-sections
implemented: false
---

# Story: 007-skills

## User Story

**As a** visitor
**I want** to see the candidate's top skills as a visual list of tags
**So that** I can quickly assess their areas of expertise

## Acceptance Criteria

- [ ] **Given** the Skills section renders, **When** I read the heading, **Then** it says "Skills"
- [ ] **Given** `top_skills` has entries, **When** I view the section, **Then** each skill appears as a styled tag/pill
- [ ] **Given** I view the section, **When** I look at the layout, **Then** tags wrap naturally and are evenly spaced
- [ ] **Given** I view on mobile, **When** tags wrap, **Then** they remain readable and tappable (44×44 px tap target)
- [ ] **Given** dark mode is active, **When** I view tags, **Then** they have appropriate contrast (not too dark, not too bright)
- [ ] **Given** `top_skills` is empty, **When** the section renders, **Then** the heading still appears but no tags are shown (no error)

## Technical Notes

- Component: `components/skills/SkillsSection.tsx`
- Receives `skills: string[]` as prop
- Use `Tag` primitive from shared
- Layout: `flex flex-wrap gap-2` (or `gap-3`)
- Optional: subtle fade-in on viewport entry (respects `prefers-reduced-motion`)

## Dependencies

### Requires
- 002-cv-data
- 003-shared-components

### Enables
- 013-nav (Skills is a nav target)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Single skill | One tag centered or left-aligned |
| 50+ skills | All render; performance not a concern (it's just text) |
| Skill name with special chars (e.g., "C#", "C++") | Rendered as-is (HTML-safe) |

## Out of Scope

- Categorization (e.g., "Languages" vs "Frameworks") — the CV provides a flat list
- Skill proficiency indicators (no proficiency data in CV)
- Clickable skills that link to projects (no project data)