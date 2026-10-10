---
id: adr-006
title: Featured Projects section sourced from docs/projects.md with hero + compact layout
status: accepted
date: 2026-10-10
bolt: post-bolt-evolution (free-form, not in original 3-bolt plan)
commit: pending
supersedes: null
---

# ADR-006: Featured Projects section sourced from docs/projects.md with hero + compact layout

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

The user requested the section in two passes:

1. *"I don't see the projects section, it should be the most important
   section of all, why isn't it here."* — first iteration (ADR-006 v1)
   added a curated `projects` array inside `docs/LinkedIn_CV.json` and
   rendered a single card layout.
2. *"The projects you showed needs to be updated, read from the
   projects.md file in docs folder, also redesing the projects section,
   needs to look good."* — this ADR documents the second pass: move
   the source of truth out of the CV JSON and into a dedicated
   `docs/projects.md` file, then redesign the section so it visually
   matches the editorial system.

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

## Decision

### Data source: `docs/projects.md` with a custom parser

1. **New source file: `docs/projects.md`**, hand-written, structured
   into blocks separated by blank lines. Each block is one project.
2. **No external markdown dependency.** The two distinct block formats
   (bullet-only and structured `Scope:` / `Impact:` /
   `Contributions:`) are handled by a small custom parser in
   `src/lib/projects-md.ts`. Adding `marked` or `unified` would have
   been ~30 kB of bundle for ~120 lines of hand-written parsing.
3. **Strict Zod validation** at module load — `ProjectMdSchema`:
   - `name`: required, non-empty
   - `client`, `role`, `year`, `scope`, `impact`: optional
   - `contributions`: required array of non-empty strings
   - `stack`: required array of non-empty strings
   - `link`: optional `{ label, href }` for case studies / repos
4. **Sparse blocks are dropped** (the parser requires at least one
   contribution or one stack item to emit a project), so a stray
   blank section heading doesn't render a half-empty card.
5. **Client is extracted from the title** when present in
   parentheses, e.g. `Enterprise Project Management Platform (Global
   Client)` → `name = "Enterprise Project Management Platform"`,
   `client = "Global Client"`. The parser falls back to `undefined`
   when the parenthetical is absent.

### Layout: hero + compact

The section is a hero + compact layout:

- **First project renders as a `HeroProjectCard`** — full-width
  editorial card with:
  - "Featured Project" eyebrow (Sparkles + Building2 icons)
  - Big Playfair title (text-3xl / text-4xl)
  - Role + year meta chips
  - Scope paragraph
  - Impact box (accent-tinted rounded-lg)
  - Two-column contributions list (numbered 1-5) alongside stack tags
  - Footer CTA link (when `link` is set)
- **Every subsequent project renders as a `CompactProjectCard`** in a
  responsive grid (1 col mobile, 2 col ≥ md), with:
  - "Also shipped" eyebrow
  - Smaller Playfair title (text-xl / text-2xl)
  - Scope paragraph + Impact box
  - **First 3 contributions** then `+ N more` truncation when more
    exist
  - Stack tags + optional CTA

### Section behavior

- **First content section after the Hero** — Projects is the section
  recruiters care about most, so it earns the prime real estate.
- **Hides itself entirely when `projects` is missing or empty** — same
  pattern as the other conditional sections, so the section never
  renders an empty state. Scroll-spy never targets a phantom
  `id="projects"`.
- **Promotes Projects to the primary nav row** and demotes Skills to
  the "More" dropdown (ADR-005 already split the nav). The new
  primary row is: Home, Projects, Experience, Contact.
- **`getNavLinks` signature changed** from `(cv)` to
  `(projects, cv)` because the data source moved out of the CV. The
  second argument's `projects` parameter is the curated list from
  `loadProjectsFromMd()`; the function uses `projects.length > 0` to
  decide whether to add the Projects link to primary.
- **The previous `Project` type and `projects` field in
  `docs/LinkedIn_CV.json` were removed** — the JSON reverts to its
  original 11 top-level keys. `src/lib/cv-types.ts` no longer
  exports a `Project` type.

### Editorial design system carryover

Both cards carry the editorial design system from ADR-001: Playfair
headings, mono-uppercase metadata, accent-tinted role/eyebrow labels,
mono-uppercase tech tags, accent-tinted impact box, and a subtle
hover lift on the compact card.

### Initial curated set

`docs/projects.md` ships with two projects hand-picked from the
existing experience:

- **Enterprise Project Management Platform** (Global Client) —
  bullet-only format, full hero card.
- **nopCommerce Integration for Global Retail Clients** —
  structured `Scope:` / `Impact:` / `Contributions:` format, compact
  card.

The candidate can add more blocks following either format. The
parser handles both.

## Consequences

### Positive

- Portfolio now answers the #1 recruiter question ("what have you
  shipped?") in the first 5 seconds of visiting the page.
- Markdown source is recruiter-friendly for editing: copy, structure,
  and stack are all in one place, no JSON escaping, no schema
  round-trip to check.
- The two-tier layout (hero + compact) means a 1-3 project portfolio
  doesn't look sparse and a 7+ project portfolio doesn't look like a
  wall of identical cards. The featured project gets full visual
  weight; the rest serve as supporting evidence.
- No new dependencies. The parser is hand-written.
- Tests grew from 196 → 210 (ADR-005) → 216 (this ADR): 7 new
  parser tests, 8 new section/card tests.
- Privacy invariant preserved — `grep -c "Chunkhola\|House 263"
  .next/server/app/index.html` → 0 after rebuild.

### Negative

- The markdown parser is bespoke. A future contributor who edits
  `docs/projects.md` in an unusual way (e.g., title with no body,
  blank-line-separated contributions) may hit a parser edge case.
  The 7 parser tests cover both current formats and the
  "drop sparse blocks" guard, but don't cover every conceivable
  shape.
- The compact card's `+ N more` truncation hides contributions
  beyond the third. A future "expand" toggle could be added per
  card, but it's intentionally terse now — the goal is to surface
  the headline, not to make every card a deep dive.
- Markdown source means we lose TypeScript autocompletion on the
  project fields. The trade is explicit: editability over tooling.
- One icon link + one text CTA in the same card can feel slightly
  redundant. Same mitigation as ADR-006 v1: the icon link is a
  discoverability cue and the text CTA is for users who want to
  click through.

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
  — the projects file is small, has only two formats, and a 30 kB
  dependency for ~120 lines of parsing felt excessive. The custom
  parser is fully tested and Zod-validated.
- **Single uniform card layout for every project.** Rejected — when
  the section has 2-5 projects, a uniform grid makes everything feel
  equally weighted. A hero + compact split makes the featured
  project earn its place and keeps the rest as supporting
  evidence.

## Notes

- The candidate should add and refine `docs/projects.md` as the
  portfolio grows. A good test: open the page, look at the Projects
  section, and ask "would I be comfortable sending a recruiter
  directly to this anchor?" If the answer is no for any card,
  rewrite it.
- Privacy invariant: the parser never touches the address; the
  rendered cards receive only the public `ProjectMd` shape.
- If a new project uses a format that the parser doesn't recognize
  (e.g., a project that is just a title with no body), the build
  will fail at the Zod step with a clear schema error — not at
  runtime with a broken card.
- No new dependencies. The Sparkles / Building2 icons were already
  available from `lucide-react` via prior bolts.
