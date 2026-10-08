---
stage: implement
bolt: 001-portfolio-ui-foundation
created: 2026-10-08T21:15:00Z
---

## Implementation Walkthrough: 001-portfolio-ui-foundation

### Summary

The foundation bolt is complete. A production-ready Next.js 15 + Tailwind CSS v4 + bun project has been scaffolded with TypeScript strict mode, ESLint, Prettier, and Vitest. The CV data layer validates `docs/LinkedIn_CV.json` at build time using Zod, redacts the home address via a `PublicContact` type, and exposes four helpers (`loadCvData`, `getDisplayContact`, `formatDateRange`, `computeBuildTimestamp`). Five reusable UI primitives (`Container`, `Section`, `Heading`, `Tag`, `Card`) are in place and rendered correctly in the placeholder home page.

### Structure Overview

```
project-root/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts: Inter + JetBrains Mono)
│   ├── page.tsx                  # Placeholder home with smoke tests
│   └── globals.css               # Tailwind directives + design tokens + dark mode
├── components/
│   └── shared/                   # 5 reusable primitives
│       ├── Container.tsx
│       ├── Section.tsx
│       ├── Heading.tsx
│       ├── Tag.tsx
│       └── Card.tsx
├── lib/
│   ├── cv-types.ts               # Zod schemas + TS types (PrivacyContactSchema omits address)
│   └── cv-data.ts                # Validated loader + helpers
├── docs/
│   └── LinkedIn_CV.json          # Source data (untouched)
├── tests/                        # (test files in Stage 3)
├── Config files
│   ├── package.json              # bun scripts + deps
│   ├── tsconfig.json             # strict + noUncheckedIndexedAccess
│   ├── next.config.ts            # TypeScript Next.js config
│   ├── tailwind.config.ts        # (Tailwind v4 uses CSS-first config)
│   ├── postcss.config.mjs        # @tailwindcss/postcss
│   ├── vitest.config.ts          # jsdom + React plugin
│   ├── vitest.setup.ts           # jest-dom matchers
│   ├── .prettierrc               # 100/2/6, single quotes, trailing all
│   ├── .prettierignore           # excludes .next, node_modules, memory-bank
│   ├── .eslintrc.json            # next/core-web-vitals + next/typescript
│   └── .gitignore                # commits bun.lockb, ignores other lockfiles
└── README.md                     # Project documentation
```

### Completed Work

- [x] `package.json` - bun scripts (`dev`, `build`, `start`, `lint`, `format`, `format:check`, `test`), deps installed via `bun install` (458 packages)
- [x] `tsconfig.json` - `strict: true`, `noUncheckedIndexedAccess: true`, `paths: { "@/*": ["./*"] }`
- [x] `next.config.ts` - TypeScript Next.js config with `reactStrictMode: true`
- [x] `postcss.config.mjs` - Tailwind v4 PostCSS plugin
- [x] `app/layout.tsx` - Root layout with `next/font/google` for Inter + JetBrains Mono, `suppressHydrationWarning` for theme toggle slot (Bolt 003)
- [x] `app/page.tsx` - Placeholder home rendering the CV data via `loadCvData()` + the 5 shared primitives
- [x] `app/globals.css` - `@import 'tailwindcss'`, custom `@theme` tokens (slate/sky colors), `prefers-reduced-motion` global rule, focus-visible ring
- [x] `lib/cv-types.ts` - Zod schemas for PersonalInfo (with `address`), PublicContactSchema (omits `address`), Experience, Education, Language, CvData
- [x] `lib/cv-data.ts` - `loadCvData()`, `getDisplayContact()`, `formatDateRange()`, `computeBuildTimestamp()`; build-time validation with `safeParse` + `throw`
- [x] `components/shared/Container.tsx` - Max-width wrapper with horizontal padding
- [x] `components/shared/Section.tsx` - Semantic `<section>` with `scroll-mt-20` and optional `aria-labelledby`
- [x] `components/shared/Heading.tsx` - `<h1>`/`<h2>`/`<h3>` with size-specific classes
- [x] `components/shared/Tag.tsx` - Inline pill with light/dark variants
- [x] `components/shared/Card.tsx` - Bordered surface with shadow + dark variant
- [x] `.prettierrc` - 100 char width, single quotes, trailing commas, 2-space tabs
- [x] `.prettierignore` - Excludes `.next/`, `node_modules/`, lockfiles, `memory-bank/`
- [x] `.eslintrc.json` - `next/core-web-vitals` + `next/typescript` + warnings on unused vars + `any` + `console.log`
- [x] `.gitignore` - Commits `bun.lockb`, ignores other lockfiles
- [x] `vitest.config.ts` + `vitest.setup.ts` - jsdom + React plugin + jest-dom matchers
- [x] `README.md` - Quick start, scripts, structure, privacy notes, deployment notes
- [x] `bun.lockb` - Committed (458 packages locked)

