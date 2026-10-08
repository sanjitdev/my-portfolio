---
id: 004-hero
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: ready
priority: must
created: 2026-10-08T20:52:00Z
assigned_bolt: 001-portfolio-ui-sections
implemented: false
---

# Story: 004-hero

## User Story

**As a** visitor
**I want** to see the candidate's name, title, headline, and primary contact CTAs at the top of the page
**So that** I immediately know whose portfolio this is and how to reach them

## Acceptance Criteria

- [ ] **Given** I load the home page, **When** the hero renders, **Then** the candidate's name appears as a large `<h1>`
- [ ] **Given** the hero renders, **When** I look below the name, **Then** the current title appears as a prominent subtitle
- [ ] **Given** the hero renders, **When** I look below the title, **Then** the headline appears as supporting text
- [ ] **Given** the hero renders, **When** I see the contact area, **Then** email, LinkedIn, and website are visible as clickable icons/labels
- [ ] **Given** I click "Get in touch", **When** it activates, **Then** the page smooth-scrolls to the Contact section
- [ ] **Given** the hero is rendered, **When** I view source, **Then** the home address is NOT present anywhere in the output
- [ ] **Given** the page is rendered in dark mode, **When** the hero displays, **Then** all colors adapt (text, icons, background)

## Technical Notes

- Component: `components/hero/HeroSection.tsx`
- Receives `personalInfo: PublicContact` (from `getDisplayContact()`) as prop
- Hero is the first section, no `id` needed (or `id="top"`)
- Use `lucide-react` for icons: `Mail`, `Linkedin`, `Globe`, `ArrowDown`
- "Get in touch" button is an `<a href="#contact">` (no JS needed; browser handles smooth-scroll via `scroll-behavior: smooth` in CSS, or a small client component for the icon animation)
- Layout: large name, subtitle, headline, then a row of icon buttons + CTA button
- Mobile: stack icon buttons vertically or wrap; CTA full-width

## Dependencies

### Requires
- 002-cv-data (typed data + `getDisplayContact()`)
- 003-shared-components (Container, Section)

### Enables
- 013-nav (Hero must exist as a nav target)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Very long name (multi-word) | Wraps normally; no truncation |
| Missing website (undefined) | Website icon hidden, not shown as broken link |
| Phone is displayed in hero? | No — phone is only in Contact section (privacy decision: less prominent) |

## Out of Scope

- Profile photo (not in CV data; would need new asset)
- Animated typing effect on the headline (intentionally minimal design)