---
intent: 002-leetcode-stats
phase: inception
status: inception-complete
created: 2026-10-11T15:35:00Z
updated: 2026-10-11T15:40:00Z
---

# Requirements: LeetCode Stats Page

## Intent Overview

Add a dedicated `/leetcode` route to the existing Next.js portfolio that fetches and visualizes the user's LeetCode problem-solving statistics (username: `sanjit12`). The page is a recruiter-facing showcase of problem-solving capability, using visual charts, KPIs, and a calendar heatmap to make the data immediately scannable and impressive. Data is fetched on the server with ISR (~1h revalidate) to keep stats fresh without manual rebuilds and without exposing the API strategy.

## Business Goals

| Goal                                            | Success Metric                                | Priority |
| ----------------------------------------------- | --------------------------------------------- | -------- |
| Showcase technical problem-solving to recruiters | Time-to-impression on stats: < 5 seconds     | Must     |
| Differentiate portfolio from generic templates  | Recruiter feedback / time-on-page             | Should   |
| Keep stats fresh without manual updates         | Data freshness: < 1h staleness (ISR)         | Should   |
| Avoid LeetCode rate limits / downtime            | Page renders even if API fails (graceful)     | Must     |
| Maximize discoverability from entry points      | Nav AND home-page highlight                    | Must     |

---

## Functional Requirements

### FR-1: Dedicated LeetCode Page Route

- **Description**: A new route `/leetcode` accessible from the portfolio's main navigation, rendered as a full page in the existing Next.js app
- **Acceptance Criteria**:
  - Page is reachable at `/leetcode`
  - "LeetCode" (or "Problem Solving") appears in the main site navigation as a top-level item
  - Home page surfaces a visible callout/card linking to `/leetcode` (home-page highlight)
  - Page reuses the existing site layout (header, footer, theme, dark/light parity)
  - Page is statically rendered with ISR (revalidate ~1 hour)
- **Priority**: Must
- **Related Stories**: _TBD_

### FR-2: Fetch Live LeetCode Profile Data

- **Description**: Server-side fetch of the `sanjit12` LeetCode profile to retrieve: total solved, easy/medium/hard counts, acceptance rate, ranking, contribution points, contest rating, recent submission activity, and topic-tag distribution
- **Acceptance Criteria**:
  - Data is fetched on the server (not in the browser) to keep the username/API strategy private
  - Response is cached and revalidated every ~1 hour (ISR)
  - The username is configurable via an environment variable `LEETCODE_USERNAME` (default: `sanjit12`)
  - Any LeetCode API credentials/wrappers are server-side only
  - Page renders within 2s p95 on a cold load
- **Priority**: Must
- **Related Stories**: _TBD_

### FR-3: Visual Difficulty Distribution Chart

- **Description**: A chart (e.g., donut or stacked bar) showing solved count per difficulty (Easy / Medium / Hard), including percentages
- **Acceptance Criteria**:
  - Chart renders with three difficulty segments clearly labelled
  - Solved counts and percentages are visible
  - Color-coded by LeetCode convention (Easy=green, Medium=orange/yellow, Hard=red) or consistent design system
- **Priority**: Must
- **Related Stories**: _TBD_

### FR-4: Visual Topic/Tag Distribution

- **Description**: A horizontal bar or radar chart showing solved problems grouped by topic (e.g., Array, String, Dynamic Programming, Graph, Tree) — directly answers "what problems can this person solve?"
- **Acceptance Criteria**:
  - Top N topics (default ~8) shown with counts
  - Recruiter can read strongest areas in < 5 seconds
  - Color and label style consistent with the rest of the page
- **Priority**: Must
- **Related Stories**: _TBD_

### FR-5: Headline KPI Cards

- **Description**: Prominent number cards for: Total Solved, Acceptance Rate, Global Ranking, Contribution Points
- **Acceptance Criteria**:
  - Four KPI tiles in a responsive grid (mobile → desktop)
  - Numbers are large and styled for visual impact (scannable in < 5 seconds)
  - Each tile has a label and an icon
  - Numbers animate in on first paint for a polished feel
- **Priority**: Must
- **Related Stories**: _TBD_

### FR-6: Recent Activity / Streak Indicator (Heatmap)

- **Description**: A GitHub-style calendar heatmap showing recent submission activity (last 90 days)
- **Acceptance Criteria**:
  - Visual indicator of activity intensity per day (5 intensity buckets)
  - Recruiter can tell "this person is active" at a glance
  - Tooltip on hover with date + count
  - Adapts to light/dark theme
- **Priority**: Must
- **Related Stories**: _TBD_

### FR-7: Contest Rating / Badge Timeline

- **Description**: A line/sparkline showing LeetCode contest rating over time with current rating and badge tier
- **Acceptance Criteria**:
  - Current rating displayed prominently with badge name (e.g., "Knight", "Guardian")
  - Mini chart of rating history (last ~20 contests)
  - "Top X%" global rank if available
  - Gracefully handles users with no contest history (hide section, do not error)
- **Priority**: Should
- **Related Stories**: _TBD_

### FR-8: Graceful Error / Stale State

- **Description**: If the LeetCode API is unavailable or rate-limited, the page must still render with cached/last-known data and a visible "data may be stale" banner
- **Acceptance Criteria**:
  - No 5xx errors to the user
  - Visible indicator when data is older than the revalidate window
  - Empty/zero states are handled cleanly (e.g., no contest history → hide contest section)
  - Page still navigable and themed correctly in degraded mode
