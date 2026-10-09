# Tech Stack

## Overview

Modern React-based single-page portfolio site using Next.js (App Router) for fast Vercel deployment, Tailwind CSS v4 for utility-first styling, and TypeScript for type safety. Static CV data is sourced from `docs/LinkedIn_CV.json` and bundled at build time — no backend or database is required.

## Languages

**TypeScript** (strict mode)

- Catches data-shape errors at build time (critical when consuming the CV JSON)
- Excellent tooling and IDE support
- Default for Next.js projects

## Framework

**Next.js 16 (App Router)**

- React-based with file-system routing
- Static rendering by default — perfect for a portfolio with no dynamic data
- First-class Vercel integration (zero-config deploys, edge optimizations, image optimization)
- App Router provides modern React Server Components patterns
- Easy to extend later (add a blog, contact form, or API route) without restructuring

**Note**: Originally specified as "Next.js 15+" during project init (2026-10-08). Upgraded to Next.js 16 on 2026-10-09 as part of a security-update bolt (commit `3e10718`). React 19 is the React version paired with Next 16.

**Runtime**: Bun (used for installs and scripts via `bun install` / `bun run dev`)

## Authentication

**Not applicable**

This is a public portfolio site. No user accounts or private data are involved.

## Infrastructure & Deployment

**Vercel** (hosting)

- Git-based continuous deployment: push to main → automatic production deploy
- Preview deployments for every pull request (great for iterating on the portfolio)
- Free tier is sufficient for a personal portfolio
- Automatic HTTPS, custom domain support, global CDN
- Custom production domain: `sanjit-dev.vercel.app` (aliased from generated `*.vercel.app` URLs)

**Build output**: Static site (no serverless functions needed initially)

**Source data flow**:

```text
docs/LinkedIn_CV.json  →  (build-time import)  →  React components  →  Static HTML  →  Vercel CDN
```

**Deployment tool**: Vercel CLI (`vercel deploy --prod --yes`) authenticated with `VERCEL_TOKEN`. Production deploys are triggered either by `git push origin main` (Vercel auto-deploy) or by manual `vercel deploy`.

## Package Manager

**Bun**

- Extremely fast installs (often 10-30× faster than npm)
- Drop-in compatible with the npm registry
- Built-in test runner and bundler (though we use Next.js's bundler for the app)
- Vercel detects bun automatically when a `bun.lockb` is committed

## Fonts (Typography)

Loaded via `next/font/google` for self-hosting with zero CLS:

- **Inter** — body text (variable, weights 400–800)
- **Playfair Display** — headings (variable, weights 400–700); added 2026-10-09 in the editorial redesign bolt (commit `832cc82`)
- **JetBrains Mono** — monospaced accents (eyebrows, dates, stats)

Font CSS variables (`--font-inter`, `--font-playfair`, `--font-jetbrains-mono`) feed Tailwind v4 `@theme` tokens (`--font-heading`, `--font-body`, `--font-mono`).

## Icons

**lucide-react** — open-source icon set. Used throughout the site (Briefcase, MapPin, Mail, Phone, Linkedin, Globe, Trophy, BadgeCheck, Calendar, Clock, ChevronDown, Download, ArrowDown, MapPin).

## Image Optimization

**next/image** with built-in WebP conversion and responsive `srcset`. Profile photo (`public/sanjit_photo-640w.webp`, `-960w.webp`, `-1280w.webp`) is loaded with `priority` in the Hero (LCP optimization).

## Decision Relationships

- **Next.js + Vercel**: Tightly integrated — Vercel is built by the Next.js team. Optimized build pipeline, image optimization, and edge functions work out of the box.
- **TypeScript + Static JSON**: Type-safe access to CV data with auto-completion in IDEs; schema mismatches are caught at compile time.
- **Tailwind v4 + CSS variables**: Tokens live in `app/globals.css` `@theme` block — no `tailwind.config.ts` needed. Auto-generates utility classes from CSS variables.
- **No backend → no auth → no data-stack standard needed**: Frontend-only architecture means we skip the data-stack standard.