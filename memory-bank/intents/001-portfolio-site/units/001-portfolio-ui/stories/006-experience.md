---
id: 006-experience
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: ready
priority: must
created: 2026-10-08T20:52:00Z
assigned_bolt: 001-portfolio-ui-sections
implemented: false
---

# Story: 006-experience

## User Story

**As a** visitor
**I want** to see a reverse-chronological list of the candidate's work experience with role, company, dates, and responsibilities
**So that** I can assess their career progression and relevant work

## Acceptance Criteria

- [ ] **Given** the Experience section renders, **When** I read the heading, **Then** it says "Experience"
- [ ] **Given** the CV has multiple experience entries, **When** I view the section, **Then** the most recent role appears first
- [ ] **Given** each entry renders, **When** I look at it, **Then** I see: company name, job title, date range, location, and a bulleted list of responsibilities
- [ ] **Given** an entry's `end_date` is "Present", **When** the date range displays, **Then** it shows "{start} – Present"
- [ ] **Given** the pre-computed `duration` field is present, **When** the entry displays, **Then** the duration is shown (e.g., "10 months", "3 years 8 months")
- [ ] **Given** I view on mobile, **When** the list renders, **Then** each entry is a full-width card
- [ ] **Given** dark mode is active, **When** the list renders, **Then** all colors adapt properly
- [ ] **Given** I keyboard-navigate, **When** I tab through the section, **Then** only the date "Present" text and any links are focusable (not the bullets or plain text)

## Technical Notes

- Component: `components/experience/ExperienceSection.tsx`
- Receives `experiences: Experience[]` as prop (ordered most-recent-first)
- Use `Card` primitive from shared for each entry
- Layout: company + title (left), date range + location + duration (right) on desktop; stacked on mobile
- Responsibilities: `<ul>` with `<li>` items
- Use `formatDateRange()` from `lib/cv-data.ts` for date formatting
- Schema for `Experience`:
  ```ts
  {
    company: string
    title: string
    start_date: string  // e.g., "January 2026"
    end_date: string    // "Present" or actual date
    duration: string    // pre-computed
    location: string
    responsibilities: string[]
  }
  ```

## Dependencies

### Requires
- 002-cv-data (typed `Experience[]`)
- 003-shared-components (Section, Container, Heading, Card)

### Enables
- 013-nav (Experience is a nav target)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty responsibilities list | Render entry without `<ul>` |
| Very long responsibility text | Wraps within the card |
| Multiple roles at same company | Each is a separate entry (preserves CV structure) |
| "Present" appears as actual date in some entries | Comparison logic: `end_date === "Present"` or "present" |

## Out of Scope

- Expandable/collapsible entries (all visible at once is fine for ~5 entries)
- Filtering by company or date
- "Download as PDF" of just this section