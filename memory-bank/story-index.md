# Global Story Index

## Overview
- **Total stories**: 16
- **Generated**: 16
- **Implemented**: 16
- **Last updated**: 2026-10-09T17:30:00Z

---

## Stories by Intent

### 001-portfolio-site

- [x] **001-bootstrap** (001-portfolio-ui): Scaffold Next.js + Tailwind + bun — Must — ✅ IMPLEMENTED
- [x] **002-cv-data** (001-portfolio-ui): CV type definitions + Zod schema + data loader — Must — ✅ IMPLEMENTED
- [x] **003-shared-components** (001-portfolio-ui): Reusable Section / Container / Heading / Tag / Card — Must — ✅ IMPLEMENTED
- [x] **004-hero** (001-portfolio-ui): Hero section — Must — ✅ IMPLEMENTED
- [x] **005-about** (001-portfolio-ui): About / Summary section — Must — ✅ IMPLEMENTED
- [x] **006-experience** (001-portfolio-ui): Experience list — Must — ✅ IMPLEMENTED
- [x] **007-skills** (001-portfolio-ui): Skills tags — Must — ✅ IMPLEMENTED
- [x] **008-education** (001-portfolio-ui): Education list — Should — ✅ IMPLEMENTED
- [x] **009-certifications** (001-portfolio-ui): Certifications list — Should — ✅ IMPLEMENTED
- [x] **010-languages** (001-portfolio-ui): Languages list — Could — ✅ IMPLEMENTED
- [x] **011-honors** (001-portfolio-ui): Honors & Awards — Could — ✅ IMPLEMENTED
- [x] **012-contact** (001-portfolio-ui): Contact section (privacy-aware) — Must — ✅ IMPLEMENTED
- [x] **013-nav** (001-portfolio-ui): Sticky top nav with scroll-spy — Should — ✅ IMPLEMENTED
- [x] **014-theme** (001-portfolio-ui): Light/dark theme toggle — Should — ✅ IMPLEMENTED
- [x] **015-seo** (001-portfolio-ui): Meta tags + Open Graph + sitemap + robots + favicon — Should — ✅ IMPLEMENTED
- [x] **016-deploy** (001-portfolio-ui): Vercel deployment verification + last-updated timestamp — Must — ✅ IMPLEMENTED

---

## Stories by Status

- **Planned**: 0
- **Generated**: 16
- **In Progress**: 0
- **Implemented**: 16

---

## Stories by Priority

- **Must**: 9 (bootstrap, cv-data, shared-components, hero, about, experience, skills, contact, deploy)
- **Should**: 5 (education, certifications, nav, theme, seo)
- **Could**: 2 (languages, honors)

---

## Post-Bolt Evolution (Beyond Original 3-Bolt Plan)

The original Inception plan scoped exactly 16 stories across 3 bolts, all of which are now implemented and live at **https://sanjit-dev.vercel.app**. After the 3 planned bolts completed, the user requested additional polish that went beyond the original scope. This work was done as free-form post-bolt evolution and is documented in Architecture Decision Records (ADRs):

| Enhancement | ADR | Commit | Date |
|-------------|-----|--------|------|
| Editorial redesign (typography + monogram + resume) | [ADR-001](decisions/adr-001-editorial-redesign.md) | `832cc82` | 2026-10-09 |
| Experience timeline + collapsible details | [ADR-002](decisions/adr-002-experience-timeline.md) | `c7ad81a` | 2026-10-09 |
| Real profile photo in hero | [ADR-003](decisions/adr-003-profile-photo.md) | `6f67a8b` | 2026-10-09 |

If the project evolves further (e.g., a future "Projects" or "Blog" section), a new Inception cycle should formalize those as new intents + stories rather than continuing as free-form additions.

---

## Verification: 001-portfolio-ui

- Stories planned: 16
- Stories created: 16
- Stories implemented: 16
- Index updated: 16 marked ✅ IMPLEMENTED
- Gaps: none

### Implementation Evidence

- **Tests**: 90 passing (`bun run test`)
- **Build**: clean (`bun run build`)
- **Privacy**: 0 address fragments in `.next/server/app/index.html`
- **Live**: https://sanjit-dev.vercel.app
- **Domain**: aliased from `my-portfolio-*-super-max1.vercel.app` to `sanjit-dev.vercel.app`
- **Last deployment**: `6f67a8b` (2026-10-09)