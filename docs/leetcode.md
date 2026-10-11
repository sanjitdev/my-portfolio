# LeetCode stats page

This document covers the developer-facing side of the `/leetcode` feature:
where the data comes from, how it stays fresh, and how to maintain it.

It complements the user-facing spec in `memory-bank/intents/002-leetcode-stats/`.

## What this is

`/leetcode` is a Next.js route that renders the public LeetCode profile of
`LEETCODE_USERNAME` (default `sanjit12`) as a recruiter-friendly stats
page: KPI tiles, a difficulty donut, a topic distribution chart, a
contest rating sparkline, and a 90-day activity heatmap. The home page
also shows a teaser card linking here.

## Visualizations

| Component | File | What it shows |
| --------- | ---- | ------------- |
| `KpiCards` | `src/components/leetcode/KpiCards.tsx` | 4 headline tiles: Total Solved, Acceptance Rate, Global Ranking, Contribution Points. Count-up animation on mount. |
| `DifficultyChart` | `src/components/leetcode/DifficultyChart.tsx` | SVG donut for Easy/Medium/Hard with the total solved in the center + legend with percentages. |
| `TopicChart` | `src/components/leetcode/TopicChart.tsx` | Top 8 solved topics as horizontal bars (pure CSS). |
| `ContestTimeline` | `src/components/leetcode/ContestTimeline.tsx` | Current contest rating + badge tier (Knight/Guardian/Hero) + "Top X% globally" + sparkline of last 20 contests. |
| `ActivityHeatmap` | `src/components/leetcode/ActivityHeatmap.tsx` | 90-day GitHub-style heatmap with 5 intensity buckets, weekday + month labels. |
| `StaleDataBanner` | `src/components/leetcode/StaleDataBanner.tsx` | Subtle banner shown when the data source is unreachable. |
| `LeetCodeCta` | `src/components/leetcode/LeetCodeCta.tsx` | "View full profile on LeetCode" link with the official brand orange. |

All visualizations are server-rendered except `KpiCards` (uses a small
client `useCountUp` hook for the count-up animation; SSR HTML still
contains the final value). No chart library is used — the donut, sparkline,
and heatmap are all hand-rolled SVG, which keeps the bundle slim.

## Data shape

The fetcher returns a single `LeetCodeFetchResult` (see
`src/lib/leetcode/types.ts`) with these fields:

| Field | Type | Source |
| ----- | ---- | ------ |
| `profile` | `LeetCodeProfile` | `matchedUser.submitStatsGlobal` + `profile` |
| `topicStats` | `LeetCodeTopicStat[]` | `matchedUser.tagProblemCounts` (advanced + intermediate + fundamental merged) |
| `activity` | `{ days, totalSubmissions }` | `matchedUser.userCalendar.submissionCalendar` (last 90 days) |
| `contests` | `LeetCodeContest[]` | `userContestRankingHistory` (last 20 contests) |
| `contestSummary` | `LeetCodeContestSummary \| null` | `userContestRanking` (current rating, badge, topPercentage, etc.) |
| `fetchedAt` | ISO string | `new Date().toISOString()` |
| `isStale` | boolean | `true` when the fetch failed and we're serving fallback |
| `error?` | string | Optional human-readable error from the last failed fetch |

## Data source

The fetcher (`src/lib/leetcode/fetcher.ts`) calls LeetCode's **public
GraphQL endpoint** directly:

```text
POST https://leetcode.com/graphql
```

No community wrapper is required. Four queries are issued in parallel:

| Query              | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `userProfile`      | `submitStatsGlobal` (Easy/Medium/Hard counts), ranking, reputation |
| `topicStats`       | `tagProblemCounts` (advanced + intermediate + fundamental) |
| `calendar`         | `userCalendar` (submission counts, encoded as Unix timestamps) |
| `contests`         | `userContestRanking` + `userContestRankingHistory`    |

The raw responses are parsed through Zod schemas (`src/lib/leetcode/types.ts`),
which means a LeetCode schema change will fail loudly at fetch time rather
than silently rendering garbage.

## Freshness

- The page uses Next.js **ISR** with `export const revalidate = 3600`
  (1 hour).
