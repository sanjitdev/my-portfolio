# Coding Standards

## Overview

Pragmatic, automated-enforced standards for a small static portfolio site. We favor convention over configuration — most rules are enforced by tools so AI-generated and human-written code look the same on first read.

## Code Formatting

**Tool**: Prettier
**Key Settings**:

- Print width: `100`
- Tab width: `2` spaces
- Use single quotes (`'`)
- Trailing commas: `all` (cleaner diffs, friendlier to ES2017+)
- Semicolons: `true`
- Arrow function parens: `avoid` (e.g., `x => x + 1`)

**Enforcement**: Prettier runs on `bun run format`. CI (Vercel build) does not run format check — keeps build fast. Format manually before committing.

**Prettier config** lives in `.prettierrc` at the project root.

## Linting

**Tool**: ESLint with `next/core-web-vitals` + `next/typescript`
**Base Config**: Next.js's built-in recommended config (extends `eslint-config-next`)
**Strictness**: Balanced — catches real bugs, doesn't bikeshed

**Key Rules**:

- `any` is **discouraged** but allowed in narrow cases (third-party types) — prefer `unknown` + type guards
- Unused variables: **warn** (not error) so dead code is visible but doesn't block
- Console statements: **warn** in production builds (Vercel will surface them)
- React Hooks rules: **error** (enforced by `next/core-web-vitals`)

**Enforcement**: `bun run lint` runs locally. CI build fails on lint errors.

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `userName`, `isActive` |
| Functions | camelCase | `getUserById` |
| Types / Interfaces | PascalCase | `PersonalInfo`, `Experience` |
| Constants | UPPER_SNAKE_CASE | `MAX_ITEMS` |
| React components | PascalCase | `HeroSection` |
| React hooks | camelCase with `use` prefix | `useScrollPosition` |
| File (components) | PascalCase, matches default export | `HeroSection.tsx` |
| File (utilities / lib) | kebab-case | `date-format.ts` |
| File (types) | kebab-case | `cv-types.ts` |
| Folder (features) | kebab-case | `hero/`, `experience/` |

**File-system routes** (Next.js App Router): `app/page.tsx`, `app/about/page.tsx`, etc. — lowercase as required by Next.js.

## File Organization

**Pattern**: **Type-based + feature co-location** (hybrid for a small app)

```text
.
├── app/                        # Next.js App Router (routes)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home (single-page portfolio)
│   ├── globals.css             # Tailwind directives
│   └── favicon.ico
├── components/                 # All React components, grouped by section
│   ├── hero/
│   │   ├── HeroSection.tsx
│   │   └── SocialLinks.tsx
│   ├── about/
│   ├── experience/
│   ├── skills/
│   ├── education/
│   └── shared/                 # Reusable (Button, Section, Container)
│       ├── Section.tsx
│       └── Container.tsx
├── lib/                        # Pure utilities, no React
│   ├── cv-types.ts             # TypeScript types matching CV JSON
│   └── cv-data.ts              # Loads + validates docs/LinkedIn_CV.json
├── docs/
│   └── LinkedIn_CV.json        # Source data (immutable)
├── public/                     # Static assets
├── .prettierrc
├── .eslintrc.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── bun.lockb
```

**Conventions**:

- **One component per file** (except tiny sub-components used only by the parent)
- **Default export** for page-level components; **named export** for sub-components
- **Co-located styles**: Tailwind classes inline on JSX; no separate `.module.css` unless absolutely necessary
- **No barrel files** (`index.ts` re-exports) — direct imports keep tree-shaking honest
- **Types live with code**, except shared CV types which live in `lib/cv-types.ts`

## Testing Strategy

**Framework**: Vitest (with React Testing Library for components)
**Coverage Target**: **Critical paths only** — this is a static site, not a complex app

**Test Types**:

| Type | Tool | When to Use |
|------|------|-------------|
| Unit | Vitest | `lib/` utility functions (date formatting, data transforms) |
| Component | Vitest + Testing Library | Shared components (`Section`, `Container`) — these are reused |
| Snapshot | Vitest | Optional, for static layout regression only |

**What we test**:

- ✅ `lib/cv-data.ts` — JSON loads, types are correct, edge cases (missing fields) handled
- ✅ `lib/` utility functions
- ✅ Shared/reusable components render without crashing

**What we DON'T test** (intentional — avoid busywork):

- ❌ One-off section components (Hero, Experience list, etc.) — they're display-only and trivial
- ❌ Pure styling snapshots
- ❌ Static text content

**Conventions**:

- Test file naming: `{ComponentName}.test.tsx` co-located with the component, or `*.test.ts` for utilities
- Test structure: Arrange-Act-Assert
- Test naming: `it('renders {expected behavior} when {condition}')`

## Error Handling

**Pattern**: Throw early, render error UI at the page level

- **Data loading** (`lib/cv-data.ts`): If `docs/LinkedIn_CV.json` fails to load or has wrong shape, **throw** at build time. This is intentional — a broken portfolio should fail the build, not silently render empty.
- **Component errors**: Use a single React error boundary at the root layout that displays a friendly fallback ("Something went wrong rendering this section").
- **No `try/catch` in components** unless handling user input (none in this static site).

**Custom errors**: None needed for a static site. Standard `Error` is fine.

## Logging

**Tool**: `console` (no external logger needed)
**Format**: Plain text (single-user dev workflow, not a server)

**Levels**:

| Level | Usage |
|-------|-------|
| `console.error` | Build-time data loading errors (these should fail the build anyway) |
| `console.warn` | Deprecated prop usage, missing optional CV fields |
| `console.log` | Avoid in committed code (ESLint warns) |

**Browser-side**: No client-side logging shipped. Browser DevTools is sufficient for debugging.

**Rules**:

- Never log PII (the CV does include contact info — only log it during local dev, never in production telemetry)
- No `console.log` in committed code
