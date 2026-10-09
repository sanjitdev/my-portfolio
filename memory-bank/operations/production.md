# Operations: Production State

**Last updated**: 2026-10-09T17:30:00Z
**Maintained by**: Master Agent (routed to Operations when production context changes)

---

## Live Deployment

| Field | Value |
|-------|-------|
| **Production URL** | https://sanjit-dev.vercel.app |
| **Hosting** | Vercel |
| **Account** | super-max1 (Vercel CLI) |
| **Custom domain** | sanjit-dev.vercel.app (auto-aliased) |
| **Framework** | Next.js 16 (App Router, static export) |
| **Region** | Global CDN (Vercel edge network) |
| **SSL** | Automatic via Vercel |
| **Authentication** | Vercel Authentication (project-level deployment protection). Use `vercel curl` to verify live state. |

## Build Configuration

- **Build command**: `bun run build` (auto-detected by Vercel)
- **Package manager**: Bun (via `bun.lock` committed to repo)
- **Build output**: Static (5 routes: `/`, `/_not-found`, `/health`, `/robots.txt`, `/sitemap.xml`)
- **Node version**: Detected automatically by Vercel
- **First Load JS budget**: < 130 kB (target — current build is in spec)

## Source Data

- **CV data**: `docs/LinkedIn_CV.json` (bundled at build time, no runtime fetch)
- **Profile photo**: `docs/sanjit_photo.png` (source) → `public/sanjit_photo-{640,960,1280}w.webp` + `public/sanjit_photo.png` (optimized)
- **Favicon**: `public/icon.svg` (SM monogram + green dot)
- **Schema validation**: Zod at module load — `bun run build` fails if CV JSON is malformed

---

## Deployment History

| Commit | Date | Description | Bolt/ADR |
|--------|------|-------------|----------|
| `6f67a8b` | 2026-10-09 | Add profile photo to hero with elegant backdrop ring | ADR-003 |
| `c7ad81a` | 2026-10-09 | Convert experience to editorial timeline with collapsible details | ADR-002 |
| `832cc82` | 2026-10-09 | Editorial typography + monogram + resume download | ADR-001 |
| `255abca` | 2026-10-09 | chore: ignore .puku-cli (session state) | infra |
| `6a41cf3` | 2026-10-08 | Fix analytics import path | bolt-003 |
| `657c605` | 2026-10-08 | Record domain switch in deployment history | bolt-003 |
| `e845b84` | 2026-10-08 | Switch production domain to sanjit-dev.vercel.app | bolt-003 |
| `0b1d365` | 2026-10-08 | Update README with actual Vercel deployment URL | bolt-003 |
| `3e10718` | 2026-10-08 | Upgrade to Next.js 16 (security fix) | bolt-003 |

---

## Monitoring & Health Check

- **Health endpoint**: `/health` returns 200 OK (used by Vercel for uptime monitoring if configured)
- **Privacy invariant**: Verified on every deploy — `grep` for `Chunkhola` or `House 263` in `.next/server/app/index.html` returns 0 matches. Also enforced at the type level via `PublicContact = PersonalInfo.omit({ address: true })`.
- **Build status**: All recent builds pass (no failed deploys).
- **Tests**: 90 passing (`bun run test`) — 17 test files, covers data layer, all 9 sections, shared primitives, hero, nav, footer, theme.

### Smoke test commands (manual)

```bash
# Verify live site renders (requires VERCEL_TOKEN — set in .env.local)
vercel curl https://sanjit-dev.vercel.app

# Verify build is clean
bun run build

# Verify tests pass
bun run test

# Verify privacy invariant on built HTML
grep -c "Chunkhola\|House 263" .next/server/app/index.html  # → 0
```

---

## Environment Variables

| Variable | Purpose | Where set |
|----------|---------|-----------|
| `VERCEL_TOKEN` | Vercel CLI auth (deploy + curl) | `.env.local` (gitignored; never committed) |
| `NEXT_PUBLIC_SITE_URL` | Base URL for metadata (OG tags) | not currently set; defaults to `https://sanjit-majumdar.vercel.app` |
| Vercel auto-injected | `VERCEL_ENV`, `VERCEL_URL`, etc. | Vercel dashboard |

`.env.local` is committed to git history's `.gitignore` (per `chore: ignore .puku-cli` commit) but should NEVER be pushed. Confirmed: the file is not in the repo.

---

## Common Operations

### Deploy to production

```bash
# Requires VERCEL_TOKEN in environment (stored in .env.local, not committed)
vercel deploy --prod --yes
```

Or simply push to `main` — Vercel auto-deploys.

### Update the CV

1. Edit `docs/LinkedIn_CV.json`
2. If schema changed, update `src/lib/cv-types.ts` to match
3. `bun run build` locally to verify schema validation passes
4. Commit and push to `main`

### Replace the profile photo

1. Drop new file at `docs/sanjit_photo.png`
2. Regenerate WebP variants:
   ```bash
   node -e "const sharp = require('sharp'); const input = 'docs/sanjit_photo.png'; [640, 960, 1280].forEach(w => sharp(input).resize(w, w*1.25, { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile('public/sanjit_photo-' + w + 'w.webp'));"
   ```
3. Commit and push

### Rollback

Vercel keeps every deployment. To roll back:
1. Open Vercel dashboard → Deployments
2. Find the last good deployment
3. Click "Promote to Production"

Or via CLI:
```bash
vercel rollback <deployment-url>
```

---

## Known Constraints

- **No backend** — CV data is static. No contact form, no analytics on the server side (only client-side `@vercel/analytics`).
- **Vercel Authentication on production** — `vercel curl` is required for verification. Bypass is on the Vercel dashboard.
- **Bundle size** — Playfair Display adds ~30 kB. If budget becomes a concern, consider switching to system serif fallback only.
- **Profile photo** — Single image, not retouched. If the candidate wants a new one, follow the steps above.

---

## Future Work (Out of Scope for Current Cycle)

- Custom domain (e.g., `sanjit.dev`)
- Image-based OG card (currently uses text-only metadata)
- JSON-LD structured data
- Testimonials section
- Blog / case studies
- Multi-language support
- Real contact form (currently email/phone/LinkedIn only)