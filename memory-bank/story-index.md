# Global Story Index

## Overview
- **Total stories**: 24
- **Generated**: 24
- **Implemented**: 24
- **Last updated**: 2026-10-11T17:45:00Z

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

### 002-leetcode-stats

- [x] **001-leetcode-data** (001-leetcode-stats-ui): Data layer — types, server-side fetcher, env config, normalization, stale-data handling — Must — ✅ IMPLEMENTED
- [x] **002-leetcode-route-and-nav** (001-leetcode-stats-ui): `/leetcode` route + main nav entry — Must — ✅ IMPLEMENTED
- [x] **003-leetcode-home-callout** (001-leetcode-stats-ui): Home-page callout card linking to `/leetcode` — Must — ✅ IMPLEMENTED
- [x] **004-kpi-cards** (001-leetcode-stats-ui): Four headline KPI tiles (Total Solved, Acceptance Rate, Global Ranking, Contribution Points) — Must — ✅ IMPLEMENTED
- [x] **005-difficulty-chart** (001-leetcode-stats-ui): Difficulty distribution donut/bar — Must — ✅ IMPLEMENTED
- [x] **006-topic-chart** (001-leetcode-stats-ui): Topic/tag distribution bar chart — Must — ✅ IMPLEMENTED
- [x] **007-activity-heatmap** (001-leetcode-stats-ui): 90-day GitHub-style activity heatmap — Must — ✅ IMPLEMENTED
- [x] **008-contest-timeline** (001-leetcode-stats-ui): Contest rating sparkline + badge + "Top X%" — Should — ✅ IMPLEMENTED

---

## Stories by Status

- **Planned**: 0
- **Generated**: 0
- **In Progress**: 0
- **Implemented**: 24 (16 from 001-portfolio-site + 8 from 002-leetcode-stats)

---

## Stories by Priority

- **Must**: 16 (9 from 001-portfolio-site + 7 from 002-leetcode-stats)
- **Should**: 6 (5 from 001-portfolio-site + 1 from 002-leetcode-stats)
- **Could**: 2 (from 001-portfolio-site)

---

## Post-Bolt Evolution (Beyond Original 3-Bolt Plan)

The original Inception plan scoped exactly 16 stories across 3 bolts, all of which are now implemented and live at **https://sanjit-dev.vercel.app**. After the 3 planned bolts completed, the user requested additional polish that went beyond the original scope. This work was done as free-form post-bolt evolution and is documented in Architecture Decision Records (ADRs):

| Enhancement | ADR | Commit | Date |
|-------------|-----|--------|------|
| Editorial redesign (typography + monogram + resume) | [ADR-001](decisions/adr-001-editorial-redesign.md) | `832cc82` | 2026-10-09 |
| Experience timeline + collapsible details | [ADR-002](decisions/adr-002-experience-timeline.md) | `c7ad81a` | 2026-10-09 |
| Real profile photo in hero | [ADR-003](decisions/adr-003-profile-photo.md) | `6f67a8b` | 2026-10-09 |
| Skills section pro (curated manifest + proficiency dots) | [ADR-004](decisions/adr-004-skills-section-pro.md) | pending | 2026-10-09 |
| Header menu curated to 4 primary + "More" dropdown (editorial) | [ADR-005](decisions/adr-005-header-menu-redesign.md) | pending | 2026-10-10 |
| Featured Projects section (markdown source, hero + compact) | [ADR-006](decisions/adr-006-featured-projects-section.md) | pending | 2026-10-10 |

If the project evolves further (e.g., a future "Projects" or "Blog" section), a new Inception cycle should formalize those as new intents + stories rather than continuing as free-form additions.

---

## Verification: 001-portfolio-ui

- Stories planned: 16
- Stories created: 16
- Stories implemented: 16
- Index updated: 16 marked ✅ IMPLEMENTED
- Gaps: none

### Implementation Evidence

- **Tests**: 216 passing (`bun run test`)
- **Build**: clean (`bun run build`)
- **Privacy**: 0 address fragments in `.next/server/app/index.html`
- **Live**: https://sanjit-dev.vercel.app
- **Domain**: aliased from `my-portfolio-*-super-max1.vercel.app` to `sanjit-dev.vercel.app`
- **Last deployment**: pending (ADR-006 work — featured Projects section)

---

## Verification: 001-leetcode-stats-ui

- Stories planned: 8
- Stories created: 8
- Index updated: 8 marked ✅ IMPLEMENTED
- Gaps: none
- Inception: complete
- Construction: complete (all 3 bolts done)
- Tests: 290 passing (12 new fetcher tests + 11 ContestTimeline + 7 KpiCards + 5 DifficultyChart + 6 TopicChart + 6 ActivityHeatmap + 2 nav-link + 4 home page + 241 pre-existing)
- Build: clean (6 static routes, /leetcode uses 1h ISR)
- Live: https://sanjit-dev.vercel.app/leetcode
