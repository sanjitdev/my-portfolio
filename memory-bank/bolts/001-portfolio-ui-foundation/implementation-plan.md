---
stage: plan
bolt: 001-portfolio-ui-foundation
created: 2026-10-08T21:00:00Z
---

## Implementation Plan: 001-portfolio-ui-foundation

### Objective

Stand up the production-grade foundation for the portfolio site. By the end of this bolt:

1. The Next.js + Tailwind + bun project builds, lints, and tests cleanly
2. The CV data layer validates `docs/LinkedIn_CV.json` at build time and produces typed, address-redacted data
3. The shared UI primitives (Section, Container, Heading, Tag, Card) exist and render without errors
4. Tailwind dark mode is configured (`darkMode: 'class'`) for the theme toggle in Bolt 003
5. The `bun.lockb` is committed for Vercel auto-detection

### Stories in Scope

- **001-bootstrap** (Must): Next.js + Tailwind + bun scaffold with TypeScript strict, ESLint, Prettier
- **002-cv-data** (Must): Zod schema, typed loader, address-redacting `getDisplayContact()`, `formatDateRange()`, `computeBuildTimestamp()`
- **003-shared-components** (Must): `Container`, `Section`, `Heading`, `Tag`, `Card` primitives

### Deliverables

#### From Story 001 (bootstrap)
- `package.json` with scripts: `dev`, `build`, `start`, `lint`, `format`, `format:check`, `test`
- `bun.lockb` (committed)
- `tsconfig.json` with `strict: true` and `noUncheckedIndexedAccess: true`
- `next.config.ts` (TypeScript config)
- `tailwind.config.ts` with custom theme tokens (slate/sky colors)
- `postcss.config.mjs` (Next.js Tailwind v4 uses PostCSS)
- `.prettierrc` with settings from `standards/coding-standards.md`
- `.eslintrc.json` extending `next/core-web-vitals` and `next/typescript`
- `.gitignore` (includes `.next/`, `node_modules/`; **commits** `bun.lockb`)
- `app/layout.tsx` with font setup (Inter, JetBrains Mono) and minimal placeholder
- `app/page.tsx` showing "Hello, Portfolio" placeholder
- `app/globals.css` with Tailwind directives
- `vitest.config.ts` for unit tests

#### From Story 002 (cv-data)
- `lib/cv-types.ts` — Zod schemas + TypeScript types
- `lib/cv-data.ts` — `loadCvData()`, `getDisplayContact()`, `formatDateRange()`, `computeBuildTimestamp()`
- `lib/cv-data.test.ts` — Vitest tests for all four functions
- `vitest.config.ts` configured (or updated) to handle `@/` path alias

#### From Story 003 (shared-components)
- `components/shared/Container.tsx`
- `components/shared/Section.tsx`
- `components/shared/Heading.tsx`
- `components/shared/Tag.tsx`
- `components/shared/Card.tsx`
- All components are **Server Components** (no `"use client"`)
- All accept `className` prop, merge with `clsx` or `tailwind-merge`
- All respect dark mode via Tailwind `dark:` variants

### Dependencies

#### External (npm) packages
| Package | Version | Why |
|---------|---------|-----|
| `next` | 15.x | Framework |
| `react` | 19.x (paired with Next 15) | UI library |
| `react-dom` | 19.x | React DOM renderer |
| `typescript` | 5.x | Type safety |
| `tailwindcss` | 4.x | Styling |
| `@tailwindcss/postcss` | 4.x | PostCSS plugin for Tailwind v4 |
| `zod` | 3.x | Runtime validation |
| `clsx` | 2.x | Conditional class names |
| `lucide-react` | latest | Icons (used in later bolts too) |
| `vitest` | 2.x | Test runner |
| `@vitejs/plugin-react` | latest | React plugin for Vitest |
| `@testing-library/react` | latest | Component testing |
| `@testing-library/jest-dom` | latest | DOM matchers |
| `jsdom` | latest | DOM environment for tests |
| `eslint`, `eslint-config-next` | latest | Linting |
| `prettier` | 3.x | Formatting |
| `@types/node`, `@types/react`, `@types/react-dom` | latest | Type definitions |

