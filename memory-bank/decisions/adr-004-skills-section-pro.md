---
id: adr-004
title: Recruiter-grade Skills section with curated manifest, two-zone layout, proficiency dots, and years-of-use hints
status: accepted
date: 2026-10-09
bolt: post-bolt-evolution (free-form, not in original 3-bolt plan)
commit: pending
supersedes: null
---

# ADR-004: Skills Section Pro — two-zone layout with depth signals

## Context

The original Skills section (ADR-001 / bolt 002) rendered `cv.top_skills` — three LinkedIn auto-suggested labels ("Team Collaboration", "Subject Indexing", "Optimization") — as a flat categorized grid. Two problems became clear:

1. **Wrong content for recruiters.** The actual stack (C# .NET Core, Angular, TypeScript, SQL Server, REST APIs, Android, nopCommerce, Entity Framework, performance optimization) is buried in `experience[].responsibilities` and never surfaced. A senior engineer's portfolio should advertise the stack, not the LinkedIn algorithm's labels.
2. **No depth signals.** Even when stack items were displayed, there was no way to distinguish "I shipped this in production for 7 years" from "I've used this in a side project." Recruiters scanning fast need to see depth at a glance.

The original 4-category heuristic also missed Mobile, Architecture & Practices, and any professional / "how I work" track.

## Decision

Replace the section with a curated, recruiter-grade design:

1. **Curated manifest in code** at `src/lib/skill-profile.ts`. The CV JSON stays untouched (it's the user's source of truth). The manifest gives us full control over what shows up.

2. **Eight categories total** — 7 technical + 1 professional:
   - Languages & Runtimes
   - Backend & APIs
   - Frontend
   - Databases & Data
   - Mobile
   - Cloud & DevOps
   - Architecture & Practices
   - **"How I Work"** (professional skills — mentoring, async collab, stakeholder comms, system design, remote-first work)

4. **Three recruiter-grade visual signals** layered onto each chip:
   - **Two-zone layout** — visual split between "Technical Stack" (left/top) and "How I Work" (right/bottom). Different visual treatment: chips for tech, icon + context cards for soft skills.
   - **Proficiency dot** — small filled (expert) / half-tone (proficient) / outlined (working) circle next to each skill. Decorative (`title` attribute for hover hint).
   - **Years-of-use hint** — monospace `· 7y` after each skill name, computed from CV `experience[].start_date` using a category-level anchor (e.g. "Languages & Runtimes" anchors to keywords `['C#', 'TypeScript', 'JavaScript', 'Java', 'SQL']` → looks up the earliest matching experience → November 2018 → 7 years in 2026).

5. **Date parser** — `parseMonthYear('November 2018')` returns a `Date`. Critical because `Date.parse('November 2018')` returns NaN in V8 (it requires "Month Day, Year"). This was the missing piece — without it, every years-hint would show 0.

6. **Section id stays `skills`** so the TopNav scroll-spy keeps working.

7. **Components created**:
   - `src/lib/skill-profile.ts` — types, parser, years-of-use helpers, curated manifest
   - `src/components/skills/SkillChip.tsx` — chip with dot + name + years hint
   - `src/components/skills/HowIWorkCard.tsx` — icon + name + context card for soft skills
   - `src/components/skills/SkillsSection.tsx` — rewritten two-zone layout

## Consequences

### Positive

- Recruiters see the actual stack at a glance — C#, .NET Core, Angular, SQL Server, Android.
- Each chip carries depth signals (proficiency + years) that distinguish a senior candidate from a junior one.
- The "How I Work" zone surfaces the human layer (mentoring, async, system design) that screeners look for in senior resumes.
- Years hints are derived from real CV data — they can't drift from the experience timeline.
- CV JSON remains the user's source of truth; the manifest is a separate, easy-to-edit file.
- New tests: 25 (115 total, was 90). Privacy invariant preserved (0 address fragments in built HTML).
- Bundle budget held — a few more lucide icons (tree-shaken) and 2 new server components add ~1-2 kB.

### Negative

- The manifest is now a separate file that has to be kept in sync with the user's actual stack. If new skills are added to the experience section, the manifest needs a manual update. **Mitigation**: top-of-file comment lists the source CV section.
- Years hints are computed from keyword matching in `responsibilities[]`. If a keyword is misspelled or paraphrased in the CV, the count might be 0 for that category. **Mitigation**: keywords are case-insensitive substring matches; the manifest lists multiple variants (`'.NET Core', '.NET'`).
- Test for TypeScript is `getAllByText` because TypeScript appears in two categories (Languages & Frontend). Test impact is minimal.

### Neutral

- Section length is longer (7 technical categories × ~5 skills + 6 professional cards). On mobile, it scrolls ~1500px. This is intentional — recruiters expect to see this.
- The `cv.top_skills` field is no longer displayed. Its 3 weak values are dropped silently. If the CV JSON is updated with new `top_skills`, they won't appear anywhere.

## Alternatives Considered

- **Add structured `skills` field to CV JSON.** Rejected — the JSON is the user's narrative data; skills are display data. Editing the JSON for visual polish would feel like overhead. A code manifest is more flexible.
- **Auto-derive skills from experience responsibilities using a known dictionary.** Rejected — brittle (misses skills you used but didn't mention, includes skills you haven't used in years). Curated manifest is honest.
- **Tooltips / hover-reveal context per chip.** Considered; deferred to v3. The user picked three visual signals (zone + dot + years); tooltips would be a fourth.
- **Skill count badge per category** (e.g., "Languages · 6"). Rejected — the per-chip years hint already conveys depth; a count would be redundant.

## Notes

If the user updates their CV (e.g., picks up Kubernetes), the manifest in `src/lib/skill-profile.ts` needs a single-line addition. No schema migration. The skill section reads the manifest directly.

The `_not-found` route uses a different `id` (`top`, `about`, …) — this change doesn't affect it.