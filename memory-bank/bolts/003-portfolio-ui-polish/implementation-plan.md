---
stage: plan
bolt: 003-portfolio-ui-polish
created: 2026-10-08T21:30:00Z
---

# Implementation Plan: 003-portfolio-ui-polish

## Goal

Add the cross-cutting polish that turns a working site into a production-ready portfolio:

1. Sticky top nav with scroll-spy + mobile hamburger
2. Light/dark theme toggle with no-FOUC persistence
3. SEO metadata + Open Graph + sitemap + robots + favicon
4. Footer with "Last updated" timestamp
5. Vercel deployment verification (build + smoke test)

## Stories (4) → Components/Files (10+)

| # | Story       | Component(s) / File(s)                              | Type |
|---|-------------|----------------------------------------------------|------|
| 1 | 013-nav     | `components/nav/TopNav.tsx` (client)               | Interactive |
| 2 | 014-theme   | `components/theme/ThemeToggle.tsx` (client) + no-FOUC script in `app/layout.tsx` | Interactive + Server-rendered script |
| 3 | 015-seo     | `app/layout.tsx` metadata + `app/sitemap.ts` + `app/robots.ts` + `app/icon.tsx` (or `app/favicon.ico`) | Build-time |
| 4 | 016-deploy  | `components/layout/Footer.tsx` (server) + last-updated wired in `app/page.tsx` | Server + build-time |

## File Layout (new and changed)

```
src/
├── app/
│   ├── layout.tsx              # UPDATED: metadata + no-FOUC script + theme provider
│   ├── page.tsx                # UPDATED: TopNav + Footer, compute build timestamp
│   ├── icon.tsx                # NEW: generated favicon via Next.js ImageResponse
│   ├── robots.ts               # NEW: robots.txt
│   ├── sitemap.ts              # NEW: sitemap.xml
│   └── page.test.tsx           # UPDATED: privacy test still passes
├── components/
│   ├── nav/
│   │   ├── TopNav.tsx          # NEW: client component (sticky, scroll-spy, mobile menu)
│   │   ├── TopNav.test.tsx     # NEW: scroll-spy + active link tests
│   │   └── navLinks.ts         # NEW: server helper that derives links from CV data
│   ├── theme/
│   │   ├── ThemeToggle.tsx     # NEW: client component
│   │   └── ThemeToggle.test.tsx# NEW: localStorage + class toggle tests
│   ├── layout/
│   │   ├── Footer.tsx          # NEW: server component, formats build timestamp
│   │   └── Footer.test.tsx     # NEW: date formatting tests
│   └── (existing sections)     # UNCHANGED
```

## Component Contracts

### `TopNav` (Client Component)
- **Props**: `{ links: { id: string; label: string }[] }`
- **Renders**: `<nav>` with sticky positioning (`sticky top-0 z-50`), backdrop blur, translucent bg, border bottom. On the right: `ThemeToggle`. On the left: logo/name (or just "Home" link). Center (desktop): horizontal link row. Mobile (<768px): hamburger button + slide-down panel.
- **Behavior**:
  - Scroll-spy: `IntersectionObserver` on each section, `rootMargin: '-40% 0px -55% 0px'`. The "active" id is set in component state.
  - Active link: `aria-current="page"`, accent color, underline.
  - Click handler: `e.preventDefault()` + `document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' })` + close mobile menu.
  - Mobile menu: `useState(false)` for open/closed. Hamburger `aria-expanded` reflects state. Click outside or Escape closes.
  - Links are passed in (so empty sections are skipped automatically by `app/page.tsx`).

### `ThemeToggle` (Client Component)
- **Props**: none
- **Renders**: A button with `aria-label="Switch to dark mode"` (in light mode) or `"Switch to light mode"` (in dark mode). Icon is `Moon` in light mode, `Sun` in dark mode (the icon represents the *destination* theme).
- **Behavior**:
  - On mount: read `document.documentElement.classList.contains('dark')` and set state.
  - On click: toggle the `dark` class on `<html>` and write to `localStorage.setItem('theme-preference', 'dark'|'light')`.
  - SSR safety: the initial render uses the no-FOUC script's decision. If the page is rendered server-side, the toggle starts in the right state by reading from `<html>` after mount in `useEffect`.

### `Footer` (Server Component)
- **Props**: `{ lastUpdated: string }` (ISO 8601)
- **Renders**: A small footer below the contact section with:
  - "Last updated: {humanReadableDate}" using `Intl.DateTimeFormat('en-US', { dateStyle: 'long' })`
  - Subtle border-top, muted text color
  - Optional: copyright `© {year} {name}` — but per privacy, the name is `PublicContact.name` (no address)
- **No client-side JavaScript** — fully static.

### `app/layout.tsx` changes
- Add the no-FOUC script in `<head>`:
  ```tsx
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(){try{var t=localStorage.getItem('theme-preference');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var theme=t||(d?'dark':'light');if(theme==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`
    }}
  />
  ```
- Add full `Metadata` object using `loadCvData()` at module load (build-time).
- Wrap body with `className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"` (already partly in CSS but this hardens it).

### `app/page.tsx` changes
- Derive `sectionLinks` based on which arrays are non-empty in CV data.
- Wrap output in `<>`: `<TopNav links={sectionLinks} /> <main>...</main> <Footer lastUpdated={computeBuildTimestamp()} />`.
- `app/page.test.tsx` continues to pass (privacy test).

