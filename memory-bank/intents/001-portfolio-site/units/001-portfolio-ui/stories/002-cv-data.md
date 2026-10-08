---
id: 002-cv-data
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: complete
priority: must
created: '2026-10-08T20:52:00Z'
assigned_bolt: 001-portfolio-ui-foundation
implemented: true
---

# Story: 002-cv-data

## User Story

**As a** developer
**I want** a typed, validated data loader for `docs/LinkedIn_CV.json` with build-time failure
**So that** the rest of the app can rely on correct data and a malformed CV fails the build instead of silently rendering empty

## Acceptance Criteria

- [ ] **Given** `docs/LinkedIn_CV.json` matches the expected schema, **When** I import `loadCvData()`, **Then** it returns a fully typed `CvData` object
- [ ] **Given** `docs/LinkedIn_CV.json` is missing a required field, **When** I run `bun run build`, **Then** the build fails with a Zod error pointing to the missing field
- [ ] **Given** `docs/LinkedIn_CV.json` has wrong types (e.g., string where number expected), **When** I run `bun run build`, **Then** the build fails with a clear Zod type error
- [ ] **Given** the home address field exists in the JSON, **When** I call `getDisplayContact(cv)`, **Then** the returned object does NOT include the address
- [ ] **Given** Vitest is configured, **When** I run `bun run test`, **Then** tests for `lib/cv-data.ts` pass (success case, missing-field failure case, address-redaction case)
- [ ] **Given** I import `formatDateRange('2026-01', null)`, **When** it runs, **Then** it returns `"January 2026 – Present"`
- [ ] **Given** I import `computeBuildTimestamp()`, **When** it runs at build time, **Then** it returns the current ISO 8601 timestamp

## Technical Notes

- Use `zod` for schema definition and validation
- Place types in `lib/cv-types.ts` (kebab-case per `standards/coding-standards.md`)
- Place loader in `lib/cv-data.ts`
- Schema covers all fields: `name`, `current_title`, `headline`, `location`, `phone`, `email`, `address` (mark as optional/visible-to-self), `linkedin`, `website`, `summary`, `top_skills[]`, `languages[][2]`, `certifications[]`, `honors_awards[]`, `experience[]`, `education[]`
- `address` field: validate as optional string but **filter out** in `getDisplayContact()` — never expose it to rendering code
- Import JSON directly: `import cvData from '@/../docs/LinkedIn_CV.json'` (or use Node's `fs.readFileSync` with a path relative to project root)
- The build-time import will fail Next.js's type check if JSON is malformed; Zod validation adds runtime safety
- Vitest tests in `lib/cv-data.test.ts` co-located

## Dependencies

### Requires
- 001-bootstrap (project scaffold with TypeScript + Vitest + zod installed)

### Enables
- All section-rendering stories (004–012) — they all consume the typed CV data
- 013-nav, 014-theme (need theme-aware data)
- 016-deploy (last-updated timestamp uses `computeBuildTimestamp()`)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty `top_skills` array | Skills section renders empty (no error) |
| Experience with no responsibilities | Renders experience with empty bullet list |
| Missing optional `address` | `getDisplayContact` returns object missing the address key (no error) |
| Unicode in name/summary | Rendered as-is (no encoding issues) |
| Very long summary (>1000 chars) | Rendered with normal line wrapping (no truncation) |

## Out of Scope

- Editing the CV JSON itself (that's the candidate's responsibility)
- Multiple CVs / language switching (out of scope for v1)
- Caching strategy (data is static, no need)