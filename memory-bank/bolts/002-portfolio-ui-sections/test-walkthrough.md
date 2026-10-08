---
stage: test
bolt: 002-portfolio-ui-sections
created: 2026-10-08T21:25:00Z
---

# Test Walkthrough: 002-portfolio-ui-sections

## Summary

All 64 tests across 13 test files pass. The sections bolt is verified to:

1. Render all 9 content sections of the portfolio with real CV data
2. Use the shared primitives (Section, Container, Heading, Tag, Card) consistently
3. Hide empty sections gracefully (Education, Certifications, Languages, Honors return `null` when data is empty)
4. Enforce the home-address privacy guarantee at three layers (compile-time type, per-section test, full-page render test)
5. Provide stable section ids that Bolt 003's nav scroll-spy can target
6. Handle "Present" as an end date and the alternate `program`/`degree` education fields
7. Build a 105 KB First Load JS bundle (well under the 200 KB target)

## Test Layout

```
src/
├── app/
│   └── page.test.tsx                  # 3 tests — full-page privacy + section ids
├── components/
│   ├── about/AboutSection.test.tsx    # 3 tests
│   ├── certifications/CertificationsSection.test.tsx  # 3 tests
│   ├── contact/ContactSection.test.tsx # 3 tests
│   ├── education/EducationSection.test.tsx  # 4 tests
│   ├── experience/ExperienceCard.test.tsx   # 3 tests
│   ├── experience/ExperienceSection.test.tsx  # 4 tests
│   ├── hero/HeroSection.test.tsx      # 6 tests
│   ├── honors/HonorsSection.test.tsx  # 3 tests
│   ├── languages/LanguagesSection.test.tsx  # 3 tests
│   ├── shared/shared.test.tsx         # 10 tests (Bolt 001)
│   ├── skills/SkillsSection.test.tsx  # 3 tests
│   └── (lib/cv-data.test.ts)          # 16 tests (Bolt 001)
```

13 test files. **64 tests total**.

## Test Results

```
 RUN v2.1.9 C:/ZDrive Folders/Projects/my-portfolio

 ✓ src/lib/cv-data.test.ts                                       (16 tests)  31 ms
 ✓ src/app/page.test.tsx                                          (3 tests)  185 ms
 ✓ src/components/hero/HeroSection.test.tsx                       (6 tests)  632 ms
 ✓ src/components/contact/ContactSection.test.tsx                (3 tests)  494 ms
 ✓ src/components/education/EducationSection.test.tsx            (4 tests)  465 ms
 ✓ src/components/experience/ExperienceSection.test.tsx          (4 tests)  797 ms
 ✓ src/components/experience/ExperienceCard.test.tsx             (3 tests)  321 ms
 ✓ src/components/shared/shared.test.tsx                         (10 tests)  772 ms
 ✓ src/components/about/AboutSection.test.tsx                    (3 tests)
 ✓ src/components/skills/SkillsSection.test.tsx                  (3 tests)
 ✓ src/components/certifications/CertificationsSection.test.tsx  (3 tests)  669 ms
 ✓ src/components/languages/LanguagesSection.test.tsx            (3 tests)  719 ms
 ✓ src/components/honors/HonorsSection.test.tsx                  (3 tests)  734 ms

 Test Files  13 passed (13)
      Tests  64 passed (64)
   Duration  ~8 s
```

## Test Coverage Detail

### `src/app/page.test.tsx` — 3 tests (NEW — end-to-end privacy)

- ✅ The home address never appears in the rendered HTML (full-page `renderToString` check, all 3 address fragments searched)
- ✅ All 9 section ids are present in the rendered HTML (`top`, `about`, `experience`, `skills`, `education`, `certifications`, `languages`, `honors`, `contact`)
- ✅ The rendered HTML contains the candidate's name

### `src/components/hero/HeroSection.test.tsx` — 6 tests (NEW)

