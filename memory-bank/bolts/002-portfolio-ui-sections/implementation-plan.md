---
stage: plan
bolt: 002-portfolio-ui-sections
created: 2026-10-08T21:15:00Z
---

# Implementation Plan: 002-portfolio-ui-sections

## Goal

Render all 9 content sections of the portfolio using shared primitives and the typed CV data layer, producing a complete, scrollable single-page portfolio. Privacy: home address is provably absent from rendered output.

## Stories (9) → Section Components (9)

| # | Story       | Component                                | Section id     | Always rendered? |
|---|-------------|------------------------------------------|----------------|------------------|
| 1 | 004-hero    | `components/hero/HeroSection.tsx`        | `top`          | Yes              |
| 2 | 005-about   | `components/about/AboutSection.tsx`      | `about`        | Yes (summary)    |
| 3 | 006-experience | `components/experience/ExperienceSection.tsx` | `experience` | Yes              |
| 4 | 007-skills  | `components/skills/SkillsSection.tsx`    | `skills`       | Yes              |
| 5 | 008-education | `components/education/EducationSection.tsx` | `education`  | **Conditionally** (hide if `length === 0`) |
| 6 | 009-certifications | `components/certifications/CertificationsSection.tsx` | `certifications` | **Conditionally** |
| 7 | 010-languages | `components/languages/LanguagesSection.tsx` | `languages` | **Conditionally** |
| 8 | 011-honors  | `components/honors/HonorsSection.tsx`    | `honors`       | **Conditionally** |
| 9 | 012-contact | `components/contact/ContactSection.tsx`  | `contact`      | Yes              |

The CV data has all arrays non-empty in this dataset, so the conditional paths will not hide anything in the current build, but the gating must exist for resilience.

## File Layout

```
src/
├── app/
│   └── page.tsx                     # Replaced: composes all 9 sections
├── components/
│   ├── shared/                      # Existing primitives (untouched)
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   ├── Heading.tsx
│   │   ├── Tag.tsx
│   │   └── Card.tsx
│   ├── hero/
│   │   ├── HeroSection.tsx
│   │   └── HeroSection.test.tsx
│   ├── about/
│   │   ├── AboutSection.tsx
│   │   └── AboutSection.test.tsx
│   ├── experience/
│   │   ├── ExperienceSection.tsx
│   │   ├── ExperienceCard.tsx       # Sub-component for one entry
│   │   ├── ExperienceSection.test.tsx
│   │   └── ExperienceCard.test.tsx
│   ├── skills/
│   │   ├── SkillsSection.tsx
│   │   └── SkillsSection.test.tsx
│   ├── education/
│   │   ├── EducationSection.tsx
│   │   ├── EducationCard.tsx        # Sub-component
│   │   └── EducationSection.test.tsx
│   ├── certifications/
│   │   ├── CertificationsSection.tsx
│   │   └── CertificationsSection.test.tsx
│   ├── languages/
│   │   ├── LanguagesSection.tsx
│   │   └── LanguagesSection.test.tsx
│   ├── honors/
│   │   ├── HonorsSection.tsx
│   │   └── HonorsSection.test.tsx
│   └── contact/
│       ├── ContactSection.tsx
│       ├── ContactRow.tsx           # Sub-component for one channel
│       └── ContactSection.test.tsx
└── lib/
    └── cv-data.ts                   # Unchanged; helpers are reused
```

## Component Contracts

