---
id: adr-005
title: Curated header menu with "More" dropdown (editorial typography)
status: accepted
date: 2026-10-10
bolt: post-bolt-evolution (free-form, not in original 3-bolt plan)
commit: pending
supersedes: null
---

# ADR-005: Curated header menu with "More" dropdown

## Context

After adding the Recommendations section (post-ADR-001 evolution), the desktop
TopNav was rendering up to **10 flat links** (Home, Profile, Experience,
Skills, Education, Certifications, Languages, Honors, Recommendations,
Contact). On a 1280px viewport the row felt cluttered — the links wrapped,
competed for visual weight, and pushed the theme toggle off-balance. The
editorial redesign (ADR-001) raised the visual standard for the rest of the
page, and the nav was the most visible element that hadn't been refined.

The user requested a redesign that "doesn't look good" because of the
menu count.

## Decision

Replace the flat 10-link row with a **curated two-tier navigation**:

1. **Primary row** (always visible on desktop): Home, Experience, Skills,
   Contact. Four anchors, evenly spaced, separated from the theme toggle by
   a thin vertical divider.
2. **"More" dropdown**: Profile, Education, Certifications, Languages,
   Honors, Recommendations. Only shown when at least one secondary section
   has data. Opens on click, closes on outside click / Escape / link click.
3. **Editorial styling**: uppercase primary links with `0.14em` letter-
   spacing, a thin underline that scales in from the left on hover/active,
   Playfair serif (`--font-heading`) wordmark for the brand, `ChevronDown`
   icon that rotates 180° when the dropdown is open. Mobile remains a flat
   list inside the hamburger panel.
4. **Data-driven curation**: `getNavLinks(cv)` now returns
   `{ primary, secondary }` instead of a flat list. The "Profile" anchor
   (id `about`, section heading "Profile") is intentionally demoted to the
   dropdown — the Hero already previews the summary, so a top-nav slot was
   redundant. Sections without data drop out of the dropdown automatically
   (same behavior as before).

### Visual direction (matches the editorial design system from ADR-001)

```text
─── SM monogram ────────────────────────── ☾ ──
HOME   EXPERIENCE   SKILLS   ▾MORE   CONTACT
```

- Primary: `text-[0.72rem] font-semibold uppercase tracking-[0.14em]`
- Hover/active: scale-in underline (`origin-left scale-x-0` → `scale-x-100`,
  200ms)
- Dropdown panel: `min-w-[14rem]`, white/95 with backdrop-blur, soft shadow,
  `border-slate-200`. Active item highlighted with `bg-accent-50`.
- Theme toggle isolated by a `border-l border-slate-200 pl-3` divider.

## Consequences

### Positive

- Desktop row drops from 10 links to 4 + 1 button, dramatically reducing
  visual noise.
- Curated ordering puts the most important sections (Experience, Skills,
  Contact) front and center.
- "More" dropdown still gives every section a direct path — no information
  is hidden behind scrolling.
- Active-section highlight now works for sections inside the dropdown (the
  "More" button itself gets the accent color when a secondary section is
  the current one in the viewport).
- Editorial type (uppercase + tracking + Playfair brand) matches the rest
  of the site after ADR-001.
- Mobile stays simple — hamburger panel still lists every section flat.

### Negative

- One extra click to reach Profile, Education, Certifications, Languages,
  Honors, Recommendations. Acceptable because the dropdown is one click
  and keyboard-accessible.
- TopNav API now takes `links` (primary) + optional `secondary`. The page
  component is updated; any future consumer must pass both.
- Footer and Hero tests are unaffected; only nav tests grew from 8 to 31
  (added dropdown coverage: open/close, Escape, outside click, menuitem
  rendering, mobile flat list, chevron rotation).

### Neutral

- The original 3-bolt story plan remains formally complete; this is layered
  on top as free-form evolution, same as ADR-001 … ADR-004.
- `getNavLinks` returns a structured `NavGroups` object now; a new
  `getFlatNavLinks` helper preserves the old flat shape for the mobile
  panel and any future callers.

## Alternatives Considered

- **Reduce to 4 absolute essentials (Home, Experience, Skills, Contact),
  hide all other sections from the nav entirely.** Rejected — Education,
  Honors, Recommendations, and the rest are still on the page and benefit
  from a one-click path. The dropdown gives every section a home without
  the visual cost.
- **Mega-menu / hover panel on "About".** Rejected — adds layout
  complexity, hover behavior is hostile to touch and keyboard users, and
  doesn't fit the calm editorial aesthetic.
- **Pill / chip styling with icons.** Rejected — looks more app-like and
  would clash with the editorial typography established by ADR-001.
- **Just shrink the font + tighten spacing, keep all 10 links.** Briefly
  considered. It would have solved the wrap problem but not the cognitive
  overload — 10 equally weighted links still look like a sitemap.

## Notes

- Privacy invariant: the dropdown renders the same `id` attributes as
  before (`#education`, `#honors`, etc.), so the public-render check
  (`grep -c "Chunkhola\|House 263" .next/server/app/index.html` → 0) is
  still enforced and still passes.
- Tests grew from 90 to 196 across the project; the nav test file alone
  jumped from 8 to 31 cases.
- No new dependencies. Only `lucide-react` `ChevronDown` (already
  available from prior bolts).