**Note**: Versions will be resolved by `bun install` to current latest stable at install time.

#### Inter-bolt
- **None** — this is the first bolt

#### Inter-unit
- **None** — only one unit in this intent

### Technical Approach

#### Project Scaffold Strategy
Use `bun create next-app` with these flags (or manual scaffold if the CLI is non-interactive in this environment):
- TypeScript: yes
- ESLint: yes
- Tailwind: yes
- App Router: yes
- `src/` directory: **no** (we want `app/` at root, per the unit-brief)
- Customize import alias: yes (`@/*`)

If `bun create next-app` is unavailable in the sandbox, fall back to a manual scaffold by:
1. Creating `package.json` directly with the right dependencies and scripts
2. Writing `next.config.ts`, `tsconfig.json`, `tailwind.config.ts` by hand
3. Writing the minimal `app/layout.tsx` and `app/page.tsx`

**The manual scaffold is the preferred approach here** because `bun create next-app` typically runs interactively and is unreliable in automated contexts.

#### Strict TypeScript Config
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "bundler",
    "module": "esnext",
    "target": "es2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  }
}
```

#### CV Data Schema (Zod)
```ts
// lib/cv-types.ts
import { z } from 'zod'

export const PersonalInfoSchema = z.object({
  name: z.string().min(1),
  current_title: z.string().min(1),
  headline: z.string().min(1),
  location: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string(),  // present in JSON but filtered out
  linkedin: z.string().min(1),
  website: z.string().min(1),
})

export const PublicContactSchema = PersonalInfoSchema.omit({ address: true })
export type PublicContact = z.infer<typeof PublicContactSchema>

export const ExperienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  duration: z.string().min(1),
  location: z.string().min(1),
  responsibilities: z.array(z.string().min(1)),
})

export const EducationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().optional(),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

export const LanguageSchema = z.object({
  language: z.string().min(1),
  proficiency: z.string().min(1),
})

export const CvDataSchema = z.object({
  personal_information: PersonalInfoSchema,
  summary: z.string().min(1),
  top_skills: z.array(z.string().min(1)),
  languages: z.array(LanguageSchema),
  certifications: z.array(z.string().min(1)),
  honors_awards: z.array(z.string().min(1)),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
})

export type CvData = z.infer<typeof CvDataSchema>
```

#### Data Loader (lib/cv-data.ts)
```ts
import cvDataRaw from '@/../docs/LinkedIn_CV.json'
import {
  CvDataSchema,
  type CvData,
  PublicContactSchema,
  type PublicContact,
} from './cv-types'

// Validates at module load time. If the JSON is malformed, this throws
// and the Next.js build fails immediately.
const parsed = CvDataSchema.safeParse(cvDataRaw)
if (!parsed.success) {
  throw new Error(
    `docs/LinkedIn_CV.json failed schema validation:\n${JSON.stringify(parsed.error.format(), null, 2)}`
  )
}

const cvData: CvData = parsed.data

export function loadCvData(): CvData {
  return cvData
}

export function getDisplayContact(cv: CvData): PublicContact {
  return PublicContactSchema.parse(cv.personal_information)
}

export function formatDateRange(start: string, end: string): string {
  if (end === 'Present' || end === 'present') {
    return `${start} – Present`
  }
  return `${start} – ${end}`
}

