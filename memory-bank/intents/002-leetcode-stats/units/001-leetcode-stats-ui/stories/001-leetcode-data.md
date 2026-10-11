---
id: 001-leetcode-data
unit: 001-leetcode-stats-ui
intent: 002-leetcode-stats
status: complete
priority: must
created: 2026-10-11T15:50:00Z
assigned_bolt: 004-leetcode-stats-ui-foundation
implemented: true
---

# Story: 001-leetcode-data

## User Story

**As a** recruiter
**I want** the LeetCode page to show up-to-date stats for `sanjit12`
**So that** I can trust the page reflects real, current problem-solving activity

## Acceptance Criteria

- [ ] **Given** the data layer is implemented, **When** the `/leetcode` page renders, **Then** it receives a fully typed `LeetCodeFetchResult` (profile + activity + contests + `fetchedAt` + `isStale`)
- [ ] **Given** the LeetCode API returns a successful response, **When** the fetcher runs, **Then** the result contains normalized `LeetCodeProfile`, `LeetCodeActivity` (90 days), and `LeetCodeContest[]` (last 20)
- [ ] **Given** the LeetCode API fails or rate-limits, **When** the fetcher runs, **Then** it returns the last-known-good cached payload (from `last-known-good.json` on disk in `/tmp` or an in-memory fallback for the current request) with `isStale: true` and never throws to the page
- [ ] **Given** there is no cached payload and the API fails, **When** the fetcher runs, **Then** it returns a zeroed profile with `isStale: true` and the page renders an empty state gracefully
- [ ] **Given** `LEETCODE_USERNAME` env var is set, **When** the fetcher runs, **Then** it uses that username; otherwise it uses the default `sanjit12`
- [ ] **Given** ISR revalidates the page after 1 hour, **When** the fetcher runs in that revalidation, **Then** a new request is made to the LeetCode data source and the cache is refreshed
- [ ] **Given** the fetcher imports the data-source library, **When** the Next.js build runs, **Then** the library is bundled only on the server (never reaches the client)
- [ ] **Given** a Vitest unit test exercises the fetcher, **When** the test runs, **Then** both the success path and the failure-with-fallback path pass

## Technical Notes

- Data source choice is **TBD**: `alfa-leetcode-api`, `leetcode-query`, or direct GraphQL against `https://leetcode.com/graphql`. The fetcher should abstract this behind a single `fetchLeetCodeProfile(username)` function so the data-source can be swapped without touching the page.
- All boundaries use Zod schemas; type generation derives from the schemas.
- Cache strategy: keep the **last successful response** in a module-level variable (per server instance) so that subsequent failed fetches can fall back to it. ISR will also serve cached HTML to visitors even if the API is down.
- File layout: `src/lib/leetcode/{types.ts, schemas.ts, fetcher.ts, fetcher.test.ts, normalize.ts}`.

## Dependencies

### Requires

- None (first story in the unit)

### Enables

- All other stories in this unit depend on this data layer

## Edge Cases

| Scenario                                              | Expected Behavior                                            |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| LeetCode API returns HTML login redirect (auth wall) | Treat as failure → fall back to last-known-good or zero state |
| LeetCode API returns malformed JSON                   | Log to stderr, fall back, mark stale                          |
| Username does not exist on LeetCode                   | Zero profile, `isStale: false`, empty charts                 |
| User has zero contest history                         | Empty `contests: []`, hide contest section in page           |
| User has zero solved problems                         | Zero counts, charts render empty state                       |
| Topic tags not provided by data source                | Hide topic chart section, do not error                       |

## Out of Scope

- Per-topic personal bests
- More than 20 contests in history
- Time-spent per problem
- Manual cache invalidation API