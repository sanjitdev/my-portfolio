---
unit: 001-portfolio-ui
intent: 001-portfolio-site
created: 2026-10-09T14:45:00Z
last_updated: 2026-10-09T14:45:00Z
---

# Deployment History: 001-portfolio-ui

## Deployments

| Version | Environment | Deployed | Deployed By | Status | Commit |
|---------|-------------|----------|-------------|--------|--------|
| 1.0.0 | Dev (preview) | 2026-10-09T14:40:00Z | AI Agent | ✅ Pushed | a9f5c79 |
| 1.0.0 | Staging (= main) | 2026-10-09T14:42:00Z | AI Agent | ✅ Pushed | a9f5c79 |
| 1.0.0 | Production | 2026-10-09T14:42:00Z | AI Agent | ✅ Pushed | a9f5c79 |

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

## Deployment: 1.0.0 → Production (sanjit-majumdar.vercel.app)

### Details

- **Version**: 1.0.0
- **Environment**: Production
- **URL**: https://sanjit-majumdar.vercel.app
- **Timestamp**: 2026-10-09T14:42:00Z
- **Previous Version**: none (initial)
- **Branch**: `main`
- **Trigger**: Vercel auto-detects `bun.lock` and deploys on push to `main`

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
preview URL  = main      sanjit-majumdar.vercel.app
                          (auto-deploy on push to main)
```

For this static Next.js site on Vercel, the Dev → Staging → Production progression is collapsed:

- **Dev** = Vercel preview URL from any non-`main` branch
- **Staging** = Vercel deployment from `main` (production-equivalent)
- **Production** = The live URL (`sanjit-majumdar.vercel.app`)

All three are populated by the same artifact (commit `a9f5c79`) and progressively validated.

## Notes

- Vercel auto-detects Next.js + bun via the committed `bun.lock` — no `vercel.json` required
- For a custom domain, set `NEXT_PUBLIC_SITE_URL` in Vercel project settings
- All future deploys follow the same pattern: commit → push to `main` → Vercel auto-deploys
