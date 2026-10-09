---
intent: 001-portfolio-site
phase: inception
status: complete
created: '2026-10-08T20:46:00Z'
updated: '2026-10-08T20:48:00Z'
---

# Requirements: Personal Portfolio Site from LinkedIn CV

## Intent Overview

Build a clean, modern single-page portfolio website for **Sanjit Majumdar (Senior Software Engineer II)** that renders structured information from `docs/LinkedIn_CV.json` as elegant, accessible web sections. The site is a static Next.js application with no backend, deployed to Vercel, and serves as a professional showcase of experience, skills, certifications, and contact information.

## Business Goals

| Goal | Success Metric | Priority |
|------|----------------|----------|
| Establish a personal web presence | Site live at a public Vercel URL | Must |
| Showcase professional experience clearly | All CV experience entries render with company, title, dates, responsibilities | Must |
| Make contact effortless | Email, phone, LinkedIn, and personal website are visible and clickable | Must |
| Demonstrate technical quality (signal-to-hire) | Lighthouse score ≥ 90 in Performance, Accessibility, Best Practices, SEO | Should |
| Look professional on every device | Passes mobile (≤ 375px) and desktop (≥ 1280px) visual checks | Must |
| Fast initial load | First Contentful Paint < 1.5s on a fast 3G connection | Should |

---

## Functional Requirements

### FR-1: Render Hero Section
- **Description**: The first visible section must display the candidate's name, current title, headline, and primary contact CTAs (email, LinkedIn, website).
- **Acceptance Criteria**:
  - Name and current title rendered prominently (h1 for name, large subtitle for title)
  - Headline displayed below the title
  - Email, LinkedIn, and website rendered as clickable icons/labels
  - "Get in touch" CTA scrolls to or highlights the contact section
- **Priority**: Must
- **Related Stories**: TBD

### FR-2: Render About / Summary Section
- **Description**: Display the candidate's professional summary as a readable paragraph.
- **Acceptance Criteria**:
  - Summary text rendered with comfortable line length (≤ 80 chars)
  - Section has a clear heading ("About")
- **Priority**: Must
- **Related Stories**: TBD

### FR-3: Render Experience Section
- **Description**: Show all work experience entries in reverse-chronological order with company, title, dates, location, and bulleted responsibilities.
- **Acceptance Criteria**:
  - Each experience entry is a card/section with: company, title, date range, location, duration
  - Responsibilities rendered as a bulleted list
  - Most recent role appears first
  - Present role marked with "Present" in end date
  - Section heading: "Experience"
- **Priority**: Must
- **Related Stories**: TBD

### FR-4: Render Skills Section
- **Description**: Display the candidate's top skills as a visual list of tags/pills.
- **Acceptance Criteria**:
  - All entries from `top_skills` rendered as styled tags
  - Section heading: "Skills"
- **Priority**: Must
- **Related Stories**: TBD

### FR-5: Render Education Section
- **Description**: Display the candidate's education history with institution, degree, and dates.
- **Acceptance Criteria**:
  - Each education entry shows institution, degree, field of study (if present), and date range
  - Section heading: "Education"
- **Priority**: Should
- **Related Stories**: TBD

### FR-6: Render Certifications Section
- **Description**: Display the candidate's professional certifications as a list.
- **Acceptance Criteria**:
  - All entries from `certifications` rendered with the certification name
  - Section heading: "Certifications"
- **Priority**: Should
- **Related Stories**: TBD

### FR-7: Render Languages Section
- **Description**: Display spoken languages with proficiency levels.
- **Acceptance Criteria**:
  - Each language rendered with proficiency level visible
  - Section heading: "Languages"
- **Priority**: Could
- **Related Stories**: TBD

### FR-8: Render Honors & Awards Section
- **Description**: Display awards and honors received.
- **Acceptance Criteria**:
  - All entries from `honors_awards` rendered as a list
  - Section heading: "Honors & Awards"
- **Priority**: Could
- **Related Stories**: TBD

