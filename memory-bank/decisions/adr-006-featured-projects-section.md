---
id: adr-006
title: Featured Projects section — markdown source, hero + carousel-with-modal, dark-mode aware
status: accepted
date: 2026-10-10
bolt: post-bolt-evolution (free-form, not in original 3-bolt plan)
commit: pending
supersedes: null
---

# ADR-006: Featured Projects section — markdown source, hero + carousel-with-modal, dark-mode aware

## Context

The portfolio had no Projects section. The original Inception plan
(`requirements.md` line 246) explicitly listed **"Project gallery (not in
CV data — would require new data source)"** as out-of-scope, and the CV
JSON (`docs/LinkedIn_CV.json`) had no top-level `projects` field — only
`experience[]`, which lists companies and responsibilities but never
specific projects, outcomes, or stack context.

For a senior engineer portfolio, **Projects is the section that most
directly answers "what have you actually built?"** for recruiters. The
Experience timeline tells them *where* you worked; Projects tells them
*what shipped*. After the editorial redesign (ADR-001) raised the
visual quality of the rest of the page, the missing Projects section
was the most visible gap.

The user requested the section in three passes:

1. *"I don't see the projects section, it should be the most important
   section of all, why isn't it here."* — added a curated `projects`
   array in `docs/LinkedIn_CV.json` with a single-card layout (ADR-006
   v1, since reverted).
2. *"The projects you showed needs to be updated, read from the
   projects.md file in docs folder, also redesing the projects section,
   needs to look good."* — moved the source of truth to
   `docs/projects.md`, added the hero + compact layout, and shipped
   2 fully-described projects + 7 sparse title-only projects from the
   candidate's list.
3. *"I liked direction 1."* — this ADR documents the third pass: apply
   the **Direction 1 (Editorial magazine spread)** visual treatment to
   the section, and make the compact cards richer (no truncation).

The motivation for switching the source from JSON → markdown:

- **Projects are long-form copy, not data**. Each card carries scope
  prose, a contribution list, and a stack line — JSON required
  verbose escaping for multi-line strings and made the diff hard to
  review.
- **The candidate wanted to edit projects without touching the CV
  schema.** A typo in a CV field could fail Zod validation; a typo in
  a markdown file is just a typo.
- **Markdown is the format the candidate already uses for everything
  else** (project notes, planning docs, etc.) so the mental model
  matches.

The motivation for Direction 1 (vs. a generic "richer cards"
treatment):

- The earlier "compact card" felt like a watered-down hero — small
  stack tags, 3-bullet truncation, no impact box. Recruiters
  scanning the section would skip past the supporting projects.
