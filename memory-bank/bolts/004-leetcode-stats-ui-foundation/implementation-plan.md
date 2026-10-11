---
stage: plan
bolt: 004-leetcode-stats-ui-foundation
created: 2026-10-11T16:10:00Z
---

## Implementation Plan: 001-leetcode-stats-ui (Foundation Bolt)

### Objective

Establish the data layer, route, nav entry, and home-page callout for the LeetCode stats feature. After this bolt, `/leetcode` is reachable, navigable from both the nav and the home page, and renders the typed `LeetCodeFetchResult` payload — even if the visualizations (KPI cards, charts, heatmap) are still placeholders that arrive in Bolt 005.

### Stories Covered

- **001-leetcode-data** (Must) — Data layer: types, server-side fetcher, env config, normalization, stale-state fallback
- **002-leetcode-route-and-nav** (Must) — `/leetcode` route + main nav entry + loading skeleton
- **003-leetcode-home-callout** (Must) — Home-page callout card linking to `/leetcode`

### Deliverables

#### Data layer (`src/lib/leetcode/`)

- `types.ts` — `LeetCodeProfile`, `LeetCodeTopicStat`, `LeetCodeActivity`, `LeetCodeContest`, `LeetCodeFetchResult` (all Zod-derived)
- `schemas.ts` — Zod schemas for the above
- `fetcher.ts` — `getLeetCodePageData()`: server-side fetch with last-known-good fallback and `isStale` flag
- `fetcher.test.ts` — Vitest unit tests for normalization and graceful failure

#### Route + nav (`src/app/leetcode/`)

- `page.tsx` — Server Component, `export const revalidate = 3600`. Renders a minimal placeholder layout (full visualizations come in Bolt 005). Includes the section heading, stale banner, and "View on LeetCode" CTA so the page is end-to-end testable.
- `loading.tsx` — Skeleton placeholder (server-side; matches the eventual visualization grid)

#### Nav integration (`src/components/nav/`)

- `navLinks.ts` — Add a new primary entry: `{ id: 'leetcode', label: 'LeetCode', href: '/leetcode' }`. Update `NavLink` interface to optionally include `href` (route links) in addition to `id` (anchor links).
- `TopNav.tsx` — When a link has `href`, render a real `<Link>` (or `<a>`) instead of a scroll-spy anchor. Use `usePathname()` to set the active state when the current path matches `href`. This is the **minimum viable route-aware nav** without rewriting the existing scroll-spy logic.
- `navLinks.test.ts` — Update tests to cover the new `LeetCode` entry

#### Home callout (`src/components/home/leetcode-callout.tsx`)

- A teaser card placed between `SkillsSection` and `EducationSection` in `src/app/page.tsx`. Shows: eyebrow ("Problem solving"), a single headline number (`profile.totalSolved` problems solved), short blurb, and a "View full stats →" link to `/leetcode`.
- Card visually distinct from generic sections (uses `Card.tsx` + accent border)
- Renders the **last-known-good** number from the fetcher; if the fetcher fails on the home page, shows a neutral link without a number (no error, no zero)
- Fetcher is invoked server-side on the home page; result is passed as a prop (the home page is `force-static` but the leetcode fetcher call inside is allowed to fail without breaking the build)

#### Sitemap + metadata (`src/app/sitemap.ts`)

- Add `/leetcode` to the sitemap with the same `lastModified` as the home page
- `src/app/leetcode/page.tsx` exports route-specific `metadata` (title, description, OpenGraph)

#### Config

- `.env.example` — Document `LEETCODE_USERNAME=sanjit12` (the default; users can override)

#### Docs

- `docs/leetcode.md` — Brief developer doc: env var, data source, ISR cadence, how to force a revalidation. (May be slimmed down in this bolt and fleshed out in Bolt 006; the file must exist.)

### Dependencies

#### External (new packages)

- **`alfa-leetcode-api`** (preferred) — actively maintained community wrapper, returns JSON. If the package fails to install or is deprecated at install time, fall back to `leetcode-query`. If both fail, fall back to a hand-rolled GraphQL client using `fetch` against `https://leetcode.com/graphql`.
- The fetcher's **interface contract** is the same regardless of which library is chosen:
  ```ts
  type RawLeetCodeData = {
    profile: { totalSolved, easySolved, mediumSolved, hardSolved, acceptanceRate, ranking, contributionPoints };
    topicStats: { tagName, tagSlug, solvedCount }[];
    activity: { date, count }[];          // last 90 days
    contests: { contestName, attendedAt, rating, ranking, topPercentage }[];
  };
  ```
  This contract is the **only** thing the page and components see. The implementation behind it can change without touching the page.

#### Internal

- None (this is the first bolt for the unit; existing `001-portfolio-ui` is the only dependency)

### Technical Approach

#### 1. Data layer pattern (mirrors `src/lib/cv-data.ts`)

- `fetcher.ts` exports `getLeetCodePageData(): LeetCodeFetchResult` (async)
- Catches all errors and never throws
- Maintains a module-level `lastKnownGood: LeetCodeFetchResult | null` variable
- On error: returns the last-known-good with `isStale: true`; on first-call error: returns a zeroed `LeetCodeFetchResult` with `isStale: true`
- Marks `fetchedAt` so the stale banner can show "Updated X minutes ago"
- Reads `LEETCODE_USERNAME` env var (default `sanjit12`)

#### 2. Route pattern (App Router + ISR)

