---
id: 014-theme
unit: 001-portfolio-ui
intent: 001-portfolio-site
status: complete
priority: should
created: '2026-10-08T20:52:00Z'
assigned_bolt: 001-portfolio-ui-polish
implemented: true
---

# Story: 014-theme

## User Story

**As a** visitor
**I want** to switch between light and dark themes, with my preference saved for next time
**So that** I can read the portfolio comfortably in any lighting condition

## Acceptance Criteria

- [ ] **Given** I visit the site for the first time, **When** my OS prefers dark mode, **Then** the site renders in dark mode
- [ ] **Given** I visit the site for the first time, **When** my OS prefers light mode, **Then** the site renders in light mode
- [ ] **Given** the page is loading, **When** the HTML is parsed, **Then** the theme is applied BEFORE React hydrates (no flash of wrong theme)
- [ ] **Given** I'm in light mode, **When** I click the theme toggle, **Then** the site switches to dark mode immediately
- [ ] **Given** I'm in dark mode, **When** I click the theme toggle, **Then** the site switches to light mode immediately
- [ ] **Given** I've toggled the theme, **When** I reload the page, **Then** my choice persists (via `localStorage`)
- [ ] **Given** the toggle is in the nav, **When** I view it, **Then** it shows the icon for the **opposite** of the current theme (moon icon in light mode, sun icon in dark mode)
- [ ] **Given** the toggle is in the nav, **When** I focus it via keyboard, **Then** it has a visible focus ring
- [ ] **Given** screen readers, **When** they encounter the toggle, **Then** it has an `aria-label` like "Switch to dark mode" / "Switch to light mode"
- [ ] **Given** dark mode is active, **When** I view any section, **Then** all colors meet WCAG AA contrast

## Technical Notes

- Theme toggle button lives in `components/nav/TopNav.tsx` (or its own `components/theme/ThemeToggle.tsx` for cleanliness)
- **No-FOUC pattern** (critical):
  1. In `app/layout.tsx`, add a `<script>` BEFORE any rendered content that:
     - Reads `localStorage.getItem('theme-preference')`
     - Falls back to `window.matchMedia('(prefers-color-scheme: dark)').matches`
     - Sets `class="dark"` on `<html>` if dark mode
  2. Configure Tailwind: `darkMode: 'class'`
- Toggle component (client):
  - Use `useEffect` to read current theme from `document.documentElement.classList`
  - On click: toggle class, save to `localStorage`
- Icons: `Sun` and `Moon` from `lucide-react`
- All section components must use Tailwind's `dark:` variants (this should already be the case if 003-shared-components was done right)

## Dependencies

### Requires
- 001-bootstrap (Tailwind configured with `darkMode: 'class'`)
- 013-nav (toggle lives in the nav)

### Enables
- None (cross-cutting concern)

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| `localStorage` unavailable (private mode) | Fall back to in-memory; no crash |
| Corrupted `localStorage` value | Ignore it, fall back to system preference |
| Rapid clicking | Each click is handled; last write wins |
| System preference changes after first visit | Not auto-applied (user's explicit choice is sticky) |

## Out of Scope

- System preference change listener (would require `matchMedia.addEventListener`; out of scope for v1)
- Custom color themes (e.g., "sepia") — only light/dark for v1
- Theme picker UI (just a toggle button)