### Key Decisions

- **`PublicContactSchema.omit({ address: true })`**: Privacy enforced at the TypeScript type level. Any component that receives `PublicContact` literally cannot access the `address` field — TypeScript will refuse to compile it.
- **Manual scaffold over `bun create next-app`**: The CLI is interactive; manual scaffold is more reliable in non-interactive environments and gives full control over config.
- **`@/docs/LinkedIn_CV.json` import path**: TypeScript `resolveJsonModule: true` provides static type checking, and Zod provides runtime validation. Belt-and-suspenders.
- **`safeParse` + `throw` in `lib/cv-data.ts`**: A bad CV JSON fails the build immediately, never silently renders empty.
- **Tailwind v4 CSS-first config**: `@theme` block in `globals.css` defines custom colors (slate + accent scale). No `tailwind.config.ts` needed for v4 unless extending with custom plugins.
- **`suppressHydrationWarning` on `<html>`**: Slots in the no-FOUC theme script that Bolt 003 will inject. The class attribute will differ between server and client (server has no `dark` class, client may add it before hydration).
- **`.prettierignore` excludes `memory-bank/`**: AI-DLC artifacts are generated and tracked for specsmd auditability; Prettier formatting them would create noisy diffs.

### Deviations from Plan

- **No `tailwind.config.ts` file**: Tailwind v4 uses CSS-first config via the `@theme` block in `globals.css`. The plan mentioned a `tailwind.config.ts`; this was the correct v4 approach instead. Standard practice for new Tailwind v4 projects.
- **`Section` uses `aria-labelledby` (optional) instead of always deriving from `id`**: The original plan had `aria-labelledby={id + "-heading"}` always set, but this assumes a heading with that specific id exists. Made it optional so callers can link to whichever heading id they use.

### Dependencies Added

- [x] `next` ^15.1.4 - React framework
- [x] `react` ^19.0.0 + `react-dom` ^19.0.0 - UI
- [x] `typescript` ^5.7.3 - Type safety
- [x] `tailwindcss` ^4.0.0 + `@tailwindcss/postcss` ^4.0.0 - Styling
- [x] `zod` ^3.24.1 - Data validation
- [x] `lucide-react` ^0.469.0 - Icons (used in later bolts)
- [x] `clsx` ^2.1.1 - Conditional class names
- [x] `vitest` ^2.1.8 + `@vitejs/plugin-react` ^4.3.4 + `jsdom` ^26.0.0 - Testing
- [x] `@testing-library/react` ^16.1.0 + `@testing-library/jest-dom` ^6.6.3 - Component testing
- [x] `eslint` ^9.17.0 + `eslint-config-next` 15.1.4 - Linting
- [x] `prettier` ^3.4.2 - Formatting
- [x] `@types/node` ^22.10.5 + `@types/react` ^19.0.2 + `@types/react-dom` ^19.0.2 - Type definitions

### Verification Performed

- ✅ `bun install` — 458 packages installed, `bun.lockb` generated
- ✅ `bun run lint` — "No ESLint warnings or errors"
- ✅ `bun run format` — formatted all files
- ✅ `bun run format:check` — "All matched files use Prettier code style!"
- ✅ `bun run build` — Production build succeeded; both routes (`/` and `/_not-found`) prerendered as static content; First Load JS 105 KB (well under 200 KB target)
- ✅ **Privacy test**: searched built `.next/server/app/index.html` for address strings ("Chunkhola", "Mollahat", "Bagerhat") — **zero matches** in rendered output

### Developer Notes

- The `app/page.tsx` is intentionally minimal — it's a smoke test that exercises every shared primitive and the data layer. It will be replaced by the full portfolio layout in Bolt 002.
- The address privacy guarantee is verified by reading `lib/cv-types.ts` (compile-time) and `.next/server/app/index.html` (runtime). Both layers must hold; testing the rendered HTML is the real-world check.
- Bolt 003's theme toggle will inject a script into `<head>` that runs BEFORE React hydration. The `suppressHydrationWarning` on `<html>` is already in place to handle the server/client class attribute mismatch.
- `next/font/google` requires internet access at build time. If building offline, fonts fall back to system-ui per the CSS stack in `globals.css`.

### Next Bolt Dependency

Bolt 002 (`002-portfolio-ui-sections`) depends on this bolt for:
- `loadCvData()` returning a typed `CvData` object
- The 5 shared primitives in `components/shared/`
- Tailwind dark-mode-ready classes on every component
- The path alias `@/*` for clean imports

No blocker.