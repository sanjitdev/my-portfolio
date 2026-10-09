---
stage: implement
bolt: 003-portfolio-ui-polish
created: 2026-10-08T21:40:00Z
---

# Implementation Walkthrough: 003-portfolio-ui-polish

## Summary

The polish bolt is complete. The portfolio now has sticky navigation with scroll-spy and mobile menu, a light/dark theme toggle with no-FOUC persistence, full SEO metadata (title, description, Open Graph, Twitter Card, sitemap, robots, favicon), and a footer with build-time "Last updated" timestamp. 23 new tests added (87 total). First Load JS: 108 kB (was 105 kB). All address-privacy guarantees preserved.

## Files Created

### Components

| File | Type | Purpose |
|------|------|---------|
| `src/components/nav/TopNav.tsx` | Client | Sticky nav, scroll-spy, mobile menu, theme toggle slot |
| `src/components/nav/navLinks.ts` | Server helper | Derives nav links from CV data (skips empty sections) |
| `src/components/theme/ThemeToggle.tsx` | Client | Light/dark toggle, localStorage persistence |
| `src/components/layout/Footer.tsx` | Server | "Last updated" timestamp + copyright |

### App routes (Next.js conventions)

| File | Route | Purpose |
|------|-------|---------|
| `src/app/robots.ts` | `/robots.txt` | Allow all + sitemap reference |
| `src/app/sitemap.ts` | `/sitemap.xml` | Single-entry sitemap with build timestamp |
| `public/icon.svg` | `/icon.svg` | Generated favicon (no binary commit) |

### Tests (23 new tests)

| File | Tests |
|------|-------|
| `src/components/nav/navLinks.test.ts` | 8 |
| `src/components/nav/TopNav.test.tsx` | 7 |
| `src/components/theme/ThemeToggle.test.tsx` | 4 |
| `src/components/layout/Footer.test.tsx` | 4 |

## Files Modified

### `src/app/layout.tsx`

- Added full `Metadata` export using `loadCvData()` at build time
- Title: `${name} – ${current_title}`
- Description: `cv.summary.slice(0, 155)`
- Open Graph: title, description, type, url, siteName
- Twitter: card, title, description
- Icons: `/icon.svg` favicon
- Robots: index, follow
- Added no-FOUC theme bootstrap `<script>` in `<head>`
- Added `theme-color` meta for both light and dark `prefers-color-scheme`
- Hardened body with explicit `bg-white dark:bg-slate-950` classes

### `src/app/page.tsx`

- Wraps everything in `<TopNav>` + `<main>` + `<Footer>`
- `getNavLinks(cv)` derives nav links from CV data
- `computeBuildTimestamp()` produces the build-time ISO date for the footer

## Key Implementation Details

### No-FOUC Theme Bootstrap

```html
<script>
  (function(){
    try {
      var t = localStorage.getItem('theme-preference');
      var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if ((t === 'dark') || (!t && d)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) { /* SSR or private mode */ }
  })();
</script>
```

Renders synchronously in `<head>` BEFORE any React rendering. The `try/catch` handles SSR and private-mode browsers. The `suppressHydrationWarning` on `<html>` (added in Bolt 001) prevents the React warning about the class attribute mismatch between server and client.

### Sticky Nav with Scroll-Spy

```ts
const observer = new IntersectionObserver(
  entries => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible[0]) setActiveId(visible[0].target.id);
  },
  { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
);
```

The biased `rootMargin` creates a "trigger zone" near the top of the viewport. When a section crosses into this zone, it becomes active. Sorting by `boundingClientRect.top` picks the topmost intersecting section when multiple are in the zone.

### Mobile Menu State

- Hamburger button has `aria-expanded` reflecting `useState`
- Click toggles state; mobile panel renders only when open
- Escape key closes (via `useEffect` adding a `keydown` listener)
- Clicking a link closes the menu (`setMenuOpen(false)` in `handleLinkClick`)

### Theme Toggle

- State starts as `undefined` to match SSR/CSR initial HTML
- After mount, `useEffect` reads `<html>` class to populate the state
- Click toggles the `dark` class on `<html>` AND writes to `localStorage`
- Icon represents the *destination* theme (moon in light, sun in dark)
- `try/catch` around `localStorage` for private mode

### SVG Favicon (Workaround)

The `app/icon.tsx` approach (using Next.js `ImageResponse` from `@vercel/og`) failed on Windows in Next 15.1.4 due to a `fileURLToPath` issue in the bundled OG module. Workaround: use a static SVG file in `public/` and reference it via `icons: { icon: '/icon.svg' }` in metadata. SVG favicons are supported by all modern browsers.

### SITE_URL Constant

Defined in `robots.ts`, `sitemap.ts`, and `layout.tsx` (could be DRY'd, but kept local for clarity):
```ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sanjit-majumdar.vercel.app';
```

README documents this env var for custom domains.

## Test Coverage

| Layer | Coverage |
|-------|----------|
| Compile-time privacy | `PublicContact` type unchanged; nav/footer receive non-PII props |
| Unit tests | 23 new tests for nav, theme, footer, link derivation |
| Integration | `app/page.test.tsx` privacy test still passes (TopNav + Footer added) |
| Build artifacts | 4 SEO/OG/Twitter tags verified in built HTML; no-FOUC script present |

## Deviations from Plan

- **Favicon via static SVG, not generated `icon.tsx`**: The `@vercel/og` bundle in Next 15.1.4 has a Windows-specific `fileURLToPath` failure when loading fonts at module load. Workaround documented above.
- **Two ThemeToggle buttons in nav**: The plan described one toggle, but the mobile menu has its own toggle button for UX consistency (so the toggle is always reachable regardless of menu state). This was the natural outcome of the design and is covered by tests.

## Build Health

- ✅ 108 kB First Load JS (under 200 kB target)
- ✅ 4 static-prerendered routes (`/`, `/_not-found`, `/robots.txt`, `/sitemap.xml`)
- ✅ Lint clean, format clean
- ✅ All 87 tests pass

## Privacy Invariants (preserved)

1. `PublicContact` is the only type passed to UI components that render contact info
2. `navLinks.ts` reads `CvData` but only emits `{ id, label }` pairs — no PII
3. `Footer` receives `name` from `PublicContact` + an ISO date string only
4. The `app/page.test.tsx` end-to-end privacy test still asserts zero address fragments
5. Manual grep of the built HTML confirms 4/4 address fragments absent

## Project Status

All 16 stories complete. All 3 bolts complete. Ready for Operations phase.
