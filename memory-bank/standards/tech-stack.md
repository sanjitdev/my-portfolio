# Tech Stack

## Overview

Modern React-based single-page portfolio site using Next.js (App Router) for fast Vercel deployment, Tailwind CSS for utility-first styling, and TypeScript for type safety. Static CV data is sourced from `docs/LinkedIn_CV.json` and bundled at build time — no backend or database is required.

## Languages

**TypeScript** (strict mode)

- Catches data-shape errors at build time (critical when consuming the CV JSON)
- Excellent tooling and IDE support
- Default for Next.js projects

## Framework

**Next.js 15+ (App Router)**

- React-based with file-system routing
- Static rendering by default — perfect for a portfolio with no dynamic data
- First-class Vercel integration (zero-config deploys, edge optimizations, image optimization)
- App Router provides modern React Server Components patterns
- Easy to extend later (add a blog, contact form, or API route) without restructuring

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

**Build output**: Static site (no serverless functions needed initially)

**Source data flow**:

```text
docs/LinkedIn_CV.json  →  (build-time import)  →  React components  →  Static HTML  →  Vercel CDN
```

## Package Manager

**Bun**

- Extremely fast installs (often 10-30× faster than npm)
- Drop-in compatible with the npm registry
- Built-in test runner and bundler (though we use Next.js's bundler for the app)
- Vercel detects bun automatically when a `bun.lockb` is committed

## Decision Relationships

- **Next.js + Vercel**: Tightly integrated — Vercel is built by the Next.js team. Optimized build pipeline, image optimization, and edge functions work out of the box.
- **TypeScript + Static JSON**: Type-safe access to CV data with auto-completion in IDEs; schema mismatches are caught at compile time.
- **Tailwind + Next.js**: Official Tailwind setup for Next.js is well-documented; JIT compilation keeps CSS bundle minimal.
- **No backend → no auth → no data-stack standard needed**: Frontend-only architecture means we skip the data-stack standard.