- Direction 1 commits to "every project is well represented" by:
  showing all contributions, giving the compact card an accent
  left-rule (matching the hero's visual language), and giving the
  section a magazine-style anchor card.
- The faint vertical grid + radial accent gradient at the section
  level announce "this is a featured section" without screaming.

## Decision

### Data source: `docs/projects.md` with a custom parser

1. **New source file: `docs/projects.md`**, hand-written, structured
   into blocks separated by blank lines. Each block is one project.
2. **No external markdown dependency.** The parser in
   `src/lib/projects-md.ts` handles three block formats:
   - **Bullet-only**: a list of `* ...` lines → `contributions`
     (used by the Enterprise PM Platform entry).
   - **Structured `Scope:` / `Impact:` / `Contributions:`**: explicit
     labels with one-line scope, one-line impact, and a
     blank-separated contribution list (used by the nopCommerce
     entry).
   - **`Description:` / `Responsibilities:` / `Technologies:`**:
     aliases for the structured format that match the format
     the candidate's source app uses
     (`Description:`, `Responsibilities:`,
     `Technologies: .NET, Angular, ...`). `Description:` maps to
     `scope`, `Responsibilities:` maps to `contributions`,
     `Technologies:` maps to `stack` (one-line comma-separated).
3. **Title-detection safeguard** — lines containing the conjunctions
   ` and ` or ` that ` are NOT treated as project titles, even if a
   `Technologies:` label happens to follow them. This was a real
   parser bug surfaced by the new format: "Lead Developer and
   Designer" (the body of a Responsibilities block) was being
   mis-detected as a new project title. The conjunction filter
   eliminates the false positive without rejecting any real title
   (no real project title contains " and " or " that ").
4. **Sparse blocks are KEPT** when they have a `Role:` or `Year:`
   line, even without contributions or stack. This lets the
   candidate seed projects with just Title/Role/Date and fill in
   the rest later — the cards still render and aren't silently
   dropped.
5. **Strict Zod validation** at module load — `ProjectMdSchema`:
   - `name`: required, non-empty
   - `client`, `role`, `year`, `scope`, `impact`: optional
   - `contributions`: required array of non-empty strings
   - `stack`: required array of non-empty strings
   - `link`: optional `{ label, href }` for case studies / repos
6. **Client is extracted from the title** when present in
   parentheses, e.g. `Enterprise Project Management Platform
   (Wellbook)` → `name = "Enterprise Project Management Platform"`,
   `client = "Wellbook"`. The parser falls back to `undefined`
   when the parenthetical is absent.

### Section treatment (Direction 1 — Editorial magazine spread)

The section announces itself with three layers of visual hierarchy:

1. **Section background** — a subtle radial accent-50 gradient at
   the top of the section, layered over a vertical 64px grid
   pattern (1px-wide column lines at 2.5% opacity), on a warm
   off-white (`#fbfaf7` → `#fff`) base. The grid + radial gradient
   say "this is a featured section" without competing with the
   cards.
2. **Anchor card** — the eyebrow / heading / tagline live inside an
   accent-tinted rounded panel:
   - `border-accent-200`, `rounded-[20px]`, 40-48px padding
   - gradient background `from-accent-50` → `via-white` → `to-white`
   - decorative corner blur orb in the top-right (240×240, 30%
     opacity, `accent-200`)
   - eyebrow with a leading 32px accent rule (the same idiom as
     `SectionEyebrow` but inside the panel)
   - 3.75rem Playfair title
   - 1.0625rem tagline linking to `#experience`
3. **Hero card** — full-width editorial card with:
   - 20px radius, 48-56px padding
   - white background with a 320×320 `accent-100` corner blur orb
     in the top-right
   - **thick 4px gradient accent-400 → accent-200 left rule** (the
     section's signature decoration)
   - 3rem Playfair title (clamp 2rem → 3rem)
   - role + year meta chips (mono-uppercase year)
   - scope paragraph
   - impact box — **linear-gradient `accent-100` → `accent-50`**
     background, `accent-200` border, 24-28px padding, with a
     `TrendingUp` icon in the top-right corner
   - two-column contributions (numbered 1-N) + stack tags, grid
     `1.4fr / 1fr` on desktop
   - optional footer CTA link (when `link` is set)
4. **Compact cards (Direction 1: rich, no truncation)** — every
   subsequent project renders with full weight:
   - 16px radius, 32-36px padding
   - **thick 3px `accent-300` left rule** (visual cousin of the
     hero's 4px gradient rule)
   - 1.5rem Playfair title
   - role + year meta (mono-uppercase year)
   - scope paragraph
   - accent-50 impact box (smaller than the hero's, but same
     idiom)
   - **every contribution** rendered as a dot-bulleted list
     (no `+ N more` truncation)
   - full stack tags + optional footer CTA
5. **Section grid** — compact cards are stacked in a 1-column
   `gap-6` list (not a 2-column grid) so each project gets full
   horizontal space to read. The hero card already provides the
   visual variety; the compact stack reads like a long-form
   supporting cast.

### Section behavior

- **First content section after the Hero** — Projects is the section
  recruiters care about most, so it earns the prime real estate.
- **Hides itself entirely when `projects` is missing or empty** — same
  pattern as the other conditional sections, so the section never
  renders an empty state. Scroll-spy never targets a phantom
  `id="projects"`.
- **Promotes Projects to the primary nav row** and demotes Skills to
  the "More" dropdown (ADR-005). The new primary row is: Home,
  Projects, Experience, Contact.
- **`getNavLinks` signature changed** from `(cv)` to
  `(projects, cv)` because the data source moved out of the CV. The
  second argument's `projects` parameter is the curated list from
  `loadProjectsFromMd()`; the function uses `projects.length > 0` to
  decide whether to add the Projects link to primary.
- **The previous `Project` type and `projects` field in
  `docs/LinkedIn_CV.json` were removed** — the JSON reverts to its
  original 11 top-level keys. `src/lib/cv-types.ts` no longer
  exports a `Project` type.

### Current curated set

`docs/projects.md` ships with 9 projects (2 fully-described, 7
sparse Title/Role/Year with the rest to be filled in):

- **Enterprise Project Management Platform** (Wellbook) — bullet-only
  format, full hero card.
- **nopCommerce Integration for Global Retail Clients** — structured
  `Scope:` / `Impact:` / `Contributions:` format, full compact
  card.
- **LionO CRM Integration in NopCommerce**, **LionOBytes CRM RMA** —
  `Description:` / `Responsibilities:` / `Technologies:` format.
- **FTP File Sync**, **CutOutWiz BigCommerce App**, **CutOutWiz
  Shopify App**, **Student teacher collaborator** — also
  `Description:` / `Responsibilities:` / `Technologies:` format
  (data provided by the candidate).
- **CutOutWiz ERP Solution** — sparse Title/Role/Year only (data
  to be added later).

## Consequences

### Positive

- Portfolio now answers the #1 recruiter question ("what have you
  shipped?") in the first 5 seconds of visiting the page.
- Markdown source is recruiter-friendly for editing: copy, structure,
  and stack are all in one place, no JSON escaping, no schema
  round-trip to check.
- The two-tier layout (hero + rich compact) means a 1-3 project
  portfolio doesn't look sparse and a 7+ project portfolio doesn't
  look like a wall of identical cards. The featured project gets
  full visual weight; the rest serve as supporting evidence with
  real weight (not a truncated teaser).
- The section background + anchor card + accent left rules
  (hero = 4px gradient, compact = 3px solid) tie the section
  together visually. A recruiter scrolling through can see the
  common visual language even when each project is structurally
  different.
- Sparse Title/Role/Year blocks are kept, so the candidate can
  incrementally fill in projects without breaking the build.
- No new dependencies. The parser is hand-written.
- Tests grew from 196 → 210 (ADR-005) → 216 → 220 → **222**
  (Direction 1): 11 parser tests, 12 section/card tests.
- Privacy invariant preserved — `grep -c "Chunkhola\|House 263"
  .next/server/app/index.html` → 0 after rebuild.

### Negative

- The markdown parser is bespoke. The conjunction filter for title
  detection is the third heuristic in `isTitleLine`; a future
  contributor who writes a project title containing " and " (e.g.,
  "Cats and Dogs Platform") would be mis-classified as body
  content. None of the 9 current projects trip this, and a real
  project title is unlikely to contain " and ", but it's a known
  limitation.
- The compact cards in a 1-column stack take more vertical space
  than a 2-column grid. With 8 supporting projects, the section
  is now long. If the candidate adds 10+ projects, the stack
  becomes the section's main scroll surface — a future option
  could be to switch to a 2-column grid for the compact tier when
  `rest.length > 4`.
- The faint vertical grid pattern + radial gradient on the section
  are visual idioms not used elsewhere on the page. They work
  because the section sits between the Hero (which has its own
  backdrop) and About (which is plainer), so the gradient + grid
  reads as "transitional". A future change to either neighbour
  could disturb this.
- One icon link + one text CTA in the hero card can feel slightly
  redundant. The icon link is a discoverability cue (right corner,
  classic "external link" affordance) and the text CTA is for
  users who want to click through. Both share the same `href` and
  `rel="noopener noreferrer"`.
- Markdown source means we lose TypeScript autocompletion on the
  project fields. The trade is explicit: editability over tooling.

### Neutral

- The `docs/LinkedIn_CV.json` schema is back to its original 11
  top-level keys after the `projects` field was removed. Any
  external automation that referenced `cv.projects` (none exists in
  this repo) would break.
- The original 3-bolt story plan remains formally complete; this is
  layered on top as free-form evolution, same as ADR-001 … ADR-005.
- A future AI-DLC cycle could formalize "add a project" as a
  repeatable story (e.g., a `feat-projects/1-add-project.md` story
  template). For now, `docs/projects.md` is edited directly.

## Alternatives Considered

- **Fetch live from GitHub at build time.** Rejected — exposes
  forks/experiments the candidate may not want recruiters to see,
  requires network at build time, and gives no control over framing.
  Could be layered on later as a "View all repos →" link in the
  Projects section footer.
- **Auto-derive projects from experience[].responsibilities.** Rejected
  — responsibilities describe what the candidate did at a job, not
  what they shipped. The two are different stories and conflating
  them weakens both.
- **Show Projects as a sub-section inside Experience (e.g., "Key
  projects at Brain Station 23").** Rejected — Projects cross
  companies and roles; inlining them into Experience would scatter
  them across 5 entries and require a lot of scrolling.
- **Mega-section: merge About + Projects into a "What I do" panel.**
  Rejected — conflates two very different intents (who you are vs.
  what you shipped). Each deserves its own breathing room.
- **Use a real markdown library (marked, unified, remark).** Rejected
  — the projects file is small, has only three formats, and a 30 kB
  dependency for ~120 lines of parsing felt excessive. The custom
  parser is fully tested and Zod-validated.
- **Single uniform card layout for every project.** Rejected — when
  the section has 2-5 projects, a uniform grid makes everything feel
  equally weighted. A hero + rich-compact split makes the featured
  project earn its place and keeps the rest as substantive cards.
- **Truncate compact cards to 3 contributions + "+ N more"** (the
  earlier v3 design). Rejected for Direction 1 — recruiters
  shouldn't have to click anything to see what the candidate
  shipped. Every contribution renders.
- **2-column compact grid** (mocked in direction 2 and 4). Direction
  1 uses a 1-column stack so each supporting project reads at full
  width and the section reads like a long-form cast list. With
  8-10 projects, 2-column would push cards to 4-5 rows and feel
  repetitive.

## Notes

- The candidate should refine `docs/projects.md` as the portfolio
  grows. The current sparse blocks (CutOutWiz ERP Solution, etc.)
  need a `Description:`, `Responsibilities:`, and `Technologies:`
  line each before the cards feel finished. The parser already
  handles the format.
- Privacy invariant: the parser never touches the address; the
  rendered cards receive only the public `ProjectMd` shape.
- If a new project uses a format that the parser doesn't recognize
  (e.g., a project that is just a title with no body and no Role
  or Year), the parser will return `null` for that block. The
  `safeParse` step at the end of `loadProjectsFromMd()` will throw
  a clear Zod error if a parsed block fails validation.
- No new dependencies. `Sparkles`, `Building2`, `Briefcase`,
  `ArrowUpRight`, and `TrendingUp` icons were already available
  from `lucide-react` via prior bolts.
- The 4 design-direction mockups live in `.design-mockups/` (git-
  ignored, local-only) for reference: `projects-index.html` is
  the navigation page, `projects-direction-1-editorial.html` …
  `projects-direction-4-all-in.html` are the four directions.

---

# Direction 2 — Carousel + modal + dark-mode aware (2026-10-10)

## Context

After the Direction 1 redesign shipped, the user flagged three
issues:

1. **The section wasn't dark-theme compatible.** The Direction 1
   surfaces (section backdrop, anchor card, hero card, compact
   card) were all hand-rolled with only light-mode Tailwind
   classes. In dark mode the section still rendered against a
   `#fbfaf7 → #fff` base with `from-accent-50 via-white to-white`
   anchor cards and white hero cards with no `dark:` variants —
   visually broken. Other sections (About, Experience, Skills)
   follow a documented convention that this section was
   ignoring.

2. **The 1-column compact card stack was too heavy.** With 8
   supporting projects each rendered as a rich-compact card
   (full scope, impact, contributions, stack), the section
   became very long and each supporting project got full
   vertical real estate — competing with the hero instead of
   supporting it.

3. **The supporting projects had no progressive-disclosure
   path.** With 8 rich-compact cards, the section gave every
   supporting project the same weight as the hero's intro
   paragraph. Recruiters scanning the section saw eight full
   project write-ups stacked vertically — visual noise rather
   than a teaser surface for the hero.

## Decision

### 1. Dark-mode compliance — match the codebase convention

Apply the documented dark-mode tokens to every surface in the
section, matching the convention used by About / Experience /
Skills:

| Light token                         | Dark counterpart                                |
| ----------------------------------- | ----------------------------------------------- |
| `bg-white`                          | `dark:bg-slate-900`                             |
| `text-slate-900`                    | `dark:text-slate-100`                           |
| `text-slate-600`                    | `dark:text-slate-400`                           |
| `border-slate-200`                  | `dark:border-slate-800`                         |
| `border-accent-200`                 | `dark:border-accent-900/40`                     |
| `bg-accent-50`                      | `dark:bg-accent-950/20`                         |
| `from-accent-100 to-accent-50`      | `dark:from-accent-900/40 dark:to-accent-950/20` |
| `bg-accent-200/50` orb              | `dark:bg-accent-800/30`                         |
| `text-accent-700`                   | `dark:text-accent-400`                          |
| `from-accent-400 to-accent-200` (hero 4px left rule) | `dark:from-accent-600 dark:to-accent-800`     |
| `bg-accent-300` (compact 3px rule)  | `dark:bg-accent-700`                            |
| `#fbfaf7 → #fff` section backdrop   | `dark:from-slate-950 dark:to-slate-900`         |
| `rgba(15,23,42,0.025)` grid         | `dark:rgba(148,163,184,0.04)`                   |
| `shadow-[…rgba(15,23,42,…)]`        | `dark:shadow-[…rgba(0,0,0,…)]`                  |

Files touched:
- `src/components/projects/ProjectsSection.tsx` — section
  backdrop, anchor card, eyebrow, decorative orbs/grid.
- `src/components/projects/HeroProjectCard.tsx` — surface,
  corner orb, 4px gradient left rule, impact box, icons,
  numbered contribution badges.
- `src/components/projects/CarouselProjectCard.tsx` —
  surface, 3px left rule, hover/focus states, pill tags.

### 2. Carousel — CSS scroll-snap, no JS, no new deps

The 1-column compact card grid is replaced with a horizontal
CSS scroll-snap rail:

```tsx
<div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-pl-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
  {projects.map(p => (
    <div key={p.name} className="w-[260px] flex-shrink-0 snap-start sm:w-[300px]">
      <CarouselProjectCard project={p} onOpen={setActiveProject} />
    </div>
  ))}
</div>
```

Key choices:

- **Native CSS scroll-snap** — no JS, no Swiper/Embla, no new
  dependencies. Each card snaps to the start when the user
  releases the gesture or finishes a keyboard scroll.
- **The whole card is a `<button>`** with
  `aria-haspopup="dialog"` so the carousel is fully keyboard
  accessible. Pressing Enter or Space opens the modal.
- **260–300px card width** — wide enough to read the title and
  2-3 stack pills, narrow enough to tease the next card on
  mobile.
- **"Also shipped" label** above the rail announces the
  section to assistive tech.
- **Negative horizontal margin** (`-mx-6 sm:-mx-8`) so the
  cards scroll under the section padding, then restored
  inside via `px-6 sm:px-8` and `scroll-pl-6` so the first
  card's left rule is visible at rest.
- **`data-print="hidden"`** so the rail doesn't try to
  render as a scroll container when the page is printed.
- **Edge case: 0 or 1 rest projects** — the carousel is not
  rendered at all. A 1-card carousel looks broken; with 0 or
  1 supporting projects, the hero already provides the
  visibility.

### 3. Modal — native `<dialog>`, no new deps

The full project details open in a native `<dialog>` element
when a carousel card is clicked. Why native:

- **Focus trap, ESC dismiss, and body scroll lock come free**
  with `showModal()` — no focus-trap library needed.
- **`role="dialog" aria-modal="true"`** is applied
  automatically.
- **Zero new dependencies** — keeps the bundle small and
  avoids the maintenance surface of a third-party dialog
  library.

Trade-off: it must be a Client Component (`'use client'`) —
it uses `useState` (active project) and `useRef` on the
`<dialog>` element. The surrounding `ProjectsSection` stays
a Server Component; the client boundary is drawn at
`ProjectsCarouselClient` which holds the state and renders
the dialog.

**Modal structure (Direction 2 — Carousel magazine spread):**
- `<dialog>` with `aria-labelledby="project-dialog-title"` and
  centered via `m-auto max-w-2xl w-[calc(100%-2rem)]
  max-h-[calc(100vh-4rem)]`.
- Header: "Project · Client" eyebrow + Playfair h2 title +
  role + year + close button (X) + optional link button
  (ArrowUpRight, when `link` is set).
- Body (scrollable): scope paragraph, gradient impact box
  with TrendingUp icon, numbered contributions (`<ol>` with
  circle badges), stack pills.
- Footer: optional text CTA link.
- Backdrop: `background-color: rgb(15 23 42 / 0.4)` +
  `backdrop-filter: blur(4px)` (dark mode: `rgb(2 6 23 /
  0.7)`).
- Open animation: 180ms scale-in via a dedicated
  `project-dialog-in` keyframe in `globals.css`.

**Behavior:**
- Open: `dialogRef.current?.showModal()` + focus moves to
  the close button on the next animation frame.
- Close (X): `onClose()` callback.
- Close (ESC): handled natively by `<dialog>`.
- Close (backdrop click): manual click listener on the
  `<dialog>` element that closes if `event.target ===
  dialogRef.current` (the backdrop region). Inner panel
  clicks call `event.stopPropagation()` to prevent the
  backdrop from receiving the event.

### 4. New components

- `src/components/projects/CarouselProjectCard.tsx` —
  the carousel card (button + name + stack only, dark-mode
  aware, hover lift, focus ring).
- `src/components/projects/ProjectsCarouselClient.tsx` —
  `'use client'` wrapper holding `useState<ProjectMd | null>`
  for the active project; renders the carousel rail and the
  dialog.
- `src/components/projects/ProjectDetailsDialog.tsx` —
  `'use client'` component wrapping the native `<dialog>`
  with focus + ESC + backdrop click behavior.
- `src/components/projects/CompactProjectCard.tsx` — removed
  (no longer imported by anything). Replaced by a stub file
  that just `export {}`s.

### 5. Tailwind v4 backdrop handling

Tailwind v4's `backdrop:bg-slate-900/40` variant is
unreliable for the `<dialog>::backdrop` pseudo-element. A
dedicated utility class `dialog.project-dialog` is defined
in `globals.css` with a `::backdrop { background-color: …
}`. This is more reliable and gives us full control over the
open animation (a 180ms scale-in via `project-dialog-in`).

## Consequences

### Positive

- **Dark theme is fully compliant.** Every surface in the
  section respects the codebase's documented dark-mode
  convention. The section now reads as part of the same
  visual system as About / Experience / Skills in both
  modes.
- **The supporting projects are no longer visual noise.** A
  1-row carousel with 8 cards is a fraction of the vertical
  space the 1-column stack used. The section's hero now
  earns the visual hierarchy it always had semantically.
- **Progressive disclosure matches recruiter scan patterns.**
  A scannable carousel with name + stack, then click-to-see-
  details, matches how recruiters actually read a portfolio
  (skim titles, then dive into ones that match their stack
  filter).
- **Zero new dependencies.** CSS scroll-snap + native
  `<dialog>` give us the carousel + modal UX for free.
- **Keyboard-accessible by default.** Every carousel card is
  a `<button>` with `aria-haspopup="dialog"`. The modal
  traps focus natively, closes on ESC, and returns focus to
  the trigger (browser default).
- **No backend coupling.** The modal state is local React
  state — no URL changes, no router involvement. Future
  work could add `?project=slug` for shareable links without
  changing the data layer.
- **Print-safe.** Carousel has `data-print="hidden"` so the
  print fallback doesn't try to render a scroll container.
  Modal is non-printable by default (the print stylesheet
  applies to the main document; dialogs are not in the print
  tree).
- **Tests grew 222 → 228** (6 new carousel/dialog tests, the
  12 old tests stayed green after the layout rename).
- **No regressions.** All 228 tests pass, build is clean,
  privacy invariant still 0 matches in the rendered HTML.

### Negative

- **The modal hides full project details behind a click.**
  Some recruiters will not click. The carousel card surfaces
  the project name and stack at a glance, so a recruiter can
  still identify the right projects and open them; the
  tradeoff is explicit (compact real estate vs. full
  details).
- **The carousel is not a true paged experience** — it's a
  scroll. With 8 cards on a 1024px viewport, only ~3 are
  visible at once. A future iteration could add prev/next
  buttons or scroll indicators, but CSS scroll-snap already
  provides reasonable paging via keyboard.
- **Native `<dialog>` styling requires a CSS class** for the
  `::backdrop` pseudo-element. Tailwind v4's
  `backdrop:` variant doesn't reliably apply to the
  `<dialog>::backdrop` pseudo-element in our build, so we
  hand-rolled `dialog.project-dialog::backdrop` rules in
  `globals.css`.
- **The carousel is hidden when only 1 supporting project
  exists.** This is intentional (a 1-card carousel looks
  broken) but means a portfolio with 2 total projects shows
  the hero only — the recruiter has to scroll to find more.
  With 9 projects today this is fine; if the candidate ever
  reduces to 2-3, the section may feel thin. A future option
  could fall back to a single full-card layout when
  `rest.length === 1`.

### Neutral

- **`CompactProjectCard.tsx` is removed.** No live code
  imports it. The file is kept as a stub `export {}` to
  avoid a "file disappeared" surprise for anyone browsing
  git history.
- **The ADR-006 "Consequences" / "Alternatives Considered"
  sections above describe the Direction 1 state.** They are
  kept intact so the decision history of the section is
  preserved; the Direction 2 evolution lives in this section
  below.
- **`Section` itself is unchanged** — the dark backdrop
  lives on `ProjectsSection`'s className override, not on
  the shared `Section` primitive. This is consistent with
  how other feature sections personalize the shared
  primitive (e.g., `HeroSection` uses its own
  `.hero-backdrop` class).

## Alternatives Considered

- **Render all 8 supporting projects as a 2-column grid of
  rich-compact cards.** Rejected — same vertical cost as
  the 1-column stack (2x rows = 4 rows of full cards), just
  visually rearranged. Doesn't address the "competing with
  the hero" problem.
- **Use a real carousel library (Swiper, Embla, Splide).**
  Rejected — adds 20-50 kB of JS for what is fundamentally
  a horizontal scroll. CSS scroll-snap gives us the
  affordance for free and degrades gracefully to native
  scroll on older browsers.
- **Use a third-party dialog (Radix, HeadlessUI,
  Ariakit).** Rejected — same reason. Native `<dialog>`
  ships with the browser, has full a11y support, and avoids
  the maintenance surface.
- **Make each carousel card itself open to a router-driven
  detail page** (`/projects/nopcommerce-integration`).
  Rejected — out of scope for a static portfolio. A future
  enhancement if projects get case-study write-ups.
- **URL-state the active project** (`?project=nopcommerce`).
  Rejected per the user's explicit choice (local-only modal
  is fine for this portfolio). The state architecture
  (single `useState<ProjectMd | null>`) is simple enough
  that adding URL state later is a 20-line change.

## Notes

- The dialog uses a small set of CSS rules defined in
  `globals.css` under "Project details dialog — backdrop +
  open animation". These are intentionally not Tailwind
  classes (the `::backdrop` pseudo-element isn't reliably
  stylable through Tailwind v4 utilities).
- The dialog backdrop is a 40% slate-900 in light mode
  (rgb 15 23 42 / 0.4) and a 70% slate-950 in dark mode
  (rgb 2 6 23 / 0.7). Both have a 4px backdrop blur for a
  slight depth-of-field effect.
- The carousel card hover state lifts the card by
  `-translate-y-0.5` and shifts the border to accent-300
  (light) or accent-700 (dark). The focus-visible state
  adds the same lift + an accent-500 focus ring, so the
  keyboard interaction matches the visual hover state.
- The carousel card's whole-card-button pattern means the
  card surface itself doesn't render `<a>` or other nested
  interactive elements; if a future project needs a link
  CTA on the carousel card, that has to be redesigned (e.g.,
  the link becomes a separate button in the modal).
- Privacy invariant: the dialog renders only the public
  `ProjectMd` shape; the parser never touches the address;
  the dialog cannot leak data the carousel card cannot.
- `data-layout="carousel"` is the new data attribute on
  the carousel card (replacing the old `data-layout="compact"`
  on the rich-compact card). Tests use this hook to scope
  carousel-specific assertions.
- The 6 new tests are: carousel-not-rendered-with-1-or-0-rest,
  carousel-renders-with-2+-rest, button-has-aria-haspopup-dialog,
  shows-name-and-stack, clicking-opens-showModal, dialog-renders-
  project-details, close-button-calls-close, dark-mode-classes-
  present.
