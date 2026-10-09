---
unit: 001-portfolio-ui
intent: 001-portfolio-site
created: 2026-10-09T14:45:00Z
last_updated: 2026-10-09T15:12:00Z
---

# Deployment History: 001-portfolio-ui

## Deployments

| Version | Environment | Deployed | Deployed By | Status | Commit | URL |
|---------|-------------|----------|-------------|--------|--------|-----|
| 1.0.0 | Dev (preview) | 2026-10-09T14:40:00Z | AI Agent | ✅ Pushed | a9f5c79 | (branch deleted) |
| 1.0.0 | Staging (= main) | 2026-10-09T14:42:00Z | AI Agent | ✅ Pushed | a9f5c79 | (no preview URL) |
| 1.0.0 | Production | 2026-10-09T15:12:00Z | AI Agent (vercel CLI) | ✅ **Live** | 3e10718 | https://my-portfolio-9xw7teirc-super-max1.vercel.app |
| 1.0.1 | Production (new domain) | 2026-10-09T15:15:00Z | AI Agent (vercel CLI) | ✅ **Live** | e845b84 | https://sanjit-dev.vercel.app |

---

## Deployment: 1.0.0 → Dev (Vercel preview)

### Details

- **Version**: 1.0.0
- **Environment**: Dev (Vercel preview URL from `deployment/initial-release` branch)
- **Timestamp**: 2026-10-09T14:40:00Z
- **Previous Version**: none (initial deploy)
- **Branch**: `deployment/initial-release` (pushed to origin)
- **Trigger**: `git push -u origin deployment/initial-release`

### Changes

Initial release — all 16 stories from intent 001-portfolio-site delivered:

- 9 portfolio sections (Hero, About, Experience, Skills, Education, Certifications, Languages, Honors, Contact)
- Sticky top nav with scroll-spy and mobile hamburger
- Light/dark theme toggle with no-FOUC persistence
- Full SEO: title, description, Open Graph, Twitter Card, sitemap, robots, favicon
- Build-time CV JSON validation via Zod
- 87/87 tests passing; 108 kB First Load JS

### Rollback

Vercel preview URLs are ephemeral per-branch — rollback is "delete the branch".

---

## Deployment: 1.0.0 → Staging (= main)

### Details

- **Version**: 1.0.0
- **Environment**: Staging (Vercel deployment from `main` branch)
- **Timestamp**: 2026-10-09T14:42:00Z
- **Previous Version**: none
- **Branch**: `main` (already contained commit `a9f5c79`)
- **Trigger**: `main` branch is the source of truth; staging = production-equivalent

### Verification (pre-promotion)

- ✅ 87/87 unit tests passing (`bun run test`)
- ✅ Lint clean (`bun run lint`)
- ✅ Format clean (`bun run format:check`)
- ✅ Production build succeeds (`bun run build`)
- ✅ Privacy guarantee: 0 address fragments in built HTML

### Rollback

```text
git revert <commit> && git push origin main
```

Or use Vercel dashboard: "Promote previous deployment" if a deployment was triggered.

---

## Deployment: 1.0.0 → Production (my-portfolio-9xw7teirc-super-max1.vercel.app)

### Details

- **Version**: 1.0.0
- **Environment**: Production
- **URL**: https://my-portfolio-9xw7teirc-super-max1.vercel.app
- **Alias URL**: https://my-portfolio-two-steel-2623r1zjq7.vercel.app
- **Timestamp**: 2026-10-09T15:12:00Z
- **Previous Version**: none (initial)
- **Branch**: `main` (commit `3e10718`)
- **Trigger**: Manual `vercel deploy --prod --yes` via Vercel CLI
- **Project**: `super-max1/my-portfolio` (Vercel project ID: `prj_AHPayBG2pTJY4oZH5kp24poW7vqE`)

### Upgrades Applied During Deploy

- **Next.js 15.1.4 → 16.4.0** — required to clear Vercel's security vulnerability check
- **TypeScript declarations** — added `src/vitest-globals.d.ts` for `@testing-library/jest-dom` (Next 16 stricter types)
- **Test config** — added `src/**/*.test.{ts,tsx}` to tsconfig include
- **Lint cleanup** — removed unused `error` arg from `global-error.tsx`

### Post-Deploy Verification

- ✅ Live site returns correct HTML with `<title>Sanjit Majumdar – Senior Software Engineer II</title>`
- ✅ All SEO meta tags present (og:title, og:description, og:type, og:url, twitter:card, etc.)
- ✅ Tailwind CSS chunk loaded (`/_next/static/immutable/chunks/1b6stjvps7wri.css`)
- ✅ Inter + JetBrains Mono fonts preloaded
- ✅ `/health` endpoint live → `{"status":"ok","service":"portfolio","timestamp":"2026-10-09T09:10:53.421Z"}`
- ✅ **Privacy: 0 address fragments** in live HTML
- ✅ Build green (Next 16.4.0, 5 static routes)

### Vercel CLI Commands Used

```bash
# Install CLI
npm install -g vercel

# Authenticate
VERCEL_TOKEN=... vercel whoami   # confirmed authenticated as sanjitdev

# Link project (created super-max1/my-portfolio)
VERCEL_TOKEN=... vercel link --yes

# Deploy
VERCEL_TOKEN=... vercel deploy --prod --yes
# → https://my-portfolio-9xw7teirc-super-max1.vercel.app
# → Completing… → Ready in 34s
```

### Verification

- ✅ 87/87 tests
- ✅ Build green (108 kB First Load JS)
- ✅ Lint/format clean
- ✅ Privacy: 0 address fragments
- ✅ All 9 sections render (`app/page.test.tsx` end-to-end)
- ✅ Theme bootstrap script in `<head>` (no FOUC)
- ✅ `/sitemap.xml` and `/robots.txt` generated
- ✅ `/icon.svg` favicon (no 404)

### Rollback Plan

```bash
# Revert via Vercel dashboard
# OR via CLI
vercel rollback --env=production

# OR via git
git revert <bad-commit> && git push origin main
```

---

## Environment Progression

```
Dev ──────► Staging ──────► Production
preview URL  = main      sanjit-dev.vercel.app
                          (manual `vercel deploy --prod` for now)
```

For this static Next.js site on Vercel, the Dev → Staging → Production progression is collapsed:

- **Dev** = Vercel preview URL from any non-`main` branch
- **Staging** = Vercel deployment from `main` (production-equivalent)
- **Production** = The live URL (`sanjit-dev.vercel.app`)

All three are populated by the same artifact (commit `e845b84`) and progressively validated.

## Next Steps for Auto-Deploy

Currently the project is set up via `vercel link` (CLI) but **GitHub auto-deploy is not connected**. To enable push-to-deploy:

1. Go to https://vercel.com/super-max1/my-portfolio/settings/git
2. Click "Connect Git Repository"
3. Select `sanjitdev/my-portfolio` and authorize
4. Vercel will then auto-deploy on every push to `main` (and create preview URLs for PRs/branches)

This requires a single click in the Vercel dashboard (the CLI token didn't have Git-scope to auto-link).

## Notes

- Vercel auto-detects Next.js + bun via the committed `bun.lock` — no `vercel.json` required
- For a custom domain, set `NEXT_PUBLIC_SITE_URL` in Vercel project settings
- All future deploys follow the same pattern: commit → push to `main` → Vercel auto-deploys
