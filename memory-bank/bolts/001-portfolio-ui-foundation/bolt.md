---
id: 001-portfolio-ui-foundation
unit: 001-portfolio-ui
intent: 001-portfolio-site
type: simple-construction-bolt
status: complete
stories:
  - 001-bootstrap
  - 002-cv-data
  - 003-shared-components
created: '2026-10-08T20:55:00Z'
started: '2026-10-08T21:00:00Z'
completed: '2026-10-08T15:07:27Z'
current_stage: null
stages_completed:
  - name: plan
    completed: '2026-10-08T21:05:00Z'
    artifact: implementation-plan.md
  - name: implement
    completed: '2026-10-08T21:15:00Z'
    artifact: implementation-walkthrough.md
  - name: test
    completed: '2026-10-08T21:25:00Z'
    artifact: test-walkthrough.md
requires_bolts: []
enables_bolts:
  - 002-portfolio-ui-sections
requires_units: []
blocks: false
complexity:
  avg_complexity: 2
  avg_uncertainty: 1
  max_dependencies: 1
  testing_scope: 2
---

# Bolt: 001-portfolio-ui-foundation

## Overview

Establish the project foundation: scaffold a Next.js + Tailwind + bun application, build the typed CV data layer with Zod validation, and create reusable UI primitives (Section, Container, Heading, Tag, Card) that every content section will use.

This is the first of three bolts for the portfolio site. Nothing renders user-facing content yet — but after this bolt, the project must build, lint, test, and the data layer must validate `docs/LinkedIn_CV.json` correctly.

## Objective

Stand up a production-grade Next.js project foundation that:

1. Builds cleanly with `bun install && bun run build`
2. Lints and formats without errors
3. Validates the CV JSON at build time and fails loudly on bad data
4. Exposes typed, address-redacted data to all subsequent bolts
5. Provides consistent Section/Container/Heading/Tag/Card primitives

## Stories Included

- **001-bootstrap** (Must): Scaffold Next.js + Tailwind + bun + Vercel config
- **002-cv-data** (Must): CV type definitions + Zod schema + data loader with build-time failure
- **003-shared-components** (Must): Reusable Section / Container / Heading / Tag / Card primitives

## Bolt Type

**Type**: Simple Construction Bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

This is appropriate because the work is UI/scaffolding with no complex domain modeling — well within the 3-stage simple bolt pattern (Plan → Implement → Test).

## Stages

- [ ] **1. plan**: Pending → `implementation-plan.md` (define approach for each story, integration points, file structure)
- [ ] **2. implement**: Pending → scaffold Next.js project, create `lib/cv-types.ts`, `lib/cv-data.ts`, `components/shared/*`
- [x] **3. test**: Complete → `test-walkthrough.md` (26/26 tests passing)

## Dependencies

### Requires
- None (first bolt)

### Enables
- 002-portfolio-ui-sections (needs the data layer and shared primitives)

## Success Criteria

- [ ] `bun install` succeeds
- [ ] `bun run build` succeeds with no errors
- [ ] `bun run dev` starts the dev server and shows a placeholder page
- [ ] `bun run lint` passes with 0 errors
- [ ] `bun run format:check` passes (or no diff after `bun run format`)
- [ ] `bun run test` passes — tests cover: loadCvData success, loadCvData failure on bad JSON, getDisplayContact redacts address, formatDateRange formats "Present" correctly
- [ ] Build fails with a clear Zod error if `docs/LinkedIn_CV.json` is intentionally corrupted
- [ ] Home address string does not appear in any built HTML (smoke test)
- [ ] All shared primitives render without errors when imported in `app/page.tsx`
- [ ] Tailwind dark mode is configured (`darkMode: 'class'`)
- [ ] Fonts (Inter, JetBrains Mono) self-host via `next/font`
- [ ] `bun.lockb` is committed

## Notes

### FOUC Prevention (Critical for 014-theme, design the slot now)
The root layout should reserve space for the no-FOUC script that 014-theme will inject. Construction agent should put a comment in `app/layout.tsx` like:
```html
{/* Theme bootstrap script will be injected here by 014-theme */}
```
Or just leave the layout minimal — the theme bolt can add the script later.

### Strict TypeScript from Day 1
Per `standards/coding-standards.md`, `tsconfig.json` must have `"strict": true` and `"noUncheckedIndexedAccess": true`. The data layer (`lib/cv-data.ts`) MUST use Zod-derived types, not hand-written ones that could drift from the schema.

### Vercel Auto-Detection
No `vercel.json` is needed. Vercel will:
- Detect Next.js
- Detect bun (via `bun.lockb`)
- Run `bun install && bun run build`
- Serve the static output from the CDN

### Privacy Pattern (Critical)
The `PublicContact` type (in `lib/cv-types.ts`) must NOT include the `address` field. This makes the privacy guarantee **compile-time enforced**, not just a code review check.

```ts
// In lib/cv-types.ts
export const PublicContactSchema = PersonalInfoSchema.omit({ address: true })
export type PublicContact = z.infer<typeof PublicContactSchema>

export function getDisplayContact(cv: CvData): PublicContact {
  return PublicContactSchema.parse(cv.personal_information)
}
```

### Test Layout
```
lib/
├── cv-data.test.ts    # Tests for loadCvData, getDisplayContact, formatDateRange, computeBuildTimestamp
├── cv-types.ts
└── cv-data.ts
```

Use `bun test` (Vitest) with React Testing Library for any component smoke tests in `components/shared/`.