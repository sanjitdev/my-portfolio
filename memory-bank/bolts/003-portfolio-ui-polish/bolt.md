---
id: 003-portfolio-ui-polish
unit: 001-portfolio-ui
intent: 001-portfolio-site
type: simple-construction-bolt
status: planned
stories:
  - 013-nav
  - 014-theme
  - 015-seo
  - 016-deploy
created: 2026-10-08T20:55:00Z
started: null
completed: null
current_stage: null
stages_completed: []

requires_bolts:
  - 001-portfolio-ui-foundation
  - 002-portfolio-ui-sections
enables_bolts: []
requires_units: []
blocks: false

complexity:
  avg_complexity: 2
  avg_uncertainty: 2
  max_dependencies: 2
  testing_scope: 3
---

# Bolt: 003-portfolio-ui-polish

## Overview

Add the cross-cutting polish: sticky top navigation with scroll-spy, dark/light theme toggle with no-FOUC persistence, SEO meta tags + Open Graph + sitemap + robots + favicon, and final Vercel deployment verification with "Last updated" footer.

This is the final bolt. After it completes, the portfolio is production-ready and can be pushed to `main` for Vercel to deploy.

## Objective

Transform the working-but-static site into a polished, shareable, deployable production site:

1. Visitors can navigate quickly (sticky nav + scroll-spy)
2. Visitors can choose their theme (with no FOUC)
3. Search engines and social platforms see proper metadata
4. The site deploys to Vercel and runs Lighthouse ≥ 90 across the board
5. A "Last updated" timestamp signals content freshness

## Stories Included

- **013-nav** (Should): Sticky top nav with scroll-spy and mobile hamburger
- **014-theme** (Should): Light/dark theme toggle with `localStorage` persistence and no-FOUC
- **015-seo** (Should): Meta tags, Open Graph, sitemap, robots, favicon
- **016-deploy** (Must): Vercel deployment verification + last-updated footer

## Bolt Type

**Type**: Simple Construction Bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. plan**: Pending → `implementation-plan.md` (design the no-FOUC script, nav scroll-spy logic, mobile menu state, SEO metadata extraction, footer integration)
- [ ] **2. implement**: Pending → create `components/nav/TopNav.tsx`, `components/theme/ThemeToggle.tsx`, `components/layout/Footer.tsx`, update `app/layout.tsx` with theme script + metadata, create `app/sitemap.ts`, `app/robots.ts`, `app/favicon.ico` or `app/icon.tsx`
- [ ] **3. test**: Pending → `test-report.md` (theme toggle test, nav active link test, mock localStorage tests, manual Lighthouse run, privacy verification on deployed build)

## Dependencies

### Requires
- 001-portfolio-ui-foundation (Tailwind `darkMode: 'class'` config, fonts, build setup)
- 002-portfolio-ui-sections (every section must exist for nav targeting)

### Enables
- Nothing — this is the final bolt. Project ships.

## Success Criteria

- [ ] Sticky nav visible at top of viewport when scrolling past hero
- [ ] Nav shows links for every visible section (skips empty ones)
- [ ] Active section is highlighted as user scrolls (scroll-spy via `IntersectionObserver`)
- [ ] Clicking nav link smooth-scrolls to section (respects `prefers-reduced-motion`)
- [ ] Mobile (< 768px) shows hamburger; menu opens/closes correctly
- [ ] Theme toggle switches between light/dark
- [ ] Theme persists across reloads (`localStorage`)
- [ ] No FOUC on initial load (theme script runs before React hydrates)
- [ ] `<title>` contains name + title
- [ ] `<meta description>` contains summary (truncated)
- [ ] Open Graph tags present (`og:title`, `og:description`, `og:type`, `og:url`)
- [ ] Twitter Card tags present
- [ ] `/sitemap.xml` returns valid XML
- [ ] `/robots.txt` allows crawling and references sitemap
- [ ] Favicon loads without 404
- [ ] Footer shows "Last updated: {date}" in human-readable format
- [ ] Date reflects the build timestamp (not a hard-coded value)
- [ ] Vercel build succeeds when pushed to `main`
- [ ] Vercel preview build succeeds for any PR
- [ ] **Final smoke test on a deployed URL**:
  - Lighthouse Performance ≥ 90
  - Lighthouse Best Practices ≥ 95
  - Lighthouse SEO ≥ 95
  - Lighthouse Accessibility ≥ 95
  - Home address string NOT in the rendered HTML
  - All 9 (or fewer, depending on empty sections) sections render
  - Theme toggle works
  - Nav scroll-spy works