### `HeroSection`
- **Props**: `{ contact: PublicContact }` (only public fields, address is impossible to reference)
- **Renders**: Section id `top` (with `scroll-mt-0` since it's the page top) → Container → name `<h1>` (large) → title `<h2>` (medium) → headline `<p>` (muted) → contact icon row (Mail, Linkedin, Globe — all clickable, no address, no phone) → CTA `<a href="#contact">` "Get in touch"
- **Icons**: `Mail` (mailto), `Linkedin` (external, `rel="noopener noreferrer"`), `Globe` (external). Hide Globe if `website` is empty.
- **Phone is excluded** from hero per 004-hero edge-case decision.
- **No `dark:` overrides beyond Tailwind defaults** — color tokens already dark-mode aware.

### `AboutSection`
- **Props**: `{ summary: string }`
- **Renders**: Section id `about` → Container → Heading "About" → `<p>` with `text-lg leading-relaxed max-w-3xl` (80-char readability cap)
- **Empty summary**: render heading + "Summary not provided" muted placeholder (defensive; current data has one).

### `ExperienceSection` + `ExperienceCard`
- **Props for `ExperienceSection`**: `{ experiences: Experience[] }`
- **Renders**: Section id `experience` → Container → Heading "Experience" → vertical stack of `ExperienceCard` (one per entry, most recent first — array is already in that order in the data, no sorting needed).
- **`ExperienceCard` props**: `Experience` (one entry). Card layout:
  - Desktop: 2-col grid — left: title + company, right: date range + duration + location. Mobile: stacked.
  - Bulleted responsibilities list.
- **Date**: `formatDateRange(start_date, end_date)`.

### `SkillsSection`
- **Props**: `{ skills: string[] }`
- **Renders**: Section id `skills` → Container → Heading "Skills" → `flex flex-wrap gap-2` of `Tag`.
- **Empty**: render heading only (or a "No skills listed" muted note).

### `EducationSection` + `EducationCard`
- **Props for `EducationSection`**: `{ education: Education[] }`
- **Hide if empty**: return `null` when `education.length === 0`.
- **`EducationCard` props**: `Education`. Layout: institution (h3) + degree/program + field of study + date range.
- Education schema allows optional `degree` (use `program` as fallback label) and optional `start_date`/`end_date`. Handle each combination defensively.

### `CertificationsSection`
- **Props**: `{ certifications: string[] }`
- **Hide if empty**.
- **Renders**: vertical list with `BadgeCheck` icon + cert name.

### `LanguagesSection`
- **Props**: `{ languages: { language: string; proficiency: string }[] }`
- **Hide if empty**.
- **Renders**: 2-col grid on desktop, 1-col on mobile. Each row: language name (bold) + `—` + proficiency (muted).

### `HonorsSection`
- **Props**: `{ awards: string[] }`
- **Hide if empty**.
- **Renders**: vertical list with `Trophy` icon + award name.

### `ContactSection` + `ContactRow`
- **Props for `ContactSection`**: `{ contact: PublicContact }` (compile-time excludes address).
- **Renders**: Section id `contact` → Container → Heading "Contact" → 4 rows (email, phone, LinkedIn, website), each with an icon + label + value + link. External links get `target="_blank" rel="noopener noreferrer"`.
- **`ContactRow` props**: `{ icon: LucideIcon; label: string; value: string; href: string | null }`. Hides itself if `href === null`.
- **No address row** — and it literally cannot be added because the prop type excludes it.

## `app/page.tsx` composition

```tsx
import { loadCvData, getDisplayContact } from '@/lib/cv-data';
import { HeroSection } from '@/components/hero/HeroSection';
import { AboutSection } from '@/components/about/AboutSection';
import { ExperienceSection } from '@/components/experience/ExperienceSection';
import { SkillsSection } from '@/components/skills/SkillsSection';
import { EducationSection } from '@/components/education/EducationSection';
import { CertificationsSection } from '@/components/certifications/CertificationsSection';
import { LanguagesSection } from '@/components/languages/LanguagesSection';
import { HonorsSection } from '@/components/honors/HonorsSection';
import { ContactSection } from '@/components/contact/ContactSection';

export default function Home() {
  const cv = loadCvData();
  const contact = getDisplayContact(cv);

  return (
    <main>
      <HeroSection contact={contact} />
      <AboutSection summary={cv.summary} />
      <ExperienceSection experiences={cv.experience} />
      <SkillsSection skills={cv.top_skills} />
      <EducationSection education={cv.education} />
      <CertificationsSection certifications={cv.certifications} />
      <LanguagesSection languages={cv.languages} />
      <HonorsSection awards={cv.honors_awards} />
      <ContactSection contact={contact} />
    </main>
  );
}
```

This is a Server Component. No `"use client"` needed for any section — the sections are static markup. (The 014-theme bolt will inject a small client script for theme toggling at the layout level; it doesn't affect section components.)

## Data Flow

1. `loadCvData()` reads the validated, parsed `CvData` from module load.
2. `getDisplayContact(cv)` produces a `PublicContact` (address stripped at the type level).
3. Each section receives only the slice it needs:
   - `HeroSection`, `ContactSection` ← `contact: PublicContact` (cannot access address)
   - `AboutSection` ← `summary: string`
   - `ExperienceSection` ← `experiences: Experience[]`
   - `SkillsSection` ← `skills: string[]`
   - `EducationSection` ← `education: Education[]`
   - `CertificationsSection` ← `certifications: string[]`
   - `LanguagesSection` ← `languages: Language[]`
   - `HonorsSection` ← `awards: string[]`
4. `formatDateRange()` is reused for Experience and Education dates.

## Styling Conventions

- All sections use existing shared primitives. No new shared components.
- Tailwind utility classes inline (no CSS modules).
- Color tokens: `slate-*` for neutrals, `accent-*` for emphasis (defined in `globals.css` `@theme`).
- Dark mode: every class pair uses `dark:` variant.
- Hover/focus: rely on the global `:focus-visible` ring from `globals.css`; add `hover:` for interactive elements.
- Smooth scroll: already wired in `globals.css` (no JS).

## Accessibility

- Semantic `<section>` for each (via `Section` primitive) with `id` for nav anchor targeting.
- Each section's `<h2>` (or `<h1>` for Hero) is the labelled-by target.
- Icons: `aria-hidden="true"`; accompanying text is the accessible label.
- External links: `rel="noopener noreferrer"` + `target="_blank"`.
- Phone link: `tel:` with the raw number.
- Email link: `mailto:`.
- Reduced motion: no animations to disable; smooth scroll is already conditional on `prefers-reduced-motion`.

## Testing Strategy

### Unit tests per section (`*.test.tsx`)

| Component | Tests |
|-----------|-------|
| `HeroSection` | renders h1 with name, h2 with title, mailto/linkedin/external links present, no address text, no phone link |
| `AboutSection` | renders summary as `<p>`, heading is "About" |
| `ExperienceSection` | renders all entries, most recent first, "Present" appears for current roles, responsibility bullets render |
| `ExperienceCard` | renders title, company, date range, duration, location, responsibilities list |
| `SkillsSection` | renders all skills as tags, empty array → heading only |
| `EducationSection` | renders entries, returns `null` when empty |
| `CertificationsSection` | renders list, returns `null` when empty |
| `LanguagesSection` | renders language + proficiency pairs, returns `null` when empty |
| `HonorsSection` | renders list, returns `null` when empty |
| `ContactSection` | renders all 4 contact channels (email, phone, LinkedIn, website), all have proper hrefs, no address rendered |

### Existing tests (must still pass)

- `src/lib/cv-data.test.ts` (16 tests)
- `src/components/shared/shared.test.tsx` (10 tests)

### Build-time privacy check (extends existing test)

The existing test in `src/lib/cv-data.test.ts` already reads `.next/server/app/index.html` and asserts address fragments are absent. That test stays; nothing to add for the address-absence guarantee. **However**, an additional sanity test will be added: render the full `Home` page to a string (via `renderToString` from `react-dom/server`) and search for address fragments. This catches the case where the build artifact path changes.

```ts
// src/app/page.test.tsx
import { renderToString } from 'react-dom/server';
import Home from './page';
import cvDataRaw from '../../docs/LinkedIn_CV.json';

it('home address never appears in the rendered page', () => {
  const html = renderToString(<Home />);
  const fragments = cvDataRaw.personal_information.address.split(/,\s*/).map(s => s.trim());
  for (const f of fragments) {
    expect(html).not.toContain(f);
  }
});
```

This is faster than the build-artifact test and doesn't require `bun run build` to have been run first.

## Acceptance Criteria Mapping

Each item in `bolt.md` "Success Criteria" maps to one or more of:

- **All 9 sections render in `app/page.tsx` in the correct order** → `app/page.tsx` composition (verified by `page.test.tsx` snapshot + visual build)
- **Hero shows name, title, headline, contact CTAs** → `HeroSection.test.tsx`
- **About shows summary** → `AboutSection.test.tsx`
- **Experience shows all entries, reverse-chrono, "Present"** → `ExperienceSection.test.tsx`
- **Skills as Tags** → `SkillsSection.test.tsx`
- **Empty sections hide** → per-section test with empty array
- **Contact with proper hrefs, no address** → `ContactSection.test.tsx` + `page.test.tsx` privacy test
- **Built HTML has no address** → existing `cv-data.test.ts` test
- **Section ids match nav targets** → names baked into component code; verified by `page.test.tsx` `getAllByRole('region')` or by querying `[id="about"]` etc.
- **Light + dark mode** → manual check; classes verified by lint
- **prefers-reduced-motion** → already wired in `globals.css`
- **Responsive at 375/768/1280** → manual visual check; classes verified

## Implementation Order

The stories are independent in terms of data dependency (all sections consume the same `loadCvData` result). I'll implement in this order for natural composition in `app/page.tsx`:

1. `AboutSection` (simplest — just a heading + paragraph)
2. `SkillsSection` (heading + tag list)
3. `ExperienceSection` + `ExperienceCard` (most complex layout)
4. `EducationSection` + `EducationCard` (conditional render)
5. `CertificationsSection` (conditional, list)
6. `LanguagesSection` (conditional, grid)
7. `HonorsSection` (conditional, list)
8. `ContactSection` + `ContactRow` (privacy-critical)
9. `HeroSection` (special — uses `h1`, has CTA)
10. Wire all into `app/page.tsx`
11. Add `page.test.tsx` privacy test

This order keeps the page renderable at each step (and the dev server can hot-reload between components).

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| `getAllByRole` failures in tests if multiple `<section>` exist | Use `getByRole('region', { name: ... })` per section, or query by id |
| Tailwind v4 `@variant dark` already declared in `globals.css` | Reuse, no new variant definitions needed |
| Next.js may complain about `<a>` with `target="_blank"` without `rel` | Always include `rel="noopener noreferrer"` (we do) |
| Privacy test could false-pass if address happens to appear in JSON-injected scripts | Address string is searched verbatim against address-fragment regex; if it ever appeared, test would fail |
| Education schema allows `program` OR `degree` (mutually exclusive in practice) | Display whichever is present, fall back to "—" |
| `Lucide` icon import tree-shaking | All icons are imported by name from `lucide-react`; Next.js tree-shakes the bundle |

## Open Questions

None. The plan is complete and the data shape is fully understood. Proceeding to implementation.