- On the first request after the cache expires, Next.js serves the
  stale HTML and triggers a background regeneration.
- The fetcher additionally keeps a **module-level last-known-good** cache
  per server instance, so a transient LeetCode outage during regeneration
  does not break the page — the user sees a subtle "stats may be out of
  date" banner instead of a 5xx.

## Env vars

| Name | Required | Default | Notes |
| ---- | -------- | ------- | ----- |
| `LEETCODE_USERNAME` | No | `sanjit12` | Server-side only. Never `NEXT_PUBLIC_*`. |
| `NEXT_PUBLIC_SITE_URL` | No | `https://sanjit-dev.vercel.app` | Used in OpenGraph tags + sitemap. |

## Forcing a revalidation

- **On Vercel**: trigger a redeploy from the dashboard, or push a commit.
  The new deployment purges the ISR cache for `/leetcode`.
- **Locally**: `bun run dev` always fetches fresh data (no cache).
- **Programmatic** (not yet implemented): a `revalidatePath('/leetcode')`
  API route is **out of scope** for v1.

## Failure modes

| Scenario                                   | User-facing behavior                            |
| ------------------------------------------ | ----------------------------------------------- |
| LeetCode rate-limits the request           | `isStale: true`, subtle banner, last-known-good |
| LeetCode returns malformed JSON            | Same as above                                   |
| Username does not exist                    | Zeroed profile, `isStale: true`, no error       |
| First-ever request, no cache, API down     | Zeroed profile, "stats may be out of date"      |

## What lives where

| File | Purpose |
| ---- | ------- |
| `src/lib/leetcode/types.ts` | Zod-derived types: `LeetCodeProfile`, `LeetCodeTopicStat`, `LeetCodeActivity`, `LeetCodeContest`, `LeetCodeContestSummary`, `LeetCodeFetchResult`, badge helpers |
| `src/lib/leetcode/fetcher.ts` | `getLeetCodePageData()` (server-side), `getLeetCodeTotalSolved()` (callout) |
| `src/lib/leetcode/format.ts` | `formatDistanceToNow`, `formatNumber` |
| `src/lib/leetcode/fetcher.test.ts` | Vitest unit tests for the fetcher contract |
| `src/components/leetcode/KpiCards.tsx` | 4 KPI tiles with count-up animation |
| `src/components/leetcode/DifficultyChart.tsx` | SVG donut + legend |
| `src/components/leetcode/TopicChart.tsx` | Top-8 horizontal bars |
| `src/components/leetcode/ContestTimeline.tsx` | Rating + badge + sparkline |
| `src/components/leetcode/ActivityHeatmap.tsx` | 90-day heatmap |
| `src/components/leetcode/StaleDataBanner.tsx` | Subtle stale-state banner |
| `src/components/leetcode/LeetCodeCta.tsx` | "View on LeetCode" CTA |
| `src/components/leetcode/useCountUp.ts` | Client hook for KPI count-up |
| `src/components/leetcode/constants.ts` | `LEETCODE_USERNAME_DEFAULT`, `leetcodeProfileUrl()` |
| `src/components/home/leetcode-callout.tsx` | Home-page teaser card |
| `src/app/leetcode/page.tsx` | The page itself (Server Component, ISR 1h) |
| `src/app/leetcode/loading.tsx` | Skeleton shown during the first request |
| `src/components/nav/navLinks.ts` | Adds LeetCode as a primary route link |
| `src/components/nav/TopNav.tsx` | Renders route links as `<Link>`, keeps scroll-spy for anchors |
| `src/app/sitemap.ts` | Lists `/leetcode` for crawlers |
| `.env.example` | Documents `LEETCODE_USERNAME` |

## Privacy

- No LeetCode cookies, sessions, or auth tokens are involved.
- The username is configurable but is not sent to any third party other
  than LeetCode itself.
- No analytics event is fired on `/leetcode` beyond what the rest of the
  site already does (Vercel Analytics + Speed Insights).

## Future work (out of scope for v1)

- A "Refresh now" admin button or route.
- Per-topic drilldowns.
- More than 20 contests in the rating timeline.
- A multi-year heatmap.

These are deferred to a future intent if/when they become priorities.
