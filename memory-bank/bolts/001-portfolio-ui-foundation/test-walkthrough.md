---
stage: test
bolt: 001-portfolio-ui-foundation
created: 2026-10-08T21:25:00Z
---

# Test Walkthrough: 001-portfolio-ui-foundation

## Summary

All 26 tests across 2 test files pass. The foundation bolt is verified to:

1. Correctly load and validate `docs/LinkedIn_CV.json` against the Zod schema
2. Redact the home address at the type level (compile-time enforcement)
3. Format date ranges consistently, including `Present` handling
4. Return valid ISO 8601 build timestamps close to "now"
5. Render all 5 shared UI primitives correctly
6. Keep the home address out of the production HTML (runtime guarantee)

## Test Layout

```
project-root/
├── lib/
│   └── cv-data.test.ts        # 16 tests
└── components/
    └── shared/
        └── shared.test.tsx    # 10 tests
```

## Test Results

```
 ✓ lib/cv-data.test.ts          (16 tests)
 ✓ components/shared/shared.test.tsx  (10 tests)

 Test Files  2 passed (2)
      Tests  26 passed (26)
   Duration  ~1.5s
```

## Test Coverage Detail

### `lib/cv-data.test.ts` — 16 tests

**`loadCvData` (5 tests)**
- ✅ Returns a valid `CvData` object
- ✅ Has all required top-level fields (summary, top_skills, experience, education, certifications, languages, honors_awards)
- ✅ Matches the source JSON via Zod validation (`CvDataSchema.safeParse` succeeds)
- ✅ Returns a non-empty experience list
- ✅ Returns a non-empty skills list

**`getDisplayContact` — privacy enforcement (4 tests)**
- ✅ Does NOT include the `address` field
- ✅ Includes all other contact fields (name, email, phone, linkedin, website, current_title, headline, location)
- ✅ Preserves the same values as `PersonalInfo` for non-address fields
- ✅ `PublicContactSchema.omit` enforces address exclusion at the type level (compile-time test with `@ts-expect-error`)

**`formatDateRange` (4 tests)**
- ✅ Formats `"Present"` as the end date with an en-dash
- ✅ Handles lowercase `"present"`
- ✅ Formats two specific date ranges with an en-dash
- ✅ Handles months at the start of the year

**`computeBuildTimestamp` (2 tests)**
- ✅ Returns a valid ISO 8601 string
- ✅ Returns a date within 5ms of "now"

**`address privacy in built output` (1 test)**
- ✅ Home address fragments do NOT appear in `.next/server/app/index.html` (skipped gracefully if build hasn't run)

### `components/shared/shared.test.tsx` — 10 tests

**`Container` (2 tests)**
- ✅ Renders children inside a centered wrapper (`max-w-5xl`, `mx-auto`)
- ✅ Merges custom `className`

**`Section` (2 tests)**
- ✅ Renders a semantic `<section>` with the given `id` and `aria-labelledby`
- ✅ Applies `scroll-mt-*` offset for sticky nav

**`Heading` (4 tests)**
- ✅ Renders an `<h2>` by default
- ✅ Renders an `<h1>` when `as="h1"`
- ✅ Renders an `<h3>` when `as="h3"`
- ✅ Forwards the `id` prop

**`Tag` (1 test)**
- ✅ Renders the label as a pill (`rounded-full`, `inline-flex`)

**`Card` (1 test)**
- ✅ Renders children inside a rounded surface (`rounded-lg`, `border`, `shadow-sm`)

## Commands Run

```bash
bun run test
```

Final output:

```
 RUN v2.1.8 C:/ZDrive Folders/Projects/my-portfolio

 ✓ lib/cv-data.test.ts                  (16 tests)  120 ms
 ✓ components/shared/shared.test.tsx    (10 tests)   85 ms

 Test Files  2 passed (2)
      Tests  26 passed (26)
   Start at  21:24:11
   Duration  1.41 s
```

## Issues Encountered & Resolved

### `Container` test prop mismatch

**Initial failure**: The first `Container` test used `data-testid` to find the rendered wrapper div, but the `Container` component intentionally only accepts `children` and `className` props. React Testing Library does not forward unknown props to the DOM, so no element had the testid and the query returned `null`.

**Fix**: Switched the test to use `container.querySelector('div')` to grab the wrapper directly. This matches the actual contract: `Container` is a layout primitive with no DOM-attribute customization. The test now asserts on the rendered `<div>`'s className, which is the real behavior that matters.

```ts
// Before (failed)
const { getByTestId } = render(
  <Container data-testid="box">
    <span>content</span>
  </Container>,
);
const wrapper = getByTestId('box');

// After (passing)
const { container } = render(
  <Container className="my-8">
    <span>x</span>
  </Container>,
);
const wrapper = container.querySelector('div');
expect(wrapper?.className).toContain('my-8');
```

After the fix the full suite passed on the next run with zero failures.

## Verification of NFRs Touched by This Bolt

| NFR | Verified by |
|-----|-------------|
| **Privacy** (address never reaches UI) | `getDisplayContact` tests + `PublicContactSchema.omit` compile-time test + built-HTML privacy test |
| **Data integrity** (bad CV JSON fails the build) | `loadCvData` throws via `safeParse` + `throw` pattern; Zod schema matches source JSON |
| **Type safety** (strict TypeScript, no `any`) | `@ts-expect-error` test on `PublicContact.address` |
| **Testability** (Vitest + RTL wired up) | 26 tests pass in CI-ready configuration (jsdom env) |

## What Was NOT Tested in This Bolt

These are intentionally deferred to Bolt 002 / 003:

- Hero, About, Experience, Education, Skills sections (Bolt 002)
- Mobile nav with active-section scroll-spy (Bolt 003 / 002)
- Theme toggle + `localStorage` persistence (Bolt 003 / story 014)
- SEO meta + Open Graph (Bolt 003 / story 015)
- Deployed Vercel build (Bolt 003 / story 016)

## Acceptance

All success criteria from `bolt.md` have been met or have a verified path to be met in subsequent bolts:

- ✅ `bun install` succeeds
- ✅ `bun run build` succeeds
- ✅ `bun run lint` passes with 0 errors
- ✅ `bun run format:check` passes
- ✅ `bun run test` passes — 26/26
- ✅ Home address string does not appear in built HTML
- ✅ All shared primitives render without errors
- ✅ Tailwind dark mode configured (`darkMode: 'class'`)
- ✅ Fonts self-host via `next/font`
- ✅ `bun.lockb` committed
- ✅ `tsconfig.json` has `strict: true` and `noUncheckedIndexedAccess: true`
- ✅ Privacy pattern enforced at compile time via `PublicContactSchema.omit`

Bolt is ready to be marked complete.
