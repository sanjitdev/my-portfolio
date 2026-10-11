---
id: 002-leetcode-route-and-nav
unit: 001-leetcode-stats-ui
intent: 002-leetcode-stats
status: complete
priority: must
created: 2026-10-11T15:50:00Z
assigned_bolt: 004-leetcode-stats-ui-foundation
implemented: true
---

# Story: 002-leetcode-route-and-nav

## User Story

**As a** recruiter
**I want** to navigate to a dedicated LeetCode page from anywhere in the portfolio
**So that** I can find it without having to guess the URL

## Acceptance Criteria

- [ ] **Given** the site is deployed, **When** a recruiter clicks the "LeetCode" entry in the main nav, **Then** they land on `/leetcode` and see the page
- [ ] **Given** the recruiter is on any other page, **When** they look at the main nav, **Then** they see "LeetCode" as a top-level nav item (alongside Home)
- [ ] **Given** the recruiter is on `/leetcode`, **When** they look at the nav, **Then** the "LeetCode" entry shows the active state
- [ ] **Given** the route is `/leetcode`, **When** a recruiter visits it directly, **Then** the page renders the same layout, header, footer, and theme as the rest of the site
- [ ] **Given** the page is built, **When** it renders, **Then** it uses ISR with `export const revalidate = 3600`
- [ ] **Given** the page is loading data, **When** a recruiter visits it, **Then** a `loading.tsx` skeleton is shown (consistent with the site's loading pattern)
- [ ] **Given** the recruiter uses keyboard navigation, **When** they tab to the nav, **Then** the "LeetCode" entry is reachable and operable

## Technical Notes

- File layout: `src/app/leetcode/page.tsx`, `src/app/leetcode/loading.tsx`.
- Reuse `<main>` and `<Container>` from `src/components/shared/`.
- Nav component: `src/components/nav/` — add a new entry, following the existing nav-config pattern (whatever it is in `001-portfolio-ui`).
- Active-state detection uses the existing scroll-spy / route-aware pattern from `013-nav` story in `001-portfolio-site`.

## Dependencies

### Requires

- `001-leetcode-data` (the page calls `getLeetCodePageData()`)

### Enables

- All visualization stories (`004`–`008`) — they live inside this route

## Edge Cases

| Scenario                                | Expected Behavior                              |
| ------------------------------------- | --------------------------------------------- |
| Nav rendered on a mobile viewport     | Existing mobile menu pattern shows the entry    |
| User opens `/leetcode/` (trailing slash) | Next.js trailing-slash behavior — 308 to canonical `/leetcode` |
| User opens `/leetcode` while ISR is regenerating | Old cached HTML served, no error       |

## Out of Scope

- Sub-routes (e.g., `/leetcode/contests`)
- Admin-only revalidation endpoint
- Per-topic deep links