---
id: 001-bootstrap
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: complete
priority: must
created: '2026-10-08T20:52:00Z'
assigned_bolt: 001-portfolio-ui-foundation
implemented: true
---

# Story: 001-bootstrap

## User Story

**As a** developer
**I want** a scaffolded Next.js + Tailwind + bun project with Vercel-ready configuration
**So that** I can start implementing portfolio sections on a working toolchain

## Acceptance Criteria

- [ ] **Given** I clone the repo, **When** I run `bun install`, **Then** all dependencies install without errors
- [ ] **Given** dependencies are installed, **When** I run `bun run dev`, **Then** the dev server starts on `http://localhost:3000` and shows a placeholder page
- [ ] **Given** I run `bun run build`, **When** the build completes, **Then** a `.next/` directory is produced with no errors
- [ ] **Given** the project is set up, **When** I push to a Git remote linked to Vercel, **Then** Vercel auto-detects Next.js and runs `bun install && bun run build` successfully
- [ ] **Given** TypeScript strict mode is enabled, **When** I introduce a type error, **Then** the build fails with a clear type error message
- [ ] **Given** ESLint is configured, **When** I run `bun run lint`, **Then** the placeholder code passes lint
- [ ] **Given** Prettier is configured, **When** I run `bun run format`, **Then** no files change (they're already formatted)
- [ ] **Given** Tailwind is configured, **When** I add a `text-sky-600` element, **Then** the corresponding CSS appears in the output

## Technical Notes

- Use `bun create next-app` (or equivalent) with: TypeScript yes, ESLint yes, Tailwind yes, App Router yes, src directory no, customize import alias yes (`@/*`).
- `package.json` scripts: `dev`, `build`, `start`, `lint`, `format`, `format:check`, `test`
- `next.config.ts` (TypeScript config, not `.js`)
- `tailwind.config.ts` with the color palette defined in `standards/ux-guide.md`
- `tsconfig.json` with `"strict": true` and `"noUncheckedIndexedAccess": true`
- `.eslintrc.json` extending `next/core-web-vitals` and `next/typescript`
- `.prettierrc` with the formatting settings from `standards/coding-standards.md`
- Add `.gitignore` entries for `.next/`, `node_modules/`, `bun.lockb` is **committed** (not ignored)
- `bun.lockb` must be present for Vercel to use bun
- Self-host fonts via `next/font/google` for `Inter` and `JetBrains Mono`

## Dependencies

### Requires
- None (first story)

### Enables
- All other stories (provides the scaffold)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| `bun` not installed | README clearly states "Install bun from https://bun.sh" |
| Node.js version mismatch | Document minimum Node version (18.18+) in README |
| Windows path issues with `.next` | Document `cross-env` not needed; bun handles it |

## Out of Scope

- Actual portfolio content (placeholder page only)
- Data validation (story 002)
- Component primitives (story 003)
- Any deployment automation beyond Vercel auto-detect