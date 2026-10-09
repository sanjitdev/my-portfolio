---
id: adr-001
title: Editorial redesign with Playfair Display + Inter typography and monogram branding
status: accepted
date: 2026-10-09
bolt: post-bolt-evolution (free-form, not in original 3-bolt plan)
commit: 832cc82
supersedes: null
---

# ADR-001: Editorial redesign — typography, branding, and resume download

## Context

The original portfolio (Bolt 002) shipped with system fonts, plain SVG-style section headings, and a flat experience list. The user requested it look more like a **professional senior engineer's portfolio** — editorial typography, refined color palette, custom branding (logo + monogram), and a resume download. This work was completed outside the original 3-bolt Inception plan as free-form post-bolt evolution.

## Decision

Apply a **Minimalism & Swiss Style** redesign (chosen via UI/UX Pro Max design intelligence):

1. **Typography**: Add Playfair Display (serif) for headings via `next/font/google`. Inter (sans) for body. JetBrains Mono for eyebrows and date labels. All self-hosted with `display: 'swap'` and CSS variables registered in Tailwind v4 `@theme` tokens.
2. **Branding**: Create an SVG monogram (`SM` in a circle) used as the logo in TopNav, Footer, and favicon. Designed to scale across 3 sizes (`sm`, `md`, `lg`).
3. **Resume download**: Add a client-side "Download Resume" button that triggers `window.print()`. A `@media print` stylesheet in `globals.css` hides nav/footer and reformats sections for clean A4 output. No new dependencies (no PDF library).
4. **Availability badge**: "Open to opportunities" pill with a pulsing green dot (CSS keyframe animation), built on a new `success` color scale.
5. **Stats bar**: Computed from CV data (`getCvStats` helper) — years of experience, companies, technologies, certifications.
6. **Section eyebrows**: Editorial pre-heading text ("01 — About", "02 — Experience") in mono-uppercase with wide tracking.
7. **Skills categorization**: Heuristic keyword matching groups skills into Languages / Frameworks / Cloud & DevOps / Tools & Databases. Falls back to flat list if only 1 category has hits.
8. **Section-level polish**: Add `Briefcase`, `GraduationCap`, `BadgeCheck`, `Languages`, `Trophy` icons to their respective sections. 5-dot proficiency bars for languages. 2-column card grids for certifications, honors, and education.

## Consequences

### Positive
- Site looks professional and editorial — matches the "senior engineer portfolio" target.
- Privacy invariant preserved (no new components touch the address).
- All 87+ existing tests still pass (some updated for new render output).
- Build stays under 130 kB First Load JS (Playfair adds ~30 kB with `display: 'swap'`).
- Resume download works in all modern browsers without dependencies.

### Negative
- Bundle size increased ~20 kB due to Playfair + monogram SVGs.
- Some pre-existing tests had to be updated to match the new render output (e.g., Footer test for monogram's aria-label collision, Hero test for added `cv` prop, Languages test for new proficiency bar markup).
- `next lint` is no longer a Next 16 command — removed from package.json scripts (replaced with eslint in workflow if needed).

### Neutral
- The original 3-bolt story plan remains formally complete; this is layered on top as **free-form evolution**. A future AI-DLC cycle could formalize these enhancements as new stories if/when the project grows.

## Alternatives Considered

- **Use `next/font/local` with a pre-licensed serif**: Rejected — Playfair Display via Google Fonts is free, well-optimized, and self-hosted automatically. No licensing concerns.
- **PDF library (jspdf, react-pdf)**: Rejected — adds 100+ kB. `window.print()` is universally supported and produces the same A4 output. User can "Save as PDF" in any browser.
- **Reuse monogram in Hero**: Briefly considered. The Hero later got a real profile photo (ADR-003) so the monogram was demoted to nav/footer/favicon roles.

## Notes

Design system persisted to `design-system/sanjit-portfolio/MASTER.md` via UI/UX Pro Max `--persist` for future retrieval.
