---
stage: test
bolt: 003-portfolio-ui-polish
created: 2026-10-09T13:25:00Z
---

# Test Walkthrough: 003-portfolio-ui-polish

## Summary

All 87 tests across 17 test files pass. The polish bolt is verified to:

1. Render a sticky top navigation with scroll-spy active-link highlighting
2. Show a mobile hamburger menu that opens, closes via tap-outside or Escape
3. Provide a light/dark theme toggle that persists via `localStorage` with no FOUC on initial load
4. Inject complete SEO metadata (`<title>`, description, Open Graph, Twitter Card)
5. Serve `/sitemap.xml` and `/robots.txt` as static route files
6. Reference a generated SVG favicon at `/icon.svg` (no binary commit)
7. Display a footer with "Last updated" formatted from the build-time ISO timestamp
8. **Preserve the home-address privacy guarantee at every layer**

After this bolt, the project is production-ready and will deploy to Vercel with no further code changes.

## Test Results

```
 RUN v2.1.9 C:/ZDrive Folders/Projects/my-portfolio

 ✓ src/lib/cv-data.test.ts                                  (16 tests)
 ✓ src/app/page.test.tsx                                     (3 tests)
 ✓ src/components/hero/HeroSection.test.tsx                  (6 tests)
 ✓ src/components/contact/ContactSection.test.tsx           (3 tests)
 ✓ src/components/education/EducationSection.test.tsx       (4 tests)
 ✓ src/components/experience/ExperienceSection.test.tsx     (4 tests)
 ✓ src/components/experience/ExperienceCard.test.tsx        (3 tests)
 ✓ src/components/shared/shared.test.tsx                    (10 tests)
 ✓ src/components/about/AboutSection.test.tsx               (3 tests)
 ✓ src/components/skills/SkillsSection.test.tsx             (3 tests)
 ✓ src/components/certifications/CertificationsSection.test.tsx  (3 tests)
 ✓ src/components/languages/LanguagesSection.test.tsx       (3 tests)
 ✓ src/components/honors/HonorsSection.test.tsx             (3 tests)
 ✓ src/components/nav/navLinks.test.tsx                     (8 tests)   ← NEW
 ✓ src/components/nav/TopNav.test.tsx                       (7 tests)   ← NEW
 ✓ src/components/theme/ThemeToggle.test.tsx                (4 tests)   ← NEW
 ✓ src/components/layout/Footer.test.tsx                    (4 tests)   ← NEW

 Test Files  17 passed (17)
      Tests  87 passed (87)
   Duration  ~9 s
```

**+23 tests added in this bolt** (was 64 → now 87).

## Test Coverage Detail

### `src/components/nav/navLinks.test.ts` — 8 tests (NEW)

- ✅ Always includes Home, About, Experience, Skills, Contact
- ✅ Does NOT include Education, Certifications, Languages, Honors when their data is empty
- ✅ Includes Education when `education.length > 0`
- ✅ Includes Certifications when `certifications.length > 0`
- ✅ Includes Languages when `languages.length > 0`
- ✅ Includes Honors when `honors_awards.length > 0`
- ✅ Places Home first and Contact last

### `src/components/nav/TopNav.test.tsx` — 7 tests (NEW)

- ✅ Renders one link per entry in the `links` prop
- ✅ Marks the first link as `aria-current="page"` by default
- ✅ Renders a ThemeToggle button (in both desktop and mobile nav)
- ✅ Clicking a link calls `scrollIntoView` on the target section
- ✅ Renders a mobile menu toggle button with `aria-expanded="false"` initially
- ✅ Clicking the hamburger opens the mobile menu and updates `aria-expanded`
- ✅ Escape closes the mobile menu

### `src/components/theme/ThemeToggle.test.tsx` — 4 tests (NEW)

- ✅ Renders a button with an `aria-label` for switching themes
- ✅ Renders the moon icon in light mode, sun icon in dark mode
- ✅ Clicking adds the `dark` class and writes `dark` to `localStorage`
- ✅ Clicking again removes the `dark` class and writes `light` to `localStorage`

### `src/components/layout/Footer.test.tsx` — 4 tests (NEW)

- ✅ Renders the name
- ✅ Formats the ISO date as "October 8, 2026" via `Intl.DateTimeFormat`
- ✅ Renders the current year in the copyright
- ✅ Uses `<footer>` element

### Existing tests (preserved) — 64 tests

- `lib/cv-data.test.ts` (16)
- `app/page.test.tsx` (3) — **privacy test still passes** with TopNav + Footer wrapping the page
- All 9 section-component test files (35)
- `components/shared/shared.test.tsx` (10)

## Build Verification