## Notes

### No-FOUC Theme Script (CRITICAL)

In `app/layout.tsx`, the theme bootstrap script MUST run before any React rendering:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme-preference');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored || (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  // localStorage may be unavailable (private mode)
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` on `<html>` is needed because the class attribute will differ between server and client (server renders no class, client adds `dark` class before hydration).

### Nav Section Discovery

The nav needs to know which sections exist (skip empty ones). Two options:

**Option A (simpler)**: Pass the list of section IDs as a prop from the page component. The page already gates empty ones (they're not in the JSX). So the nav can just take a `links: { id: string; label: string }[]` array.

**Option B (more dynamic)**: Use `querySelectorAll('section[id]')` after mount. More fragile; not recommended.

Recommend **Option A**:
```tsx
// In app/page.tsx
const sectionLinks = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
]
if (cvData.education.length > 0) sectionLinks.push({ id: 'education', label: 'Education' })
if (cvData.certifications.length > 0) sectionLinks.push({ id: 'certifications', label: 'Certifications' })
if (cvData.languages.length > 0) sectionLinks.push({ id: 'languages', label: 'Languages' })
if (cvData.honors_awards.length > 0) sectionLinks.push({ id: 'honors', label: 'Honors' })
sectionLinks.push({ id: 'contact', label: 'Contact' })

return (
  <>
    <TopNav links={sectionLinks} />
    <main>
      <HeroSection ... />
      <AboutSection ... />
      {/* etc */}
    </main>
    <Footer lastUpdated={computeBuildTimestamp()} />
  </>
)
```

### Scroll-Spy with IntersectionObserver

```tsx
// In TopNav.tsx (client component)
useEffect(() => {
  const sections = links.map(l => document.getElementById(l.id)).filter(Boolean)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    },
    { rootMargin: '-40% 0px -55% 0px' }
  )
  sections.forEach(s => s && observer.observe(s))
  return () => observer.disconnect()
}, [links])
```

The rootMargin biases the "active" zone toward the top of the viewport, so the highlighted link matches what's near the top of the screen.

### SEO Metadata

```tsx
// In app/layout.tsx
import type { Metadata } from 'next'
import { loadCvData } from '@/lib/cv-data'

const cv = loadCvData()  // Build-time import

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sanjit-majumdar.vercel.app'),
  title: `${cv.personal_information.name} – ${cv.personal_information.current_title}`,
  description: cv.summary.slice(0, 155),
  openGraph: {
    type: 'website',
    title: `${cv.personal_information.name} – ${cv.personal_information.current_title}`,
    description: cv.summary.slice(0, 155),
  },
  twitter: {
    card: 'summary',
    title: `${cv.personal_information.name} – ${cv.personal_information.current_title}`,
    description: cv.summary.slice(0, 155),
  },
}
```

`loadCvData()` runs at build time, so the metadata is baked into the static HTML.

### Deployment Verification

After all 3 bolts complete:

1. **Local verification**:
   - `bun run build` succeeds
   - `bun run start` serves the site
   - Lighthouse run via Chrome DevTools (mobile preset): all categories ≥ 90
   - Search the page source for the home address → 0 matches
   - Toggle theme, reload, confirm persistence

2. **Git & Vercel**:
   - Commit all changes
   - Push to a test branch → confirm Vercel preview deploys
   - Open the preview URL → final smoke test
   - Merge to `main` → confirm production deploy

3. **Documentation**:
   - Update `README.md` with: how to develop, how to deploy, how to update the CV
   - Document the bun requirement and `bun.lockb` commit policy

### Risk: FOUC Regression
If 014-theme's no-FOUC script is added incorrectly (e.g., after React renders), users see a flash of light mode before dark mode kicks in. The construction agent must add the script in `<head>` before the body, with `suppressHydrationWarning` on `<html>`.

### Risk: Nav Scroll-Spy Lag
`IntersectionObserver` is performant but not instant. If the user scrolls very fast, the active highlight may briefly lag. This is acceptable; the alternative (scroll event listener) would be slower.

### Risk: Vercel Build Failure
If `bun.lockb` is missing or `bun` is not detected, Vercel falls back to npm, which may produce a different lockfile. Document this in README. If the build fails, check Vercel build logs.