### FR-9: Render Contact Section (with Privacy-Aware Defaults)
- **Description**: Provide a clear, scannable contact section at the bottom of the page with all **professional** contact channels. **The physical home address is NOT rendered** by default for privacy.
- **Acceptance Criteria**:
  - Email, phone, LinkedIn, and personal website are all visible
  - Phone is rendered as a clickable `tel:` link
  - Email is rendered as a clickable `mailto:` link
  - LinkedIn and website are rendered as external links (open in new tab with `rel="noopener noreferrer"`)
  - **Home address field is intentionally hidden** from the rendered output (data still in JSON for record)
  - Section heading: "Contact"
- **Priority**: Must
- **Related Stories**: TBD

### FR-10: Sticky Top Navigation with Scroll-Spy
- **Description**: A sticky top navigation bar shows links to every major section. As the user scrolls, the active section is highlighted. On mobile, links collapse into a hamburger menu.
- **Acceptance Criteria**:
  - Sticky nav bar visible at top of viewport on every section
  - Links: Hero (top), About, Experience, Skills, Education, Certifications, Contact
  - Active link is visually highlighted based on scroll position (scroll-spy via `IntersectionObserver`)
  - Clicking a link smooth-scrolls to the corresponding section
  - On viewports < 768px: nav links collapse into a hamburger menu; menu opens as an overlay panel
  - Theme toggle lives in the nav (per FR-11)
- **Priority**: Should
- **Related Stories**: TBD

### FR-11: Dark / Light Theme Toggle
- **Description**: Users can switch between light and dark themes; preference persists across sessions.
- **Acceptance Criteria**:
  - Toggle button visible in the nav
  - Switching theme updates all colors immediately (no FOUC)
  - Preference stored in `localStorage` and applied on next visit
  - Default theme respects `prefers-color-scheme` on first visit
- **Priority**: Should
- **Related Stories**: TBD

### FR-12: Responsive Layout
- **Description**: The site renders cleanly on mobile, tablet, and desktop.
- **Acceptance Criteria**:
  - Single column on mobile (≤ 640px)
  - Content remains readable on all breakpoints
  - Tap targets are at least 44×44 px on mobile
  - No horizontal scroll at any breakpoint
- **Priority**: Must
- **Related Stories**: TBD

### FR-13: Build-Time Data Validation
- **Description**: The CV JSON is validated at build time. If invalid, the build fails with a clear error.
- **Acceptance Criteria**:
  - All required CV fields are type-checked via a schema (Zod or similar)
  - Missing or malformed required fields fail the Next.js build
  - Optional fields (e.g., `address`) degrade gracefully
- **Priority**: Must
- **Related Stories**: TBD

### FR-14: SEO Meta Tags
- **Description**: The site exposes proper meta tags for search engines and social sharing.
- **Acceptance Criteria**:
  - `<title>` and `<meta name="description">` set from the CV
  - Open Graph tags for Facebook/LinkedIn sharing (name, title, summary)
  - `robots.txt` and `sitemap.xml` generated
  - Favicon present
- **Priority**: Should
- **Related Stories**: TBD

### FR-15: Vercel Deployment Ready
- **Description**: The site deploys to Vercel with zero configuration beyond linking the Git repository.
- **Acceptance Criteria**:
  - `bun install` and `bun run build` succeed locally
  - Pushing to `main` triggers a Vercel production deploy
  - Every PR gets a preview URL
  - `vercel.json` (if needed) is committed
- **Priority**: Must
- **Related Stories**: TBD

### FR-16: "Last Updated" Timestamp
- **Description**: The site footer shows when the CV was last updated, helping visitors gauge content freshness.
- **Acceptance Criteria**:
  - Footer displays "Last updated: {date}" in human-readable format
  - Date is auto-populated from the build timestamp (set at build time)
  - Date format: locale-aware (e.g., "October 8, 2026" or "2026-10-08")
- **Priority**: Could
- **Related Stories**: TBD

---

## Non-Functional Requirements

### Performance
| Requirement | Metric | Target |
|-------------|--------|--------|
| First Contentful Paint | Time | < 1.5s on fast 3G |
| Largest Contentful Paint | Time | < 2.5s |
| Total Blocking Time | Time | < 200ms |
| Cumulative Layout Shift | Score | < 0.1 |
| Bundle size (JS) | KB | < 200KB gzipped |

