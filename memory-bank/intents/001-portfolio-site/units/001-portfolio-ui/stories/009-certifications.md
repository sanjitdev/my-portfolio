---
id: 009-certifications
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: complete
priority: should
created: '2026-10-08T20:52:00Z'
assigned_bolt: 001-portfolio-ui-sections
implemented: true
---

# Story: 009-certifications

## User Story

**As a** visitor
**I want** to see the candidate's professional certifications
**So that** I can verify their credentials

## Acceptance Criteria

- [ ] **Given** the Certifications section renders, **When** I read the heading, **Then** it says "Certifications"
- [ ] **Given** `certifications` has entries, **When** I view the section, **Then** each certification name is shown as a list item
- [ ] **Given** I view the list, **When** I look at the layout, **Then** items are presented as a clean list (bulleted or with icons)
- [ ] **Given** `certifications` is empty, **When** the section renders, **Then** the entire section is hidden
- [ ] **Given** dark mode is active, **When** I view items, **Then** contrast is WCAG AA compliant

## Technical Notes

- Component: `components/certifications/CertificationsSection.tsx`
- Receives `certifications: string[]` as prop
- Use `lucide-react`'s `BadgeCheck` or `Award` icon next to each entry
- Layout: vertical list with icon + text
- Conditionally render the entire section if empty

## Dependencies

### Requires
- 002-cv-data
- 003-shared-components

### Enables
- 013-nav (Certifications is a nav target)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty certifications array | Section hidden |
| Very long certification name | Wraps within the row |
| Duplicate certification names | Each rendered as a separate item (no deduplication) |

## Out of Scope

- Issuing organization display (not in current CV data)
- Date earned display (not in current CV data)
- Clickable certifications linking to verification URLs (no URLs in CV)