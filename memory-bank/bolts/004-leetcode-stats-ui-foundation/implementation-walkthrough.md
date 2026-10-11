---
stage: implement
bolt: 004-leetcode-stats-ui-foundation
created: 2026-10-11T16:25:00Z
---

## Implementation Walkthrough: 001-leetcode-stats-ui (Foundation Bolt)

### Summary

Established the LeetCode stats feature end-to-end: a typed data layer that
talks directly to LeetCode's public GraphQL endpoint, a `/leetcode` route
served with 1-hour ISR, a main-nav entry that links to the route, and a
home-page teaser card. The page is reachable, the data layer is unit-tested
for the never-throws contract, and the visual polish (KPI cards, charts,
heatmap) is reserved for the next two bolts.

### Structure Overview

The feature splits into three layers:

- **Data layer** (`src/lib/leetcode/`) — pure server-side functions. The
  page never imports from a Client Component.
- **Route + nav integration** (`src/app/leetcode/`,
  `src/components/nav/`) — wires the feature into the existing App Router
  and adds a route-aware variant to the existing scroll-spy nav.
- **Home callout** (`src/components/home/leetcode-callout.tsx`) — a
  thin server component rendered between the Skills and Education sections
  on the home page.

The nav got a minimally invasive upgrade: `NavLink` gained an optional
`href` field. Existing anchor links (Home, Profile, Experience, …) are
unchanged; route links (just LeetCode for now) are rendered as `<Link>`
with their own active-state logic based on `usePathname()`.

### Completed Work

