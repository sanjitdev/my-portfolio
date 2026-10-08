---
id: 012-contact
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: ready
priority: must
created: 2026-10-08T20:52:00Z
assigned_bolt: 001-portfolio-ui-sections
implemented: false
---

# Story: 012-contact

## User Story

**As a** visitor
**I want** to see a clear, scannable contact section with all professional contact channels
**So that** I can reach out via my preferred method

## Acceptance Criteria

- [ ] **Given** the Contact section renders, **When** I read the heading, **Then** it says "Contact"
- [ ] **Given** the section renders, **When** I look at the contact channels, **Then** email, phone, LinkedIn, and personal website are all visible
- [ ] **Given** I view the email, **When** I click it, **Then** my email client opens with the address pre-filled (`mailto:`)
- [ ] **Given** I view the phone number, **When** I click it on a mobile device, **Then** the dialer opens (`tel:`)
- [ ] **Given** I view the LinkedIn link, **When** I click it, **Then** it opens in a new tab (`target="_blank" rel="noopener noreferrer"`)
- [ ] **Given** I view the website link, **When** I click it, **Then** it opens in a new tab with the same safety attrs
- [ ] **Given** I view-source the rendered page, **When** I search for the home address string, **Then** it is NOT present anywhere
- [ ] **Given** dark mode is active, **When** I view the section, **Then** all icons and links are legible
- [ ] **Given** the section is the last on the page, **When** I scroll to it, **Then** it has comfortable bottom padding (so footer isn't cramped)

## Technical Notes

- Component: `components/contact/ContactSection.tsx`
- Receives `contact: PublicContact` as prop (from `getDisplayContact()`)
- Use `lucide-react` icons: `Mail`, `Phone`, `Linkedin`, `Globe`
- Each channel rendered as a card or row with: icon, label, value, link
- Privacy: do NOT include the address field in the prop type (compile-time enforcement)
- The `PublicContact` type is a strict subset that excludes `address`

## Dependencies

### Requires
- 002-cv-data (typed `PublicContact` with address excluded)
- 003-shared-components (Section, Container, Card)

### Enables
- 013-nav (Contact is a nav target)
- 016-deploy (footer with last-updated is below this section)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Missing website | Website row hidden (or shown as text only, not clickable) |
| Missing LinkedIn | LinkedIn row hidden |
| Phone format already includes spaces/dashes | Display as-is from CV |
| Address appears in any rendered string | **Test fails** — this is a critical privacy guarantee |

## Out of Scope

- Contact form (no submission endpoint)
- Social profiles beyond LinkedIn (not in CV)
- Calendar booking link (would need new data)