# Sanjit Majumdar — Portfolio

A clean, accessible single-page portfolio website for Sanjit Majumdar (Senior Software Engineer II), built from `docs/LinkedIn_CV.json` and deployed to Vercel.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Validation**: Zod (build-time data validation)
- **Package manager**: bun
- **Hosting**: Vercel (auto-detected)

## Prerequisites

- [bun](https://bun.sh) v1.1+ (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 18.18+ (Vercel runtime requirement)

## Getting started

```bash
# Install dependencies
bun install

# Run the dev server
bun run dev

# Open http://localhost:3000
```

## Scripts

| Command                | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `bun run dev`          | Start Next.js dev server on http://localhost:3000               |
| `bun run build`        | Production build (validates CV JSON via Zod; fails on bad data) |
| `bun run start`        | Serve the production build                                      |
| `bun run lint`         | Run ESLint (Next.js + TypeScript rules)                         |
| `bun run format`       | Format the codebase with Prettier                               |
| `bun run format:check` | Verify formatting without writing                               |
| `bun run test`         | Run Vitest unit tests                                           |
| `bun run test:watch`   | Run Vitest in watch mode                                        |

## Project structure

```
.
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx      # Root layout (fonts, metadata)
│   │   ├── page.tsx        # Home page (single-page portfolio)
│   │   └── globals.css     # Tailwind directives + design tokens
│   ├── components/
│   │   └── shared/         # Reusable primitives
│   │       ├── Container.tsx
│   │       ├── Section.tsx
│   │       ├── Heading.tsx
│   │       ├── Tag.tsx
│   │       ├── Card.tsx
│   │       └── shared.test.tsx
│   └── lib/
│       ├── cv-types.ts     # Zod schemas + TypeScript types
│       ├── cv-data.ts      # Validated CV data loader (build-time)
│       └── cv-data.test.ts # Vitest tests
├── docs/
│   └── LinkedIn_CV.json    # Source of truth (DO NOT MODIFY via build)
├── memory-bank/            # AI-DLC planning artifacts
└── .specsmd/               # specsmd framework
```

The `@/*` path alias maps to `./src/*`. The `docs/` folder lives outside `src/` so the CV JSON stays a distinct source-of-truth artifact, not buried inside app code.

## How to update the CV

1. Edit `docs/LinkedIn_CV.json` (the source of truth)
2. Commit and push to `main`
3. Vercel auto-deploys; the new "Last updated" timestamp appears in the footer

If the JSON is malformed (missing field, wrong type), the build fails with a clear Zod error. Fix the JSON and re-deploy.

## Privacy

The home address is present in `docs/LinkedIn_CV.json` for record-keeping, but the rendering layer **never** displays it. This is enforced at the TypeScript type level via `PublicContact = PersonalInfo.omit({ address: true })`. Components receive `PublicContact`, not `PersonalInfo`.

## Deployment

The site deploys to Vercel automatically:

1. Push to a branch → preview URL generated
2. Merge to `main` → production deploy

No `vercel.json` is needed. Vercel auto-detects Next.js + bun (via the committed `bun.lockb`).

## Accessibility

- WCAG 2.1 AA target
- Semantic HTML (`<section>`, `<h1>`/`<h2>`/`<h3>`, etc.)
- Keyboard-navigable with visible focus rings
- `prefers-reduced-motion` respected
- Color contrast meets AA in both light and dark modes
