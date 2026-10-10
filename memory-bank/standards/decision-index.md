---
last_updated: 2026-10-10T19:00:00Z
total_decisions: 10
adr_count: 6
---

# Decision Index

This index tracks all Architecture Decision Records (ADRs) created during Construction bolts.
It also tracks the high-level project decisions made during `project-init` (the standards).

Use this to find relevant prior decisions when working on related features.

## How to Use

**For Agents**: Scan the "Read when" fields below to identify decisions relevant to your current task. Before implementing new features, check if existing ADRs constrain or guide your approach. Load the full standard/ADR for matching entries.

**For Humans**: Browse decisions chronologically or search for keywords. Each entry links to the full document with complete context, alternatives considered, and consequences.

---

## Project-Init Decisions (Standards)

These are the foundational choices made when the project was initialized. They establish baseline constraints and conventions for all subsequent work.

### PI-001: Frontend-only architecture (no backend, no database)
- **Status**: accepted
- **Date**: 2026-10-08
- **Source**: `project.yaml`
- **Summary**: Project type set to `frontend-app`. CV data is static and sourced from `docs/LinkedIn_CV.json` at build time. No server, no API, no database.
- **Read when**: Anything that might suggest adding a backend, API, or data persistence — first confirm it's still required, then question whether the data could be static.
- **Implications**: Skip data-stack standard. Authentication not applicable. Vercel static hosting is sufficient (no serverless functions needed initially).

### PI-002: Next.js 15+ (App Router) as the framework
- **Status**: accepted
- **Date**: 2026-10-08
- **Source**: `standards/tech-stack.md`
- **Summary**: Chose Next.js App Router over plain Vite for the React framework — gives us file-system routing, image optimization, and first-class Vercel integration while keeping the option open to add server features later.
- **Read when**: Choosing where new code goes (App Router conventions), evaluating build performance, considering SSR vs SSG.
- **Implications**: Use Server Components by default; only mark `"use client"` when interactivity requires it. Routes live in `app/`.

### PI-003: Tailwind CSS v4 for styling (no UI library)
- **Status**: accepted
- **Date**: 2026-10-08
- **Source**: `standards/tech-stack.md`, `standards/ux-guide.md`
- **Summary**: Pure Tailwind utility classes; no shadcn/MUI/Chakra. Hand-rolled components in `components/shared/`.
- **Read when**: Adding any visual element, evaluating whether to add a UI dependency.
- **Implications**: No `@apply` in components. Custom theme values only via `tailwind.config.ts`. Icons via `lucide-react`.

### PI-004: Vercel as hosting target
- **Status**: accepted
- **Date**: 2026-10-08
- **Source**: `standards/tech-stack.md`
- **Summary**: Git-based deploys to Vercel. Push to main → production. Every PR gets a preview URL.
- **Read when**: Configuring env vars, build commands, deployment steps, custom domain setup.
- **Implications**: No Dockerfile needed. Vercel auto-detects Next.js. Bun is supported (commit `bun.lockb`).

### PI-005: Bun as package manager
- **Status**: accepted
- **Date**: 2026-10-08
- **Source**: `standards/tech-stack.md`
- **Summary**: Use `bun install` and `bun run <script>` for all package management and task running.
- **Read when**: Adding dependencies, running scripts, troubleshooting install issues.
- **Implications**: Commit `bun.lockb` (not `package-lock.json` or `yarn.lock`). Node.js still executes the app at runtime (Vercel handles this).

### PI-006: Strict TypeScript with no `any` (prefer `unknown`)
- **Status**: accepted
- **Date**: 2026-10-08
- **Source**: `standards/coding-standards.md`
- **Summary**: TypeScript strict mode. `any` is discouraged; use `unknown` + type guards. ESLint warns on `any` but doesn't block.
- **Read when**: Defining types for the CV JSON, handling external data, working with third-party libraries that have loose types.
- **Implications**: All CV fields have explicit types in `lib/cv-types.ts`. Build-time data validation catches schema drift.