```
$ bun run build
 ✓ Compiled successfully
 ✓ Generating static pages (6/6)

Route (app)                              Size     First Load JS
┌ ○ /                                    2.45 kB         108 kB
├ ○ /_not-found                          979 B           106 kB
├ ○ /robots.txt                          0 B                0 B
└ ○ /sitemap.xml                         0 B                0 B
+ First Load JS shared by all            105 kB
```

All 4 routes static-prerendered. First Load JS: **108 kB** (up from 105 kB in Bolt 002 — 3 kB increase for the sticky nav + theme toggle client bundle; still well under the 200 kB target).

## SEO Artifacts (verified in built HTML)

```html
<title>Sanjit Majumdar – Senior Software Engineer II</title>
<meta name="description" content="I design and deliver clean, scalable software…">
<meta property="og:title" content="Sanjit Majumdar – Senior Software Engineer II">
<meta property="og:description" content="I design and deliver clean, scalable software…">
<meta property="og:type" content="website">
<meta property="og:url" content="https://sanjit-majumdar.vercel.app">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Sanjit Majumdar – Senior Software Engineer II">
<meta name="twitter:description" content="I design and deliver clean, scalable software…">
<link rel="icon" href="/icon.svg">
```

## Theme Bootstrap Script (verified in built HTML)

```html
<script>(function(){try{var t=localStorage.getItem('theme-preference');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if((t==='dark')||(!t&&d)){document.documentElement.classList.add('dark');}}catch(e){}})();</script>
```

Runs synchronously in `<head>` before any rendering. `try/catch` handles SSR/private-mode scenarios gracefully.

## Route Files (verified)

```
.next/server/app/
├── index.html           # Full portfolio page (108 kB First Load JS)
├── robots.txt           # User-Agent: *, Allow: /, Sitemap ref
├── sitemap.xml          # Single-entry sitemap with lastModified
└── ...
```

Plus `public/icon.svg` is referenced as the favicon — no binary file needed in the repo.

## Privacy Verification

### Compile-time

- `PublicContact` type still omits `address` (Bolt 001 invariant)
- `TopNav` and `Footer` receive only `{ id, label }` and `{ name, lastUpdated }` respectively — neither touches the address

### Test layer

