# Sanjit Majumdar — Portfolio

A clean, accessible single-page portfolio website for Sanjit Majumdar (Senior Software Engineer II), built from `docs/LinkedIn_CV.json` and deployed to Vercel.

**Live**: [sanjit-dev.vercel.app](https://sanjit-dev.vercel.app)

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode, `noUncheckedIndexedAccess`)
- **Styling**: Tailwind CSS v4 (CSS-first config via `@theme`)
- **Validation**: Zod (build-time data validation; build fails on bad CV JSON)
- **Package manager**: bun
- **Hosting**: Vercel (auto-detected via `bun.lock`)
- **Testing**: Vitest + Testing Library + jsdom (87 tests across 17 files)

## Features

- **Single-page portfolio** with all 9 sections (Hero, About, Experience, Skills, Education, Certifications, Languages, Honors, Contact)
- **Sticky nav with scroll-spy** + mobile hamburger menu
- **Light/dark theme toggle** with no-FOUC bootstrap and `localStorage` persistence
- **Full SEO**: title, description, Open Graph, Twitter Card, `/sitemap.xml`, `/robots.txt`, generated favicon
- **Privacy by type system**: home address is in the source JSON but unreachable at the TypeScript level — components receive `PublicContact` (with `address` omitted) and cannot render the address even by accident
- **"Last updated" footer** captured at build time
- **108 kB First Load JS** (well under the 200 kB target)
- **WCAG 2.1 AA target**: semantic HTML, keyboard navigation, `prefers-reduced-motion` respected, focus rings

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
| `bun run test`         | Run Vitest unit tests (87 tests)                                |
| `bun run test:watch`   | Run Vitest in watch mode                                        |

## Project structure

```
.
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                  # Root layout (metadata, no-FOUC script, fonts)
│   │   ├── page.tsx                    # Home page (composes all sections)
│   │   ├── page.test.tsx               # Full-page privacy test
│   │   ├── robots.ts                   # /robots.txt route
│   │   ├── sitemap.ts                  # /sitemap.xml route
│   │   └── globals.css                 # Tailwind directives + design tokens
│   ├── components/
│   │   ├── nav/                        # TopNav (sticky + scroll-spy + mobile menu)
│   │   ├── theme/                      # ThemeToggle (light/dark)
│   │   ├── layout/                     # Footer (last-updated)
│   │   ├── hero/                       # HeroSection
│   │   ├── about/                      # AboutSection
│   │   ├── experience/                 # ExperienceSection + ExperienceCard
│   │   ├── skills/                     # SkillsSection
│   │   ├── education/                  # EducationSection + EducationCard
│   │   ├── certifications/             # CertificationsSection
│   │   ├── languages/                  # LanguagesSection
│   │   ├── honors/                     # HonorsSection
│   │   ├── contact/                    # ContactSection + ContactRow
│   │   └── shared/                     # Container, Section, Heading, Tag, Card
│   └── lib/
│       ├── cv-types.ts                 # Zod schemas + TypeScript types
│       ├── cv-data.ts                  # Validated CV data loader (build-time)
│       └── cv-data.test.ts             # Vitest tests
├── docs/
│   └── LinkedIn_CV.json                # Source of truth (validated at build time)
├── public/
│   └── icon.svg                        # Generated favicon
├── memory-bank/                        # AI-DLC planning artifacts
└── .specsmd/                           # specsmd framework
```

The `@/*` path alias maps to `./src/*`. The `docs/` folder lives outside `src/` so the CV JSON stays a distinct source-of-truth artifact, not buried inside app code.

## How to update the CV

1. Edit `docs/LinkedIn_CV.json` (the source of truth)
2. Commit and push to `main`
3. Vercel auto-deploys; the new "Last updated" timestamp appears in the footer

If the JSON is malformed (missing field, wrong type), the build fails with a clear Zod error. Fix the JSON and re-deploy.

## Privacy

The home address is present in `docs/LinkedIn_CV.json` for record-keeping, but the rendering layer **never** displays it. This is enforced at the TypeScript type level via `PublicContact = PersonalInfo.omit({ address: true })`. Components that render contact info receive `PublicContact`, not `PersonalInfo`. The privacy guarantee is verified at four layers:

1. **Compile-time**: TypeScript refuses to compile `contact.address` access
2. **Unit tests**: `HeroSection.test.tsx` and `ContactSection.test.tsx` assert no address fragments in rendered text
3. **End-to-end test**: `app/page.test.tsx` renders the full `Home` page to a string and asserts zero address fragments
4. **Build artifact grep**: `cv-data.test.ts` reads the built HTML and asserts the address is absent

## Deployment

The site is deployed to Vercel at **https://sanjit-dev.vercel.app**.

Current deployment flow (manual via Vercel CLI):

```bash
# One-time setup
npm install -g vercel
VERCEL_TOKEN=<your-token> vercel link --yes

# Deploy to production
VERCEL_TOKEN=<your-token> vercel deploy --prod --yes
```

**To enable auto-deploy on push:**

1. Go to https://vercel.com/super-max1/my-portfolio/settings/git
2. Click "Connect Git Repository"
3. Authorize and select `sanjitdev/my-portfolio`
4. Future pushes to `main` will auto-deploy; PRs get preview URLs

No `vercel.json` is needed. Vercel auto-detects Next.js + bun (via the committed `bun.lock`). For a custom domain, set `NEXT_PUBLIC_SITE_URL` in the Vercel project settings (it defaults to `https://sanjit-dev.vercel.app`).

## Accessibility

- WCAG 2.1 AA target
- Semantic HTML (`<section>`, `<h1>` (hero only) / `<h2>` (sections) / `<h3>` (cards))
- Keyboard-navigable with visible focus rings
- `prefers-reduced-motion` respected (no smooth scroll, no transitions)
- Theme toggle respects system preference on first visit; subsequent toggles persist
- Color contrast meets AA in both light and dark modes
