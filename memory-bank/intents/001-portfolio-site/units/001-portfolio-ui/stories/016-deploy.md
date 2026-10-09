---
id: 016-deploy
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: complete
priority: must
created: '2026-10-08T20:52:00Z'
assigned_bolt: 001-portfolio-ui-polish
implemented: true
---

# Story: 016-deploy

## User Story

**As a** site owner
**I want** the portfolio to deploy to Vercel on every push, with a "Last updated" timestamp in the footer
**So that** visitors always see the freshest version of my CV

## Acceptance Criteria

- [ ] **Given** I push to `main` on the Git remote, **When** Vercel detects the push, **Then** a production build runs and deploys automatically
- [ ] **Given** I open a PR, **When** Vercel detects the PR, **Then** a preview build runs and a unique preview URL is generated
- [ ] **Given** the site is deployed, **When** I view the footer, **Then** "Last updated: {date}" is visible
- [ ] **Given** the build runs, **When** it captures the build timestamp, **Then** the date matches the build time (within seconds)
- [ ] **Given** I view the footer, **When** the date formats, **Then** it's human-readable (e.g., "October 8, 2026")
- [ ] **Given** I view the site on a deployed URL, **When** I check Lighthouse, **Then** Performance, Accessibility, Best Practices, and SEO are all ≥ 90
- [ ] **Given** I view the site on a deployed URL, **When** I check that the home address is NOT in the HTML, **Then** searching the page source returns zero matches for the address string
- [ ] **Given** the site is deployed, **When** I share the URL on LinkedIn, **Then** the OG preview shows name, title, and summary
- [ ] **Given** I view the deployed site, **When** I navigate every section, **Then** the scroll-spy nav, theme toggle, and all sections work as designed

## Technical Notes

- Footer component: `components/shared/Footer.tsx` (or `components/layout/Footer.tsx`)
  - Receives `lastUpdated: string` (ISO 8601) as a prop
  - Displays: "Last updated: {formatted date}"
  - Use `Intl.DateTimeFormat` with the candidate's locale (or default to `en-US`) and `dateStyle: 'long'`
- The build timestamp is generated at build time, not at request time:
  - In `app/page.tsx` (a Server Component), call `computeBuildTimestamp()` from `lib/cv-data.ts` and pass it down
  - The function uses `new Date().toISOString()` at the moment of import
- Vercel deployment: zero config required
  - Auto-detects Next.js
  - Detects bun if `bun.lockb` is committed
  - Runs `bun install && bun run build` (Next.js default)
  - Outputs static HTML/CSS/JS, served from CDN
- Verification checklist for the deploy bolt:
  - [ ] `bun run build` succeeds locally
  - [ ] `bun run start` serves the built site on `http://localhost:3000`
  - [ ] All 16 stories' acceptance criteria pass
  - [ ] Lighthouse audit runs (can be done via Chrome DevTools locally, no CI tool needed for v1)
  - [ ] Final manual smoke test on a deployed preview URL

## Dependencies

### Requires
- All previous stories (001-015) must be complete and merged to `main`

### Enables
- Nothing — this is the final story. Project is done.

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Build fails on Vercel | Site remains on previous successful deploy (Vercel doesn't deploy a broken build) |
| Lighthouse run blocked by network | Document the manual steps; not blocking |
| `bun.lockb` accidentally gitignored | Document in README; build falls back to npm |
| Footer date drifts by 1 day due to timezone | Acceptable; "Last updated" is approximate |

## Out of Scope

- Custom Vercel domain (future intent)
- Lighthouse CI in the build pipeline (manual is fine for v1)
- Branch protection rules (GitHub-side config, not code)
- Vercel Analytics (can be enabled in dashboard, no code change)
- Status badges in README (e.g., "build passing") — nice but not required