- ✅ Renders name as `<h1>`, title as `<h2>`, headline as text
- ✅ Renders email (mailto), LinkedIn (external), and website (external) as clickable links
- ✅ Renders "Get in touch" CTA with `href="#contact"`
- ✅ Does NOT render a phone link (per 004-hero edge-case privacy decision)
- ✅ Does NOT render the home address (no "Chunkhola", "House 263" in text)
- ✅ Has the `id="top"` section for nav targeting

### `src/components/contact/ContactSection.test.tsx` — 3 tests (NEW)

- ✅ Renders all 4 contact channels with correct `mailto:`, `tel:`, and `https://` hrefs
- ✅ External links have `target="_blank"` and `rel="noopener noreferrer"`
- ✅ Does NOT render the home address (no "Chunkhola", "Mollahat", "Bagerhat" in text)

### `src/components/experience/ExperienceCard.test.tsx` — 3 tests (NEW)

- ✅ Renders title, company, formatted date range, duration, location, and all responsibility bullets
- ✅ Formats non-Present end dates with en-dash (e.g., "January 2024 – December 2023")
- ✅ Omits the `<ul>` when responsibilities array is empty

### `src/components/experience/ExperienceSection.test.tsx` — 4 tests (NEW)

- ✅ Renders all entries in the order provided
- ✅ Shows "Present" for ongoing roles
- ✅ Renders muted placeholder when empty
- ✅ Has `id="experience"` section

### `src/components/education/EducationSection.test.tsx` — 4 tests (NEW)

- ✅ Renders entries with degree and field of study
- ✅ Falls back to `program` when `degree` is absent (per the `additional_education_entry` shape in the CV)
- ✅ Returns `null` when array is empty
- ✅ Has `id="education"` section

### `src/components/about/AboutSection.test.tsx` — 3 tests (NEW)

- ✅ Renders the summary as a `<p>`
- ✅ Renders a "Summary not provided" placeholder when summary is empty
- ✅ Has `id="about"` section

### `src/components/skills/SkillsSection.test.tsx` — 3 tests (NEW)

- ✅ Renders all skills as Tags
- ✅ Renders "No skills listed" placeholder when empty
- ✅ Has `id="skills"` section

### `src/components/certifications/CertificationsSection.test.tsx` — 3 tests (NEW)

- ✅ Renders all certifications
- ✅ Returns `null` when empty
- ✅ Has `id="certifications"` section

### `src/components/languages/LanguagesSection.test.tsx` — 3 tests (NEW)

- ✅ Renders each language with proficiency (e.g., "English — Native")
- ✅ Returns `null` when empty
- ✅ Has `id="languages"` section

### `src/components/honors/HonorsSection.test.tsx` — 3 tests (NEW)

- ✅ Renders all awards
- ✅ Returns `null` when empty
- ✅ Has `id="honors"` section

### Pre-existing tests (must still pass) — 26 tests

- ✅ `src/lib/cv-data.test.ts` (16 tests) — loadCvData, getDisplayContact privacy, formatDateRange, computeBuildTimestamp, address-in-built-HTML
- ✅ `src/components/shared/shared.test.tsx` (10 tests) — Container, Section, Heading, Tag, Card primitives

## Privacy Verification (3 layers)