### PI-007: Build-time data validation (fail fast, not silent)
- **Status**: accepted
- **Date**: 2026-10-08
- **Source**: `standards/coding-standards.md`
- **Summary**: If `docs/LinkedIn_CV.json` fails to load or doesn't match the expected schema, the build fails. A broken portfolio should never silently render empty.
- **Read when**: Modifying the data loading path, adding new CV fields, debugging build failures.
- **Implications**: Use Zod (or similar) for runtime validation in `lib/cv-data.ts`. TypeScript types are derived from the schema.

### PI-008: Minimal testing (critical paths only, no busywork)
- **Status**: accepted
- **Date**: 2026-10-08
- **Source**: `standards/coding-standards.md`
- **Summary**: Vitest tests for `lib/` utilities, data validation, and shared/reusable components. No tests for one-off display components.
- **Read when**: Deciding what to test, adding tests, evaluating CI test runtime.
- **Implications**: Coverage is intentionally not measured. Test files co-located with the code they test.

### PI-009: Dark mode via class strategy with localStorage persistence
- **Status**: accepted
- **Date**: 2026-10-08
- **Source**: `standards/ux-guide.md`
- **Summary**: Tailwind's `dark:` variant. User preference stored in `localStorage`. Default = system preference (`prefers-color-scheme`).
- **Read when**: Adding any visual element, modifying color choices, setting up theme toggle.
- **Implications**: All colors must be defined for both light and dark modes. Use `dark:` prefix in Tailwind classes.

### PI-010: WCAG 2.1 AA accessibility target
- **Status**: accepted
- **Date**: 2026-10-08
- **Source**: `standards/ux-guide.md`
- **Summary**: Industry-standard accessibility. Semantic HTML, focus states, color contrast, `prefers-reduced-motion` support.
- **Read when**: Adding any interactive element, choosing colors, adding animations.
- **Implications**: `eslint-plugin-jsx-a11y` is enabled. Manual a11y check in Chrome DevTools before deploys.

---

## Decisions

### ADR-001: Editorial redesign with Playfair Display + Inter typography and monogram branding
- **Status**: accepted
- **Date**: 2026-10-09
- **Bolt**: post-bolt-evolution (free-form, outside original 3-bolt plan)
- **Path**: `decisions/adr-001-editorial-redesign.md`
- **Commit**: `832cc82`
- **Summary**: After the planned 3 bolts shipped a working but plain portfolio, the user requested a more professional look. Adopted a Minimalism & Swiss Style redesign with Playfair Display headings, Inter body, a custom SM SVG monogram, and a client-side print-to-PDF resume download (no new deps).
- **Read when**: Adding new typography, choosing visual style, considering PDF libraries, designing a brand identity, working on the favicon.

### ADR-002: Experience section as an editorial vertical timeline with collapsible responsibilities
- **Status**: accepted
- **Date**: 2026-10-09
- **Bolt**: post-bolt-evolution (free-form, outside original 3-bolt plan)
- **Path**: `decisions/adr-002-experience-timeline.md`
- **Commit**: `c7ad81a`
- **Summary**: The original experience list was a wall of text (5 jobs × 7 responsibilities). Restructured it as a vertical timeline rail with a date column on desktop, plus a progressive-disclosure toggle that hides responsibilities by default — only the most recent role is open initially.
- **Read when**: Working on the experience section, considering collapsible UI patterns, designing lists with many items, implementing `aria-expanded` widgets.

### ADR-003: Add real profile photo to the hero with next/image and editorial backdrop ring
- **Status**: accepted
- **Date**: 2026-10-09
- **Bolt**: post-bolt-evolution (free-form, outside original 3-bolt plan)
- **Path**: `decisions/adr-003-profile-photo.md`
- **Commit**: `6f67a8b`
- **Summary**: Replaced the hero monogram with the real profile picture, served as responsive WebP via `next/image` with `priority`. Added an accent-tinted backdrop ring for visual lift. The monogram remains in TopNav, Footer, and the favicon.
- **Read when**: Adding or optimizing images, designing the hero, working on branding consistency, considering `next/image` vs `<img>`.