- **Priority**: Must
- **Related Stories**: _TBD_

### FR-9: Link to Live LeetCode Profile

- **Description**: A clear "View full profile on LeetCode" call-to-action linking to `https://leetcode.com/sanjit12/`
- **Acceptance Criteria**:
  - Link opens in a new tab with `rel="noopener noreferrer"`
  - Uses official LeetCode branding/colors
- **Priority**: Should
- **Related Stories**: _TBD_

---

## Non-Functional Requirements

### Performance

| Requirement         | Metric          | Target         |
| ------------------- | --------------- | -------------- |
| Page Load (cold)    | p95 LCP         | < 2.5s         |
| Page Load (cached)  | p95 LCP         | < 1.0s         |
| Chart Render        | Time to visible | < 1s after data |
| ISR regeneration    | Background      | Non-blocking   |

### Scalability

| Requirement      | Metric        | Target     |
| ---------------- | ------------- | ---------- |
| Concurrent views  | Vercel edge   | 10k+/month |
| External API hit | Daily budget  | Stay under LeetCode's effective rate limit (ISR absorbs traffic) |

### Security

| Requirement        | Standard        | Notes                                                          |
| ------------------ | --------------- | -------------------------------------------------------------- |
| API strategy       | Server-side     | Do not expose any LeetCode API keys/credentials to the client |
| Username config    | Env var         | `LEETCODE_USERNAME` server-side only                            |
| Data integrity     | Sanitized       | Sanitize any user-controlled strings if a future variant allows it |

### Reliability

| Requirement   | Metric                | Target          |
| ------------- | --------------------- | --------------- |
| Availability  | Uptime                | 99.9% (Vercel)  |
| Degraded mode | Stale data acceptable | Up to revalidate window |
| ISR fallback  | Last good response    | Always render   |

### Compliance

| Requirement | Standard | Notes                                              |
| ----------- | -------- | -------------------------------------------------- |
| LeetCode ToS | Internal review | Respect LeetCode's terms; do not scrape aggressively; honor rate limits |

---

## Constraints

### Technical Constraints

- **Project-wide standards**: React/Next.js + TypeScript + Tailwind, design system in `design-system/`
- **Intent-specific constraints**:
  - LeetCode does not publish an official public API — we must use a community wrapper (e.g., `leetcode-query`, `leetcode-stats`, `alfa-leetcode-api`) or scrape the GraphQL endpoint. Choice will be made in the technical-design stage.
  - External API calls happen at build time / ISR revalidate, not on every request
  - Charts library choice must match the existing design system (likely Recharts based on the existing portfolio)
  - All LeetCode data must be cached for ISR (1h revalidate)

### Business Constraints

- No paid LeetCode API tiers
- No reliance on auth/cookies that would require a recruiter to log in
- No PII beyond the public LeetCode username `sanjit12`
- No manual rebuild required to keep stats fresh

---

## Assumptions

| Assumption                                                                | Risk if Invalid                                            | Mitigation                                              |
| ------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| LeetCode username `sanjit12` is correct and public                        | Page shows wrong/empty data                               | Username is configurable via env var `LEETCODE_USERNAME` |
| A community LeetCode GraphQL/API wrapper is reliable enough for prod     | Page breaks when wrapper changes/is down                   | Add fallback + graceful stale state (FR-8)              |
| Recruiters will visit `/leetcode` from the main nav + home highlight       | Feature gets no traffic                                   | Already mitigated by FR-1 (nav + home callout)          |
| Topic tags are reliably returned by the chosen data source                | Topic chart is empty                                      | Hide section gracefully in degraded mode                |
| Contest history is available via the chosen data source                   | Contest section is empty                                  | FR-7 handles "no contest history" cleanly               |
| 1-hour staleness is acceptable to the user                                | Recruiter sees outdated numbers                           | Increase revalidate window or document staleness banner |

---

## Open Questions

| Question                                                                                          | Owner | Due Date | Resolution         |
| ------------------------------------------------------------------------------------------------- | ----- | -------- | ------------------ |
| Which LeetCode data source? (community wrapper vs. direct GraphQL scrape vs. leetcode-stats API) | Sanjit | TBD     | Pending — decide in Construction |
| Which charts library? (Recharts / Visx / Chart.js / D3)                                          | Sanjit | TBD     | Pending — align with design system |
| Heatmap window: 30 / 90 / 365 days?                                                               | Sanjit | TBD     | Pending — default 90 days |
| Animation on KPI cards — full count-up or simple fade-in?                                        | Sanjit | TBD     | Pending            |
| Dark/light theme parity for charts                                                                | Sanjit | TBD     | Pending            |

---

## Priority Definitions

| Priority   | Meaning                                       |
| ---------- | --------------------------------------------- |
| **Must**   | Required for MVP, page unusable without       |
| **Should** | Important, significant value but not blocking |
| **Could**  | Nice to have, enhances experience             |
| **Won't**  | Out of scope for this intent                  |

---

## Requirement Quality Checklist

- [x] All requirements are testable (measurable, not vague)
- [x] Acceptance criteria are binary (pass/fail)
- [x] NFRs have specific metrics and targets
- [x] Dependencies are identified
- [x] Constraints are documented
- [x] Assumptions are stated and risks assessed