### Accessibility
| Requirement | Standard | Notes |
|-------------|----------|-------|
| Color contrast | WCAG 2.1 AA | Body text ≥ 4.5:1, large text ≥ 3:1 |
| Keyboard navigation | WCAG 2.1 AA | All interactive elements reachable and operable via keyboard |
| Screen reader support | WCAG 2.1 AA | Semantic HTML, ARIA only when necessary |
| Reduced motion | WCAG 2.1 AA | Respect `prefers-reduced-motion` |
| Focus indicators | WCAG 2.1 AA | Visible focus rings on all interactive elements |

### Browser Support
| Browser | Version | Priority |
|---------|---------|----------|
| Chrome | Latest 2 | Must |
| Firefox | Latest 2 | Must |
| Safari | Latest 2 | Must |
| Edge | Latest 2 | Must |
| Mobile Safari | iOS 16+ | Should |
| Chrome Android | Latest 2 | Should |

### Maintainability
| Requirement | Metric | Target |
|-------------|--------|--------|
| TypeScript strict mode | Enabled | Yes |
| Lint errors | Count | 0 |
| Test coverage (lib only) | % | Critical paths only — no busywork |

### Reliability
| Requirement | Metric | Target |
|-------------|--------|--------|
| Availability | Uptime | 99.9% (Vercel SLA) |
| Build success rate | % | 100% on main |

---

## Constraints

### Technical Constraints
- **Project-wide standards**: All standards in `memory-bank/standards/` apply (tech-stack, coding-standards, ux-guide)
- **Data source**: `docs/LinkedIn_CV.json` is the single source of truth — must not be modified by the build
- **No backend, no database**: CV data is static; no API routes, no serverless functions, no persistent storage
- **Tailwind CSS only**: No other CSS framework, no CSS-in-JS
- **TypeScript strict mode**: No `any` unless narrowly justified (use `unknown` + type guards)

### Business Constraints
- **Personal project**: No business stakeholders, no compliance requirements (GDPR/PII is the candidate's own choice)
- **Time budget**: Small project — favor pragmatic over exhaustive
- **Hosting cost**: Must stay within Vercel free tier

### Scope Constraints
- **Out of scope** (won't do for this intent):
  - Backend / API / database
  - Authentication / login
  - Blog / CMS
  - Project gallery (not in CV data — would require new data source)
  - Contact form (no backend to receive submissions)
  - Analytics / tracking (can be added later)
  - Multi-language i18n (English only for v1)
  - Downloadable PDF resume (future intent)

---

## Assumptions

| Assumption | Risk if Invalid | Mitigation |
|------------|-----------------|------------|
| The LinkedIn CV JSON is accurate and up-to-date | Site shows outdated/wrong info | Owner verifies content before deploy |
| The candidate wants their full CV on the public web | Privacy concern (phone, address are visible) | Address can be hidden via field toggle; candidate can edit JSON before deploy |
| Vercel free tier is sufficient | Site goes down or hits limits if traffic spikes | Upgrade tier or migrate later |
| Static rendering (SSG) is appropriate | Some content needs to be dynamic | None — no dynamic data in scope |
| Tailwind utility classes are acceptable | Team/maintainer prefers CSS modules | Standard already documents the choice |

---

## Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|-----------|
| Should `address` (physical home address) be displayed on the public site? | Sanjit | Before deploy | **Resolved: hide by default** |
| Should phone number be a clickable `tel:` link, or just displayed? | Sanjit | Before deploy | **Resolved: clickable `tel:`** |
| Should the site have a custom domain, or use the default `vercel.app` URL? | Sanjit | Before deploy | Open — use default `vercel.app` for v1 |
| Should we add a small "Last updated" timestamp somewhere? | Sanjit | Before deploy | **Resolved: yes, auto from build** |

---

## Priority Summary

- **Must (10)**: Hero, About, Experience, Skills, Contact (privacy-aware), Responsive, Data validation, Vercel deploy, Education, Certifications
- **Should (5)**: Lighthouse 90+, FCP < 1.5s, Sticky nav with scroll-spy, Theme toggle, SEO meta tags
- **Could (3)**: Languages section, Honors & Awards section, "Last updated" footer
- **Won't (out of scope)**: Backend, auth, blog, project gallery, contact form, analytics, i18n, PDF resume download