### `app/icon.tsx` (generated favicon)
- A simple letter-based icon: large "S" (for Sanjit) in accent color on white. Generated via Next.js `ImageResponse` from `@vercel/og` (already a transitive dep of Next 15).
- Alternative: place a static `app/favicon.ico`. Going with `icon.tsx` so no binary asset needs committing.

### `app/robots.ts` and `app/sitemap.ts`
- `app/robots.ts`:
  ```ts
  export default function robots() {
    return {
      rules: { userAgent: '*', allow: '/' },
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }
  ```
- `app/sitemap.ts`:
  ```ts
  export default function sitemap() {
    return [{
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    }];
  }
  ```
- `SITE_URL` is a constant: `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sanjit-majumdar.vercel.app'`. (No env var set; document in README.)

## Section Link Derivation

```ts
// src/components/nav/navLinks.ts
import type { CvData } from '@/lib/cv-types';

export function getNavLinks(cv: CvData) {
  const links = [
    { id: 'top', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
  ];
  if (cv.education.length > 0) links.push({ id: 'education', label: 'Education' });
  if (cv.certifications.length > 0) links.push({ id: 'certifications', label: 'Certifications' });
  if (cv.languages.length > 0) links.push({ id: 'languages', label: 'Languages' });
  if (cv.honors_awards.length > 0) links.push({ id: 'honors', label: 'Honors' });
  links.push({ id: 'contact', label: 'Contact' });
  return links;
}
```

The conditional pushes mean the nav only shows links for sections that have content. This matches the `if (data.length === 0) return null;` guards in each conditional section component.

## Test Strategy

### Unit tests (new)

| File | Tests |
|------|-------|
| `ThemeToggle.test.tsx` | renders correct icon for current theme; click toggles `dark` class on `<html>`; click writes to `localStorage`; initial state read from `<html>` class after mount |
| `TopNav.test.tsx` | renders one link per item in `links` prop; active link has `aria-current="page"`; clicking a link calls `scrollIntoView`; hamburger button toggles mobile menu; Escape closes mobile menu |
| `Footer.test.tsx` | formats ISO 8601 to "Month Day, Year" via `Intl.DateTimeFormat`; renders name (from props or CV) |
| `navLinks.test.ts` | returns always-rendered links; conditionally adds education/certifications/languages/honors based on CV data |

### Updated tests

| File | Change |
|------|--------|
| `app/page.test.tsx` | Confirm the rendered HTML still contains zero address fragments after adding TopNav + Footer |

### Build-time / manual checks

| Check | How |
|-------|-----|
| Title contains name + title | `bun run build`, inspect `<title>` in built HTML |
| Meta description present | Same — inspect `<meta name="description">` |
| OG tags present | Same — inspect `<meta property="og:...">` |
| `/sitemap.xml` returns valid XML | `curl http://localhost:3000/sitemap.xml` after `bun run start` |
| `/robots.txt` allows crawl + refs sitemap | `curl http://localhost:3000/robots.txt` |
| Favicon loads (no 404) | Network tab in DevTools |
| Footer shows correct build date | Visual check |
| Theme persistence | Toggle, reload, confirm dark mode stays |
| Privacy on built HTML | Existing tests + manual grep of `.next/server/app/index.html` |

### Out of scope (deferred to v2)

- Lighthouse run (manual via Chrome DevTools — not in the test suite)
- Deployed URL smoke test (requires a real Vercel deploy, which happens after this bolt completes)
- JSON-LD structured data
- System preference change listener (`matchMedia.addEventListener`)

## Accessibility

- Nav: `<nav aria-label="Primary">`, links with `aria-current="page"` for active
- Mobile menu: `aria-expanded` on hamburger, `aria-hidden` on the panel when closed
- Theme toggle: `aria-label` reflects the destination theme ("Switch to dark mode")
- All interactive elements get the global focus ring (already in `globals.css`)
- Escape key closes mobile menu
- Reduced motion: `scrollIntoView` uses `behavior: 'auto'` when `prefers-reduced-motion: reduce`

## Privacy Invariants (preserved from Bolt 002)

1. `PublicContact` is still the only type passed to UI components that render contact info.
2. The new `navLinks.ts` reads from `CvData` (the validated full object) but only emits `{ id, label }` pairs — no PII.
3. Footer receives a `lastUpdated` string (an ISO date) and an optional `name` string from `PublicContact` — no address.
4. The `page.test.tsx` privacy test continues to assert zero address fragments in the rendered HTML.
5. Theme preference is stored only in `localStorage` (not sent anywhere).

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| FOUC if no-FOUC script fails to execute | Wrap in `try/catch`; degrade to light mode (the default) |
| `localStorage` access throws (SSR, private mode) | Wrap in `try/catch`; fall back to in-memory or system preference |
| Theme toggle flickers during hydration | `suppressHydrationWarning` on `<html>` (already in place from Bolt 001) |
| Nav scroll-spy lags on fast scroll | Acceptable; `IntersectionObserver` is already fast |
| Build timestamp drifts from real "now" if function is called outside module load | Document the function: it captures at module load, which is the start of the build process. This is the desired behavior. |
| `bun install` on Vercel uses a different bun version | The committed `bun.lock` (text) locks the dep graph; Vercel installs with the latest bun. Document in README. |
| `ImageResponse` in `app/icon.tsx` requires `@vercel/og` | Next 15 ships with it as a transitive dep; no extra install needed |
| Static `favicon.ico` would need a binary asset | Using `app/icon.tsx` (generated) avoids committing a binary |

## Open Questions

None. Proceeding to implementation.