- [x] `src/lib/leetcode/types.ts` — Zod-derived types: `LeetCodeProfile`, `LeetCodeTopicStat`, `LeetCodeActivity`, `LeetCodeContest`, `LeetCodeFetchResult`, plus `LEETCODE_BADGES` and `badgeForRating` helper.
- [x] `src/lib/leetcode/fetcher.ts` — `getLeetCodePageData()` (server-side) with last-known-good fallback, `getLeetCodeTotalSolved()` (callout helper), and four parallel GraphQL queries (`userProfile`, `topicStats`, `calendar`, `contests`).
- [x] `src/lib/leetcode/format.ts` — `formatDistanceToNow` and `formatNumber`.
- [x] `src/lib/leetcode/fetcher.test.ts` — Vitest: success, network failure, last-known-good fallback, missing user, env-var honored, totalSolved helper.
- [x] `src/app/leetcode/page.tsx` — Server Component, `export const revalidate = 3600`, route-specific `metadata`, renders `<StaleDataBanner>`, `<StatsPlaceholder>`, and `<LeetCodeCta>`.
- [x] `src/app/leetcode/loading.tsx` — Skeleton with 4 KPI placeholders and 3 chart placeholders.
- [x] `src/components/leetcode/constants.ts` — `LEETCODE_USERNAME_DEFAULT`, `leetcodeProfileUrl()`.
- [x] `src/components/leetcode/LeetCodeCta.tsx` — "View on LeetCode" button with the official LeetCode brand color (#ffa116).
- [x] `src/components/leetcode/StaleDataBanner.tsx` — Subtle amber banner shown only when `isStale: true`.
- [x] `src/components/leetcode/StatsPlaceholder.tsx` — Foundation KPI grid + difficulty sub-stats + activity/contest summary cards.
- [x] `src/components/home/leetcode-callout.tsx` — Home-page teaser card with single headline number + CTA.
- [x] `src/components/nav/navLinks.ts` — `NavLink` interface gained optional `href`; `LeetCode` added as a primary route link.
- [x] `src/components/nav/TopNav.tsx` — Route-aware active state; route links use `<Link>`; anchor links retain scroll-spy. Optional `currentPath` prop lets server pages force the active state.
- [x] `src/components/nav/navLinks.test.ts` — Two new tests: LeetCode is in primary with `href: '/leetcode'`; LeetCode is before Contact.
- [x] `src/app/page.tsx` — Renders `<LeetCodeCallout>` between Skills and Education; the home page is now `async` because it calls the fetcher.
- [x] `src/app/page.test.tsx` — Updated to await the async `Home()`; mocks `fetch` to keep tests hermetic; adds a "link to /leetcode" assertion.
- [x] `src/app/sitemap.ts` — Lists `/leetcode` with `weekly` cadence.
- [x] `.env.example` — Documents `LEETCODE_USERNAME` (default `sanjit12`).
- [x] `docs/leetcode.md` — Developer doc: data source, freshness, env vars, revalidation, failure modes, file map, future work.

### Key Decisions

- **Direct GraphQL, no community wrapper**: The plan called for trying
  `alfa-leetcode-api` first. Per the third fallback in the plan, we
  shipped direct GraphQL against `https://leetcode.com/graphql` using
  `fetch` (built into Next.js). This keeps the dependency surface small
  and the fetcher's interface stable regardless of which wrapper we use
  later. The four queries we issue are well-documented and versioned by
  LeetCode itself.
- **Module-level last-known-good cache**: Stored in a `let` at the top
  of `fetcher.ts`. Per server instance only (does not survive cold
  starts), but the durable layer is Vercel's ISR cache itself, which
  serves the previous HTML to visitors while we regenerate.
- **Subtle stale banner**: The `<StaleDataBanner>` uses amber (not red)
  and a non-alarming copy. Stale data is a known constraint, not an
  error.
- **Nav upgrade is purely additive**: Adding `href?: string` to
  `NavLink` did not change any existing link's behavior. Anchor
  scroll-spy continues to work exactly as before on the home page.
- **Home callout's `id`**: Set to `leetcode-callout` to match the
  pattern of other section ids. The link is a real `<a href="/leetcode">`
  — no scroll-spy hijack, since the destination is a different route.

### Deviations from Plan

- **No new package added** (per the plan's third fallback). The plan
  called for trying `alfa-leetcode-api` first; we shipped direct
  GraphQL instead. The fetcher's contract is unchanged, so swapping in
  a community wrapper later is a one-file change.
- **Home page is now `async`**. The plan said the home page fetcher
  call should be allowed to fail; it didn't explicitly call out the
  page becoming async, but this is a trivial consequence and is the
  standard Next.js Server Component pattern.
- **StatsPlaceholder** replaces the planned "minimal placeholder layout"
  with something slightly richer (KPI grid + sub-stats + summary cards)
  so the page is meaningfully presentable to recruiters today. Bolt 005
  will replace the placeholder components with the real charts.

### Dependencies Added

- [x] _(none)_ — No new package installed. The fetcher uses
  `fetch`, `AbortController`, and `process.env`, all built into the
  Next.js / Bun runtime. `zod` and `lucide-react` are already in
  `package.json` from the existing portfolio.

### Developer Notes

- `LEETCODE_USERNAME` is read via `process.env['LEETCODE_USERNAME']`
  (bracket notation) to satisfy Next.js / TypeScript strict mode without
  a custom `env.d.ts`. It is **server-side only** — no `NEXT_PUBLIC_*`
  prefix. Verified by grep: no `NEXT_PUBLIC_LEETCODE_*` exists.
- The `userCalendar.submissionCalendar` field is a JSON-encoded
  `Record<unixSecondsString, count>`. The fetcher decodes it and
  fills in missing days with zero so the heatmap will be a continuous
  90-day grid in Bolt 005.
- The page is set to `force-static` style behavior: `revalidate = 3600`
  + no `searchParams` or `cookies` reads. This means the page is
  included in `next build`'s static output and the ISR cache absorbs
  all traffic between regenerations.
- The `TopNav` component now has a `currentPath` prop. The home page
  does not pass it (it relies on `usePathname()` and scroll-spy). The
  `/leetcode` page passes `currentPath="/leetcode"` to force the nav
  to highlight the LeetCode link. This is server-renderable: the
  `currentPath` is a string, not a `usePathname()` call.

### What Bolt 005 Will Replace

The `<StatsPlaceholder>` component is intentionally temporary. Bolt 005
will replace it with:

- A real KPI grid with count-up animation and `prefers-reduced-motion` support.
- The difficulty donut chart.
- The topic bar chart.
- The 90-day activity heatmap (using the data already produced by the
  fetcher — no fetcher changes needed).

Bolt 006 will add the contest rating timeline, refine the stale banner,
polish the CTA, and ship the final `docs/leetcode.md` updates.
