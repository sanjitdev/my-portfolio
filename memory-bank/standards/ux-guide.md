# UX Guide

## Overview

A clean, professional, content-first portfolio that lets the CV data speak for itself. Minimal motion, strong typography, excellent readability on every device. Dark mode is supported because it's a developer portfolio and that's the convention.

## Design System / Component Library

**Library**: None — hand-rolled components using Tailwind utility classes

- No UI library (no shadcn, MUI, Chakra, etc.) — keeps the bundle small and the design opinionated
- Reusable primitives in `components/shared/`: `Container`, `Section`, `Heading`, `Tag`, `Card`
- Icons: `lucide-react` (tree-shakable, clean line-style icons that match Tailwind aesthetics)

**Typography**:

- Font: **Inter** (variable, self-hosted via `next/font/google` for performance) for body text
- Headings: Same Inter font, but heavier weights (semibold/bold) — keeps things simple
- Monospace: **JetBrains Mono** for code snippets / technical details
- Loaded via `next/font` for automatic self-hosting and zero CLS

**Color palette** (Tailwind config custom colors):

- Primary text: `slate-900` (light) / `slate-100` (dark)
- Secondary text: `slate-600` (light) / `slate-400` (dark)
- Accent: `sky-600` (light) / `sky-400` (dark) — for links, highlights
- Background: `white` (light) / `slate-950` (dark)

## Styling Approach

**Tool**: Tailwind CSS v4 (latest) via the official Next.js integration

- Utility classes only — no `@apply` in component files, no separate stylesheets
- Custom theme values in `tailwind.config.ts` (extend `colors`, `fontFamily`)
- Dark mode: `class` strategy (Tailwind's `dark:` variant) — toggled by user preference stored in `localStorage`
- Responsive: Mobile-first; `sm:`, `md:`, `lg:` breakpoints only
- No CSS-in-JS libraries (no styled-components, emotion) — they conflict with Tailwind's zero-runtime approach

**Tailwind config principles**:

- Spacing: Stick to Tailwind's default scale (`p-4`, `gap-6`, etc.) — no custom spacing values
- Border radius: `rounded-lg` default, `rounded-full` for avatars/pills
- Shadows: `shadow-sm` and `shadow-md` only — keep the design flat and modern

## Accessibility Standards

**Target**: WCAG 2.1 AA compliance (industry standard, achievable without over-engineering)

**Must-have**:

- ✅ Semantic HTML (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`) — no `<div>` soup
- ✅ All interactive elements (links, buttons) have visible focus states (Tailwind's `focus-visible:ring-2`)
- ✅ Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text
- ✅ All images have `alt` text (or `alt=""` if decorative)
- ✅ Form inputs (if added) have associated `<label>`s
- ✅ Skip-to-content link at the top of `<body>` for keyboard users
- ✅ `prefers-reduced-motion` respected — disable transitions/animations for users who request it
- ✅ Heading hierarchy: one `<h1>` per page, no skipped levels

**Tools**:

- `eslint-plugin-jsx-a11y` (built into `next/core-web-vitals`) catches most issues
- Manual check with browser DevTools' Accessibility tab before deploy

## Responsive Design Strategy

**Approach**: Mobile-first, fluid layouts

**Breakpoints** (Tailwind defaults):

| Prefix | Min-width | Target |
|--------|-----------|--------|
| (none) | 0 | Mobile (< 640px) |
| `sm:` | 640px | Large phones / small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops / desktops |
| `xl:` | 1284px | Large desktops |

**Layout rules**:

- **Mobile** (< 768px): Single column, full-width sections, stacked nav, larger tap targets (44×44 px minimum)
- **Tablet** (768-1023px): Single column with wider margins
- **Desktop** (≥ 1024px): Optional 2-column layouts (e.g., about + contact side-by-side), wider content max-width

**Container max-width**: `max-w-5xl mx-auto px-6` for content sections (keeps line length ~70-80 chars — optimal for reading)

**Testing**: Manual — Chrome DevTools device emulation + real device on personal phone. No automated responsive testing (overkill for a static site).

## Motion & Interaction

**Principles**: Subtle, purposeful, never distracting

- **Page load**: Hero section fades in (200ms), then content sections stagger in (50ms delay each)
- **Scroll**: Sections use `IntersectionObserver` to add a subtle fade-in as they enter the viewport
- **Hover**: Links change color + underline; cards lift with `hover:shadow-md transition-shadow`
- **No parallax**, no scroll-jacking, no auto-playing video
- Respect `prefers-reduced-motion: reduce` — disable all transitions/animations