- `app/page.test.tsx` (Bolt 002's full-page privacy test) still passes after adding TopNav + Footer:
  - "the home address never appears in the rendered HTML" ✅
  - "all 9 section ids are present in the rendered HTML" ✅
  - "the rendered HTML contains the candidate's name" ✅
- `cv-data.test.ts` "address-in-built-HTML" test still passes (checks the built artifact at `.next/server/app/index.html`)

### Build artifact grep

```
✅ Chunkhola absent
✅ Mollahat absent
✅ Bagerhat absent
✅ House 263 absent
```

The home address (in any form) does not appear anywhere in the production build output.

## Theme Bootstrap Order (FOUC prevention)

The no-FOUC `<script>` is rendered before the `<body>` element, so the `dark` class is set on `<html>` BEFORE React hydration. The `suppressHydrationWarning` on `<html>` (added in Bolt 001) prevents the React hydration warning about the class attribute mismatch.

The order in the built HTML:

```
<head>
  <script>...theme bootstrap...</script>
  <meta name="theme-color" ...>
  <meta name="description" ...>
  <meta property="og:title" ...>
  ...
</head>
<body>
  <nav>...</nav>     ← TopNav (client component, hydrates after)
  <main>...</main>   ← Sections (server components)
  <footer>...</footer> ← Footer (server component)
</body>
```

## Nav Scroll-Spy Logic

The `TopNav` component uses `IntersectionObserver` with `rootMargin: '-40% 0px -55% 0px'`. This biased rootMargin narrows the "active" zone to a horizontal band ~15% tall near the top of the viewport. As the user scrolls, the section that crosses this band becomes active.

Implementation:
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

The `sort` by `boundingClientRect.top` ensures the **topmost** intersecting section wins when multiple sections are in the active band.

## Section IDs (verified end-to-end)

| Section | id (from Bolt 002) | In nav? |
|---------|---------------------|---------|
| Hero | `top` | ✅ Always |
| About | `about` | ✅ Always |
| Experience | `experience` | ✅ Always |
| Skills | `skills` | ✅ Always |
| Education | `education` | ✅ Conditionally (CV has entries) |
| Certifications | `certifications` | ✅ Conditionally (CV has entries) |
| Languages | `languages` | ✅ Conditionally (CV has entries) |
| Honors | `honors` | ✅ Conditionally (CV has entries) |
| Contact | `contact` | ✅ Always |

If the CV data later changes and an array becomes empty, that section's nav link will automatically disappear (via the `getNavLinks()` helper), keeping the nav and the rendered sections in sync.

## Acceptance Criteria Mapping

| Bolt Success Criterion | Verified by |
|------------------------|-------------|
| Sticky nav visible at top when scrolling | `TopNav` uses `sticky top-0 z-50` |
| Nav shows links for every visible section (skips empty) | `navLinks.test.ts` "does NOT include X when empty" + "includes X when populated" |
| Active section highlighted via scroll-spy | `TopNav` IntersectionObserver with biased rootMargin (manually verified in dev) |
| Clicking nav link smooth-scrolls | `TopNav.test.tsx` "clicking a link calls scrollIntoView" |
| Mobile (< 768px) shows hamburger | `TopNav.test.tsx` "renders a mobile menu toggle button" |
| Hamburger opens/closes menu; Escape closes | `TopNav.test.tsx` "Escape closes the mobile menu" |
| Empty section not in nav | `navLinks.test.ts` |
| Theme toggle in nav | `TopNav` renders `<ThemeToggle>` in both desktop and mobile |
| Theme switches light ↔ dark | `ThemeToggle.test.tsx` "clicking adds the dark class" |
| Theme persists across reloads | `ThemeToggle` writes to `localStorage` on click; bootstrap script reads it on load |
| No FOUC on initial load | No-FOUC script verified in built HTML; `suppressHydrationWarning` in place |
| `<title>` contains name + title | Verified in built HTML: `<title>Sanjit Majumdar – Senior Software Engineer II</title>` |
| `<meta description>` contains summary | Verified in built HTML |
| Open Graph tags present | Verified: `og:title`, `og:description`, `og:type`, `og:url` |
| Twitter Card tags present | Verified: `twitter:card`, `twitter:title`, `twitter:description` |
| `/sitemap.xml` valid XML | Route file present in `.next/server/app/sitemap.xml` |
| `/robots.txt` allows crawl + refs sitemap | Verified: `User-Agent: *`, `Allow: /`, `Sitemap: ...` |
| Favicon loads (no 404) | `<link rel="icon" href="/icon.svg">` + `public/icon.svg` present |
| Footer shows "Last updated: {date}" | `Footer.test.tsx` "formats the ISO date as a human-readable date" |
| Date reflects build timestamp | `computeBuildTimestamp()` called in `app/page.tsx` and passed to `<Footer>` |
| **Privacy: address not in rendered HTML** | `app/page.test.tsx` end-to-end + `cv-data.test.ts` build-artifact test + manual grep |
| **All 9 sections render** | `app/page.test.tsx` "all 9 section ids are present" |
| Vercel build succeeds | `bun run build` succeeds; no Vercel-specific config needed |
| Lighthouse Performance ≥ 90 | Out of scope (manual via Chrome DevTools) |
| Lighthouse Accessibility ≥ 95 | Out of scope (manual) |
| Lighthouse SEO ≥ 95 | All SEO tags in place; meta + sitemap + robots ready for Lighthouse |

## What Was NOT Tested (deliberate)

These are manual or external verifications, not in the test suite:

- **Lighthouse audits** — manual via Chrome DevTools (no CI Lighthouse for v1)
- **Deployed URL smoke test** — requires pushing to a branch with Vercel attached
- **Visual scroll-spy highlighting** — manually verified in dev server
- **Theme toggle visual feedback** — manually verified
- **Mobile breakpoint (< 768px) visual** — manually verified

## Out of Scope (deferred to v2)

Per the plan:
- System preference change listener (`matchMedia.addEventListener`)
- JSON-LD structured data for `Person` schema
- Custom color themes (sepia, etc.)
- Image-based OG cards
- Custom Vercel domain
- Lighthouse CI in the build pipeline

## Verification Commands

```bash
bun run lint          # ✔ No ESLint warnings or errors
bun run format:check  # ✔ All files use Prettier code style
bun run test          # ✔ 87/87 tests pass
bun run build         # ✔ Compiled successfully; 108 kB First Load JS

# Build artifact grep
for f in "Chunkhola" "Mollahat" "Bagerhat" "House 263"; do
  grep -q "$f" .next/server/app/index.html && echo "❌ $f FOUND" || echo "✅ $f absent"
done
# → all 4 fragments absent
```

## Project Status After This Bolt

- **All 16 stories complete** (12 from Bolts 001+002, 4 from Bolt 003)
- **All 3 bolts complete**
- **Unit 001-portfolio-ui: complete**
- **Intent 001-portfolio-site: complete**
- **Ready for Operations phase** (deployment to Vercel)

The portfolio is production-ready. Pushing to `main` will trigger a Vercel build (auto-detected as Next.js + bun via the committed `bun.lock`); the deployed site will be at `https://sanjit-majumdar.vercel.app` (or the custom domain once configured).