### ADR-004: Recruiter-grade Skills section with curated manifest, two-zone layout, proficiency dots, and years-of-use hints
- **Status**: accepted
- **Date**: 2026-10-09
- **Bolt**: post-bolt-evolution (free-form, outside original 3-bolt plan)
- **Path**: `decisions/adr-004-skills-section-pro.md`
- **Commit**: pending
- **Summary**: Replaced the LinkedIn-auto-suggested `cv.top_skills` (3 weak labels) with a curated manifest in `src/lib/skill-profile.ts`. Two-zone layout: 7 technical categories (chip + proficiency dot + years-of-use hint) and a "How I Work" zone (icon + context cards). Years hints computed from a custom `Month YYYY` date parser and category-level keyword anchors in `experience[]`.
- **Read when**: Working on the skills section, considering skill manifests, computing years-of-experience, designing chip-style UI, adding "How I work" / soft-skill content.

### ADR-005: Curated header menu with "More" dropdown (editorial typography)
- **Status**: accepted
- **Date**: 2026-10-10
- **Bolt**: post-bolt-evolution (free-form, outside original 3-bolt plan)
- **Path**: `decisions/adr-005-header-menu-redesign.md`
- **Commit**: pending
- **Summary**: The desktop TopNav was rendering 10 flat links and looked cluttered. Replaced it with a curated two-tier navigation: a primary row of 4 anchors (Home, Experience, Skills, Contact) and a "More" dropdown that holds Profile, Education, Certifications, Languages, Honors, and Recommendations. Editorial styling (uppercase, 0.14em letter-spacing, scale-in underline, Playfair wordmark) matches the rest of the site after ADR-001. `getNavLinks` now returns `{ primary, secondary }` and `getFlatNavLinks` preserves the old flat shape for the mobile panel.
- **Read when**: Modifying the TopNav, choosing what to expose in the header, designing dropdown menus, considering nav reorganization, evaluating menu/header layouts.

### ADR-006: Featured Projects section sourced from docs/projects.md with hero + compact layout
- **Status**: accepted
- **Date**: 2026-10-10
- **Bolt**: post-bolt-evolution (free-form, outside original 3-bolt plan)
- **Path**: `decisions/adr-006-featured-projects-section.md`
- **Commit**: pending
- **Summary**: The portfolio had no Projects section — the original Inception plan listed it as out-of-scope ("not in CV data — would require new data source"). For a senior engineer, Projects is the most important section (answers "what have you actually built?"). Source of truth moved from a `projects` field in `docs/LinkedIn_CV.json` (ADR-006 v1) to a dedicated `docs/projects.md` markdown file, parsed by a small custom parser in `src/lib/projects-md.ts` (no marked/unified dependency) and validated by Zod. Layout redesigned as hero + compact: first project renders as a full-width `HeroProjectCard`, the rest as `CompactProjectCard`s in a grid with a `+ N more` truncation. Section is the first content block after the Hero, hidden when empty, and Projects is promoted to the primary nav row (Skills demoted to the "More" dropdown).
- **Read when**: Adding or editing featured projects, choosing a project data source (markdown vs JSON), designing recruiter-friendly cards, evaluating section order or nav placement, considering a custom markdown parser.

<!-- ADRs from Construction bolts are appended below in reverse chronological order (newest first) -->
<!-- Format for each entry:

### ADR-{n}: {title}
- **Status**: {proposed|accepted|deprecated|superseded}
- **Date**: {YYYY-MM-DD}
- **Bolt**: {bolt-id} ({unit-name})
- **Path**: `bolts/{bolt-id}/adr-{n}-{slug}.md`
- **Summary**: {First sentence from Context}. {First sentence from Decision}.
- **Read when**: {Agent guidance - domain keywords and scenarios when this ADR is relevant}

-->
