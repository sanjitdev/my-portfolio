---
id: 003-shared-components
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: complete
priority: must
created: '2026-10-08T20:52:00Z'
assigned_bolt: 001-portfolio-ui-foundation
implemented: true
---

# Story: 003-shared-components

## User Story

**As a** developer
**I want** reusable Section / Container / Heading / Tag / Card primitives
**So that** every content section uses consistent styling and I don't repeat layout code

## Acceptance Criteria

- [ ] **Given** I render `<Container>`, **When** it renders, **Then** it produces a `max-w-5xl mx-auto px-6` div with the children inside
- [ ] **Given** I render `<Section id="about">`, **When** it renders, **Then** it produces a `<section id="about">` with vertical padding and a `scroll-mt-*` offset for the sticky nav
- [ ] **Given** I render `<Heading as="h2">`, **When** it renders, **Then** it produces a styled `<h2>` with the project's heading typography
- [ ] **Given** I render `<Tag>React</Tag>`**, **When** it renders, **Then** it produces a styled pill (rounded-full, slate background) with the label
- [ ] **Given** I render `<Card>`, **When** it renders, **Then** it produces a styled card with rounded corners, subtle border, and padding
- [ ] **Given** I import these in `app/page.tsx` as a smoke test, **When** the app runs, **Then** all primitives render without errors
- [ ] **Given** the components use Tailwind dark variants, **When** I toggle dark mode, **Then** all primitives re-style correctly
- [ ] **Given** `prefers-reduced-motion: reduce`, **When** I render any animated primitive, **Then** animations are disabled

## Technical Notes

- All components live in `components/shared/`
- One component per file: `Container.tsx`, `Section.tsx`, `Heading.tsx`, `Tag.tsx`, `Card.tsx`
- All components are Server Components by default (no `"use client"` unless they need interactivity — none of these do)
- Accept `className` prop and merge with `clsx` or `tailwind-merge`
- `Section` accepts an `id` prop (required for nav scroll-spy)
- `Section` applies `scroll-mt-16` (or similar) so anchored sections aren't hidden under the sticky nav
- `Heading` accepts `as: 'h1' | 'h2' | 'h3'` prop (default `'h2'`); uses Tailwind classes per level
- All primitives respect WCAG 2.1 AA: semantic HTML, sufficient contrast in both modes
- Tailwind classes only — no separate CSS files

## Dependencies

### Requires
- 001-bootstrap (Tailwind configured, TypeScript working)

### Enables
- All section-rendering stories (004–012) use these primitives

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty Section children | Renders an empty `<section>` (no error) |
| Very long Section content | Wraps normally, no overflow |
| Multiple Sections with same id | HTML validation warning (acceptable; not our fault) |

## Out of Scope

- Animation library (use Tailwind transitions and CSS only)
- Component-level data fetching (data is fetched in `lib/cv-data.ts`, passed down as props)
- Storybook (overkill for a static site; tests in Vitest suffice)