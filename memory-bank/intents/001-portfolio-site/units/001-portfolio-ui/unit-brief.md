---
unit: 001-portfolio-ui
intent: 001-portfolio-site
unit_type: frontend
default_bolt_type: simple-construction-bolt
phase: inception
status: ready
created: 2026-10-08T20:46:00Z
updated: 2026-10-08T20:52:00Z
---

# Unit Brief: 001-portfolio-ui (Portfolio Frontend)

## Purpose

Deliver a complete, production-ready single-page portfolio website that renders Sanjit Majumdar's CV data (`docs/LinkedIn_CV.json`) as a clean, accessible, mobile-responsive web page, deployed to Vercel. The site must be fast (Lighthouse ≥ 90), accessible (WCAG 2.1 AA), and easy to update by editing the JSON file and pushing to Git.

## Scope

### In Scope
- Next.js 15+ (App Router) project scaffolded with TypeScript strict mode
- Tailwind CSS v4 with custom theme tokens (colors, fonts)
- Build-time validation of `docs/LinkedIn_CV.json` via Zod
- Static rendering of every content section (Hero, About, Experience, Skills, Education, Certifications, Languages, Honors, Contact)
- Sticky top navigation with scroll-spy and mobile hamburger menu
- Light/dark theme toggle with `localStorage` persistence
- SEO meta tags, Open Graph, `robots.txt`, `sitemap.xml`, favicon
- Vercel deployment configuration (auto-detected, no `vercel.json` needed unless customizing)
- "Last updated" timestamp in footer (auto from build)

### Out of Scope
- Backend / API / database (none needed)
- Authentication / user accounts
- Contact form (no submission endpoint)
- Project gallery (data not in CV)
- Blog / CMS
- Analytics (can be added later)
- i18n / multi-language UI
- PDF resume download (future intent)
- Server-side rendering (SSG only)
- Custom domain setup (use default `vercel.app` for v1)

---

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Render Hero Section | Must |
| FR-2 | Render About / Summary Section | Must |
| FR-3 | Render Experience Section | Must |
| FR-4 | Render Skills Section | Must |
| FR-5 | Render Education Section | Should |
| FR-6 | Render Certifications Section | Should |
| FR-7 | Render Languages Section | Could |
| FR-8 | Render Honors & Awards Section | Could |
| FR-9 | Render Contact Section (privacy-aware) | Must |
| FR-10 | Sticky Top Nav with Scroll-Spy | Should |
| FR-11 | Dark/Light Theme Toggle | Should |
| FR-12 | Responsive Layout | Must |
| FR-13 | Build-Time Data Validation | Must |
| FR-14 | SEO Meta Tags | Should |
| FR-15 | Vercel Deployment Ready | Must |
| FR-16 | "Last Updated" Timestamp | Could |

**Coverage**: All 16 functional requirements are assigned to this single unit (100%).

---

## Domain Concepts

### Key Entities (from CV JSON)

| Entity | Description | Source Field |
|--------|-------------|--------------|
| `PersonalInfo` | Name, title, headline, contact channels | `personal_information` |
| `Summary` | Professional summary text | `summary` |
| `Experience` | Work history entry | `experience[]` |
| `Skill` | A named competency | `top_skills[]` |
| `Education` | Academic history entry | `education[]` |
| `Certification` | A professional certification | `certifications[]` |
| `Language` | Spoken language with proficiency | `languages[]` |
| `Honor` | Award or honor | `honors_awards[]` |

### Key Operations

| Operation | Description | Input | Output |
|-----------|-------------|-------|--------|
| `loadCvData()` | Load + validate `docs/LinkedIn_CV.json` at build time | File path | Typed `CvData` object (or build fails) |
| `getDisplayContact()` | Return only public contact fields (omit `address`) | `personal_information` | `PublicContact` subset |
| `formatDateRange(start, end)` | Human-readable "Jan 2026 – Present" | ISO date strings | Formatted string |
| `computeBuildTimestamp()` | Capture current time for "Last updated" | — | ISO 8601 string |

### Derived Data

- **Experience duration** is pre-computed in the CV JSON (`duration` field) — display as-is.
- **Skills count** and **certifications count** are not displayed in v1; could be added trivially later.

---

## Story Summary

| Metric | Count |
|--------|-------|
| Total Stories | 16 |
| Must Have | 7 (Hero, About, Experience, Skills, Contact, Responsive, Data validation, Deploy, Education, Certifications — 10 total) |
| Should Have | 4 (Nav, Theme, SEO, Education, Certifications — 5 total) |
| Could Have | 3 (Languages, Honors, Last-updated) |

Wait — recount after story creation below. The unit's story list is in the `stories/` folder; the table here is informational only.

### Stories (planned)

| Story ID | Title | Bolt | Priority |
|----------|-------|------|----------|
| 001-bootstrap | Scaffold Next.js + Tailwind + bun | Foundation | Must |
| 002-cv-data | CV type definitions + Zod schema + data loader | Foundation | Must |
| 003-shared-components | Reusable Section / Container / Heading / Tag / Card | Foundation | Must |
| 004-hero | Hero section | Sections | Must |
| 005-about | About / Summary section | Sections | Must |
| 006-experience | Experience list | Sections | Must |
| 007-skills | Skills tags | Sections | Must |
| 008-education | Education list | Sections | Should |
| 009-certifications | Certifications list | Sections | Should |
| 010-languages | Languages list | Sections | Could |
| 011-honors | Honors & Awards | Sections | Could |
| 012-contact | Contact section (privacy-aware) | Sections | Must |
| 013-nav | Sticky top nav with scroll-spy | Polish | Should |
| 014-theme | Light/dark theme toggle | Polish | Should |
| 015-seo | Meta tags + Open Graph + sitemap + robots + favicon | Polish | Should |
| 016-deploy | Vercel deployment verification + last-updated timestamp | Polish | Must |