- `app/leetcode/page.tsx` is a Server Component
- `export const revalidate = 3600` (1h ISR)
- `export const metadata` with title, description, OpenGraph
- Renders a minimal layout: `<Container>` + `<Section>` + heading + a placeholder grid (4 KPI placeholders, 3 chart placeholders). Visualizations are filled in by Bolt 005.
- Includes a "View on LeetCode" CTA even in this bolt (FR-9 — there's no reason to wait)

#### 3. Nav pattern (route-aware without breaking scroll-spy)

- `navLinks.ts` `NavLink` interface gains an optional `href?: string` field. If present, it's a route; if absent, it's an anchor.
- `TopNav.tsx` detects `href` and renders `<Link href={href}>` for routes. For anchors, the existing scroll-spy behavior is unchanged.
- The `LeetCode` entry is added as primary: `{ id: 'leetcode', label: 'LeetCode', href: '/leetcode' }`
- `usePathname()` is added inside the existing `'use client'` component to mark the link active when the path matches

#### 4. Home callout pattern (consistent with `recommendations` / `projects` style)

- `src/components/home/leetcode-callout.tsx` is a thin Server Component
- Receives `totalSolved: number` as a prop (the home page calls the fetcher and passes the value)
- Uses the existing `Card.tsx` primitive
- Renders a clear CTA: "View problem-solving stats →" linking to `/leetcode`
- Has a `lastUpdated` display ("X problems solved • Updated 2h ago")
- Hidden if the fetcher returns no data (zero state) — but a link is always rendered

#### 5. Error handling contract

- The fetcher **never throws** to the page. Page-level `try/catch` is therefore unnecessary.
- The page always renders. `isStale: true` controls a small banner.
- Tests for the fetcher cover: success, network failure, malformed JSON, missing username.

### Acceptance Criteria

#### Data layer (Story 001)

- [ ] `getLeetCodePageData()` returns a `LeetCodeFetchResult` with the 5 typed fields (`profile`, `topicStats`, `activity`, `contests`, `fetchedAt`, `isStale`)
- [ ] On success: `isStale: false`, all fields populated
- [ ] On network failure with prior success: returns last-known-good with `isStale: true`
- [ ] On first-call failure: returns zeroed profile with `isStale: true` and empty arrays
- [ ] `LEETCODE_USERNAME` env var is read; default `sanjit12`
- [ ] No `LEETCODE_USERNAME` value appears in any client-side bundle (verified by checking `.next/server` and `.next/static` after build)
- [ ] Vitest covers: success, network failure, malformed JSON, missing username
- [ ] `package.json` has the chosen LeetCode data source library

#### Route + nav (Story 002)

- [ ] `/leetcode` is reachable and renders successfully on `bun run dev`
- [ ] `bun run build` succeeds with no errors
- [ ] `export const revalidate = 3600` is set
- [ ] Route-specific `metadata` is exported (title, description, OG)
- [ ] `loading.tsx` skeleton renders
- [ ] Main nav contains a "LeetCode" entry pointing to `/leetcode`
- [ ] When on `/leetcode`, the LeetCode nav entry shows the active state
- [ ] Existing scroll-spy behavior on the home page is unchanged
- [ ] `bun run test` passes for updated `navLinks.test.ts`

#### Home callout (Story 003)

- [ ] Home page renders a card between Skills and Education
- [ ] Card shows: "Problem solving" eyebrow, "X problems solved" headline, blurb, and "View full stats →" link to `/leetcode`
- [ ] When the fetcher fails, card renders without a number (no zero, no error)
- [ ] Mobile and desktop layouts both look correct
- [ ] Light and dark themes both render correctly

### Open Questions Resolved In This Bolt

| Question | Resolution |
| --- | --- |
| LeetCode data source library | **TBD during Stage 2 (Implement)**: try `alfa-leetcode-api` first; fall back to `leetcode-query`; fall back to direct GraphQL. The fetcher interface is fixed. |
| Charts library | **Deferred to Bolt 005** (Bolt 004 doesn't render any charts) |
| Heatmap window | **Deferred to Bolt 005** |
| Animation | **Deferred to Bolt 005** |
| Dark/light parity | Already covered by the design system; verified for the callout in this bolt, deferred to Bolt 005 for charts |

### Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Community LeetCode wrapper breaks or rate-limits aggressively | ISR absorbs traffic; last-known-good fallback keeps the page rendering |
| Library choice adds bloat to server bundle | Library is only imported from `fetcher.ts`; never from client components |
| Nav refactor breaks existing scroll-spy | The new `href` field is purely additive; existing anchor behavior is unchanged. Tests cover both. |
| Home callout's fetcher call slows the build | Fetcher caches last-known-good in module memory; subsequent calls in the same build are O(1) |
| `/leetcode` route causes build failure due to env var missing | Default `sanjit12` is hardcoded; env var is optional |

### Out of Scope for This Bolt

- KPI cards (Bolt 005)
- Difficulty, topic, heatmap, contest charts (Bolts 005 + 006)
- "Refresh now" admin endpoint
- Per-topic drilldowns
- A nav-icon-only mode

### Stages & Checkpoints

This is Bolt 004. Stages follow the `simple-construction-bolt` template:

- ⏳ **1. plan** (this document) — In review
- [ ] **2. implement** — After plan approval
- [ ] **3. test** — After implementation

### Human Checkpoint

Per the bolt type, after this plan is presented I will **STOP** and wait for user approval before starting Stage 2 (Implement).