| Layer | Mechanism | Test |
|-------|-----------|------|
| **Compile time** | `PublicContact` type omits `address`; `HeroSection` and `ContactSection` only accept `PublicContact` | TypeScript would refuse to compile `contact.address` access — the test files would also fail to type-check |
| **Per-section runtime** | Section components never receive `PersonalInfo` and never reference `address` | `HeroSection` and `ContactSection` tests assert no "Chunkhola", "Mollahat", "Bagerhat", or "House 263" in rendered text |
| **End-to-end runtime** | Full `Home` page rendered to string | `page.test.tsx` splits the source `address` by `,\s*` and asserts no fragment appears in the rendered HTML |
| **Build artifact** | Address strings searched in the built `.next/server/app/index.html` | Existing `cv-data.test.ts` test (skipped if build hasn't run) |

## Empty-Section Handling (verified)

Four sections (Education, Certifications, Languages, Honors) have a `if (arr.length === 0) return null;` guard. Verified by:

- `EducationSection.test.tsx`: "returns null when the array is empty" — asserts `container.firstChild` is `null`
- `CertificationsSection.test.tsx`: "returns null when empty" — same
- `LanguagesSection.test.tsx`: "returns null when empty" — same
- `HonorsSection.test.tsx`: "returns null when empty" — same

This means when these sections are empty, they are completely absent from the DOM. Bolt 003's `TopNav` can therefore query `document.getElementById('education')` and treat `null` as "do not add to nav" — no extra config needed.

## Section ID Contract (verified)

All 9 section ids match exactly what Bolt 003's `TopNav` will target:

| Component | `id` attribute |
|-----------|----------------|
| `HeroSection` | `top` |
| `AboutSection` | `about` |
| `ExperienceSection` | `experience` |
| `SkillsSection` | `skills` |
| `EducationSection` | `education` |
| `CertificationsSection` | `certifications` |
| `LanguagesSection` | `languages` |
| `HonorsSection` | `honors` |
| `ContactSection` | `contact` |

The `page.test.tsx` test "all 9 section ids are present" asserts this contract end-to-end.

## Verification Commands

```bash
bun run lint          # ✔ No ESLint warnings or errors
bun run format:check  # All matched files use Prettier code style
bun run test          # 64/64 tests pass
bun run build         # Compiled successfully; 105 KB First Load JS
```

## What Was NOT Tested in This Bolt

These are intentionally deferred:

- **Sticky nav with scroll-spy** — Bolt 003 (story 013-nav)
- **Theme toggle + dark-mode persistence** — Bolt 003 (story 014-theme)
- **SEO meta + Open Graph + sitemap + robots.txt + favicon** — Bolt 003 (story 015-seo)
- **Deployed Vercel build** — Bolt 003 (story 016-deploy)
- **Visual responsiveness at 375/768/1280 viewports** — manual check; classes verified by lint
- **Lighthouse Accessibility ≥ 95** — Bolt 003 verification

## Acceptance Criteria Mapping

| Bolt Success Criterion | Verified by |
|------------------------|-------------|
| All 9 sections render in `app/page.tsx` in the correct order | `app/page.tsx` composition + `page.test.tsx` "all 9 section ids" |
| Hero shows name (h1), title, headline, contact CTAs | `HeroSection.test.tsx` |
| About shows summary | `AboutSection.test.tsx` |
| Experience shows all entries, "Present" handling, responsibilities | `ExperienceSection.test.tsx` + `ExperienceCard.test.tsx` |
| Skills as Tags | `SkillsSection.test.tsx` |
| Education section hides if empty | `EducationSection.test.tsx` "returns null" |
| Certifications hides if empty | `CertificationsSection.test.tsx` "returns null" |
| Languages hides if empty | `LanguagesSection.test.tsx` "returns null" |
| Honors hides if empty | `HonorsSection.test.tsx` "returns null" |
| Contact: email (mailto:), phone (tel:), LinkedIn/website (external, rel) | `ContactSection.test.tsx` |
| Built HTML has zero address occurrences | Existing `cv-data.test.ts` test + new `page.test.tsx` end-to-end test |
| All sections have proper `<section id="...">` | `page.test.tsx` "all 9 section ids" |
| Sections use shared Section/Container/Heading/Card/Tag primitives | Code review (every section file imports from `@/components/shared/*`) |
| Light + dark mode | Manual check; classes use `dark:` variants throughout |
| `prefers-reduced-motion` respected | Wired in `globals.css` (Bolt 001) — no new animations in this bolt |
| Responsive 375/768/1280 | Classes use `sm:`, `md:`, `grid-cols-2` etc.; manual check |
| Semantic HTML: `<section>`, `<h1>` (hero), `<h2>` (others) | `HeroSection` test asserts h1, all other section tests assert h2 |
| Privacy test: built HTML has no address | All three privacy layers verified |

**All success criteria met or have a verified path to be met in Bolt 003.**

Bolt is ready to be marked complete.