---

## Dependencies

### Depends On
| Unit | Reason |
|------|--------|
| None | This is the only unit in the intent |

### Depended By
| Unit | Reason |
|------|--------|
| None | Standalone SPA |

### External Dependencies
| System | Purpose | Risk |
|--------|---------|------|
| Vercel | Hosting & CDN | Low |
| `next/font` (Inter, JetBrains Mono) | Typography | Low (self-hosted) |
| `lucide-react` | Icons | Low |
| `zod` | Runtime data validation | Low |
| `clsx` (or `tailwind-merge`) | Conditional class names | Low |

All `npm` packages are production-grade, well-maintained, tree-shakable, and have no transitive heavy dependencies.

---

## Technical Context

### Suggested Technology
Per `memory-bank/standards/tech-stack.md`:

- **Next.js 15+** with App Router
- **TypeScript** strict mode
- **Tailwind CSS v4** via official Next.js integration
- **Bun** for package management and scripts
- **Vitest** + **React Testing Library** for tests (critical paths only)
- **Prettier** + **ESLint** (`next/core-web-vitals` + `next/typescript`)

### Integration Points
| Integration | Type | Protocol |
|-------------|------|----------|
| `docs/LinkedIn_CV.json` | Data source | Build-time import (static) |
| Vercel | Hosting | Git-based deploy |

### Data Storage
| Data | Type | Volume | Retention |
|------|------|--------|-----------|
| `docs/LinkedIn_CV.json` | Static JSON | ~10 KB | Permanent (Git history) |

No database. No serverless functions. No storage. The site is **purely static output**.

---

## Constraints

- **Project-wide standards** (from `memory-bank/standards/`): All coding, UX, and tech-stack standards apply.
- **No address rendering**: The CV JSON includes a physical home address, but the rendering layer must filter it out. This is a privacy decision and must be enforced in `lib/cv-data.ts` (or a `getDisplayContact()` helper).
- **No `any` in TypeScript**: Use `unknown` + Zod-derived types.
- **Tailwind only**: No CSS-in-JS, no separate stylesheets beyond `app/globals.css` (which contains the Tailwind directives).
- **Build fails on bad data**: Zod validation must throw, not warn.
- **No runtime third-party scripts**: No analytics, no tag managers, no chat widgets.

---

## Success Criteria

### Functional
- [ ] `bun install && bun run build` succeeds locally
- [ ] `bun run dev` shows the site at `http://localhost:3000`
- [ ] All 16 FRs implemented and passing acceptance criteria
- [ ] Build fails when `docs/LinkedIn_CV.json` is malformed (test with a temporary bad file)
- [ ] Home address never appears in rendered output (verified by text search of built HTML)
- [ ] Site is deployable to Vercel via `git push` (no manual config)

### Non-Functional
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] FCP < 1.5s on simulated fast 3G
- [ ] CLS < 0.1
- [ ] JS bundle < 200KB gzipped
- [ ] WCAG 2.1 AA: contrast, keyboard nav, focus indicators, `prefers-reduced-motion`
- [ ] Works on Chrome, Firefox, Safari, Edge (latest 2)
- [ ] Works on iOS 16+ Safari and Android Chrome (latest 2)

### Quality
- [ ] TypeScript strict mode, 0 errors
- [ ] ESLint: 0 errors (warnings allowed)
- [ ] Prettier: formatted (no diff after `bun run format`)
- [ ] Vitest tests for `lib/cv-data.ts` and shared components pass
- [ ] All Vercel build previews succeed on PRs

---

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| `001-portfolio-ui-foundation` | Simple | 001, 002, 003 | Scaffold project, data layer, shared primitives |
| `001-portfolio-ui-sections` | Simple | 004, 005, 006, 007, 008, 009, 010, 011, 012 | Render every content section from CV JSON |
| `001-portfolio-ui-polish` | Simple | 013, 014, 015, 016 | Nav, theme, SEO, deploy verification |

**Bolt execution order**: foundation → sections → polish (sequential, each builds on the prior).

---

## Notes

- **No code generation yet** — this brief is the input for the Construction Agent's bolts. Construction will read this brief, plus the project standards, plus the requirements, and implement the actual code.
- **Data validation is the safety net** — every other story depends on `002-cv-data` succeeding first.
- **Privacy enforcement is non-negotiable** — the address filter must be in `lib/cv-data.ts` (or a typed helper), not scattered across components. Tests verify this.
- **Design system is hand-rolled** — no shadcn, no MUI, no Chakra. Tailwind utilities + a few primitives in `components/shared/`.
- **Theme toggle has subtle FOUC risk** — Construction must use a `<script>` injected in the root layout that reads `localStorage` BEFORE React hydrates, to avoid the dark/light flash. This is a known pattern; agent should know it.
- **Vercel auto-detection** — Bun + Next.js is detected automatically. `bun.lockb` must be committed. No `vercel.json` required unless we want to customize (e.g., custom headers, redirects). For v1, defaults are fine.