export function computeBuildTimestamp(): string {
  return new Date().toISOString()
}
```

**Note on import path**: `@/../docs/LinkedIn_CV.json` works because `tsconfig.json` paths map `@/*` to `./*`, so `@/` is the project root. From there, `../` doesn't make sense — it should be just `@/docs/LinkedIn_CV.json`. Let me reconsider.

Actually, with `"paths": { "@/*": ["./*"] }`, `@/docs/LinkedIn_CV.json` resolves to `./docs/LinkedIn_CV.json` which is the project root + `docs/`. That's what we want. The import statement should be:
```ts
import cvDataRaw from '@/docs/LinkedIn_CV.json'
```

**However**, TypeScript/Next.js with `resolveJsonModule: true` will statically import the JSON. Combined with the Zod validation, the JSON shape mismatch will be caught at compile time (TS) and runtime (Zod), belt-and-suspenders.

#### Shared Component Contracts

```tsx
// Container.tsx — Server Component
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('max-w-5xl mx-auto px-6', className)}>{children}</div>
}

// Section.tsx — Server Component
export function Section({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={clsx('py-16 sm:py-20 scroll-mt-16', className)}>
      {children}
    </section>
  )
}

// Heading.tsx — Server Component
export function Heading({ as: Tag = 'h2', children, className }: { as?: 'h1' | 'h2' | 'h3'; children: React.ReactNode; className?: string }) {
  return (
    <Tag className={clsx('text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-8', className)}>
      {children}
    </Tag>
  )
}

// Tag.tsx — Server Component (for skills)
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300', className)}>
      {children}
    </span>
  )
}

// Card.tsx — Server Component
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm', className)}>
      {children}
    </div>
  )
}
```

### Acceptance Criteria

A checklist that maps directly to the bolt's `bolt.md` Success Criteria:

- [ ] `bun install` succeeds with no errors
- [ ] `bun.lockb` exists and is committed
- [ ] `bun run dev` starts the dev server on `http://localhost:3000` and shows the placeholder page
- [ ] `bun run build` succeeds and produces a `.next/` directory
- [ ] `bun run lint` passes with 0 errors
- [ ] `bun run format:check` passes (or `bun run format` produces no diff)
- [ ] `bun run test` runs and all tests pass
- [ ] TypeScript strict mode is enabled; intentional type errors fail the build
- [ ] Tailwind dark mode is configured with `darkMode: 'class'`
- [ ] `docs/LinkedIn_CV.json` validation:
  - [ ] Valid JSON produces a typed `CvData` object on `loadCvData()`
  - [ ] Malformed JSON (missing field) makes the build fail
  - [ ] Malformed JSON (wrong type) makes the build fail
  - [ ] `getDisplayContact()` does NOT include the `address` field
- [ ] All 5 shared components (Container, Section, Heading, Tag, Card) render without errors
- [ ] All 5 shared components accept and merge a `className` prop
- [ ] All 5 shared components work in dark mode (have `dark:` variants)
- [ ] Address privacy test: searching built `.next/server/app/index.html` for the address string returns 0 matches
- [ ] `package.json` includes all scripts: `dev`, `build`, `start`, `lint`, `format`, `format:check`, `test`
- [ ] `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `vitest.config.ts`, `.prettierrc`, `.eslintrc.json`, `.gitignore` all exist

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| `bun create next-app` is interactive in this environment | Use **manual scaffold** — create `package.json` and config files by hand |
| Next.js 15 vs 14 API differences (e.g., async `params` in App Router) | Use the official Next.js 15 documentation; `next.config.ts` instead of `.js` |
| Tailwind v4 vs v3 config differences | Tailwind v4 uses `@tailwindcss/postcss` and CSS-first config; follow Next.js 15 official Tailwind v4 docs |
| JSON import path resolution | Use `@/docs/LinkedIn_CV.json` (with `@/*` mapped to `./*`) — not `@/../docs/...` |
| `next/font` requires Google Fonts at build time | Sandbox might not have internet access; if `next/font/google` fails, fall back to system fonts via Tailwind's default `font-sans` |
| Zod error messages are too verbose | Customize the error to show the most relevant field path |

### Open Questions (None — all resolved during Inception)

- ✅ Address hidden: `PublicContactSchema.omit({ address: true })`
- ✅ Strict TypeScript: `"strict": true` + `"noUncheckedIndexedAccess": true`
- ✅ Build fails on bad JSON: `safeParse` + `throw`
- ✅ Tailwind v4 + dark mode: `darkMode: 'class'`
- ✅ Vitest with React Testing Library: configured in `vitest.config.ts`
