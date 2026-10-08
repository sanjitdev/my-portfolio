---
id: 002-portfolio-ui-sections
unit: 001-portfolio-ui
intent: 001-portfolio-site
type: simple-construction-bolt
status: complete
stories:
  - 004-hero
  - 005-about
  - 006-experience
  - 007-skills
  - 008-education
  - 009-certifications
  - 010-languages
  - 011-honors
  - 012-contact
created: '2026-10-08T20:55:00Z'
started: '2026-10-08T21:15:00Z'
completed: '2026-10-08T15:28:00Z'
current_stage: null
stages_completed:
  - name: plan
    completed: '2026-10-08T21:15:00Z'
    artifact: implementation-plan.md
  - name: implement
    completed: '2026-10-08T21:20:00Z'
    artifact: implementation-walkthrough.md
  - name: test
    completed: '2026-10-08T21:25:00Z'
    artifact: test-walkthrough.md
requires_bolts:
  - 001-portfolio-ui-foundation
enables_bolts:
  - 003-portfolio-ui-polish
requires_units: []
blocks: false
complexity:
  avg_complexity: 1
  avg_uncertainty: 1
  max_dependencies: 1
  testing_scope: 2
---

# Bolt: 002-portfolio-ui-sections

## Overview

Render every content section of the portfolio — Hero, About, Experience, Skills, Education, Certifications, Languages, Honors, Contact — using the shared primitives from Bolt 001 and the typed CV data.

This bolt is the "make it look like a portfolio" bolt. By the end, the entire single-page layout must render correctly with the candidate's actual CV data, accessible, responsive, and with the address filtered out.

## Objective

Build the complete content surface area:

1. All 9 content sections render with real CV data
2. Each section uses the shared primitives (Section, Container, Heading, Tag, Card)
3. Empty sections (Education, Honors, etc.) hide themselves gracefully
4. The page is a complete, scrollable single-page portfolio
5. Address is provably absent from rendered output (test asserts this)

## Stories Included

- **004-hero** (Must): Hero section — name, title, headline, CTAs
- **005-about** (Must): About / Summary section
- **006-experience** (Must): Experience list (most recent first, dates, responsibilities)
- **007-skills** (Must): Skills as styled tags
- **008-education** (Should): Education list (hidden if empty)
- **009-certifications** (Should): Certifications list (hidden if empty)
- **010-languages** (Could): Languages with proficiency (hidden if empty)
- **011-honors** (Could): Honors & Awards (hidden if empty)
- **012-contact** (Must): Contact section with clickable email/phone/LinkedIn/website, **address omitted**

## Bolt Type

**Type**: Simple Construction Bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. plan**: Pending → `implementation-plan.md` (define Section component contracts, prop types from CV data, empty-state handling, responsive layout decisions)
- [ ] **2. implement**: Pending → create `components/{hero,about,experience,skills,education,certifications,languages,honors,contact}/*Section.tsx`, wire into `app/page.tsx`
- [ ] **3. test**: Pending → `test-report.md` (smoke render tests for each section, privacy test: address string NOT in built HTML)

## Dependencies

### Requires
- 001-portfolio-ui-foundation (provides typed `CvData`, `PublicContact`, shared primitives)

### Enables
- 003-portfolio-ui-polish (needs every section to exist before nav scroll-spy can target them)

## Success Criteria

- [ ] All 9 sections render in `app/page.tsx` in the correct order
- [ ] Hero shows: name (h1), title, headline, contact CTAs (email, LinkedIn, website icons)
- [ ] About shows the summary text
- [ ] Experience shows all entries in reverse-chronological order with company, title, dates, location, duration, responsibilities
- [ ] "Present" appears as the end date for ongoing roles
- [ ] Skills shows each skill as a Tag
- [ ] Education section hides itself if `education.length === 0`
- [ ] Certifications section hides itself if `certifications.length === 0`
- [ ] Languages section hides itself if `languages.length === 0`
- [ ] Honors section hides itself if `honors_awards.length === 0`
- [ ] Contact section shows email (mailto:), phone (tel:), LinkedIn and website (external links with `rel="noopener noreferrer"`)
- [ ] **Privacy test**: built HTML contains zero occurrences of the home address string
- [ ] All sections have proper `<section id="...">` for nav anchor targeting
- [ ] All sections use the shared `Section`, `Container`, `Heading`, `Card`, `Tag` primitives
- [ ] All sections work in both light and dark mode (uses `dark:` Tailwind variants)
- [ ] All sections respect `prefers-reduced-motion`
- [ ] Responsive layout works at 375px, 768px, and 1280px viewports
- [ ] Semantic HTML: each section uses appropriate `<section>`, `<h1>` (hero only), `<h2>` (other sections)
- [ ] Lighthouse Accessibility ≥ 95 on the full page

## Notes

### Section IDs (Must Match Nav)
Each section must have a stable `id` attribute:
- Hero: `id="top"` (or no id, treated as top of page)
- About: `id="about"`
- Experience: `id="experience"`
- Skills: `id="skills"`
- Education: `id="education"` (only if rendered)
- Certifications: `id="certifications"` (only if rendered)
- Languages: `id="languages"` (only if rendered)
- Honors: `id="honors"` (only if rendered)
- Contact: `id="contact"`

The 003 bolt's `TopNav` will reference these IDs. **Match them exactly**.

### Address Privacy Test (Critical)
A simple test:
```ts
// In a test file (could be in 002-portfolio-ui-sections bolt scope)
import { readFileSync } from 'fs'
import cvData from '@/../docs/LinkedIn_CV.json'

const address = cvData.personal_information.address
test('home address is never rendered', () => {
  // Strategy: build the page, search rendered HTML for the address
  const builtHtml = readFileSync('.next/server/app/page.html', 'utf-8')
  expect(builtHtml).not.toContain(address)
})
```
Or, more practically, a unit test on `getDisplayContact()` ensures the function never returns the address. This test already exists from Bolt 001, but the rendered-page test should be added in this bolt.

### Empty Sections Logic
Use a simple check at the section level:
```tsx
export function EducationSection({ education }: { education: Education[] }) {
  if (education.length === 0) return null
  return (
    <Section id="education">
      <Container>
        <Heading as="h2">Education</Heading>
        {education.map(...)}
      </Container>
    </Section>
  )
}
```
Returning `null` cleanly removes the section from the DOM (and from the nav's scroll-spy targets in Bolt 003).

### Component File Organization
```
components/
├── hero/HeroSection.tsx
├── about/AboutSection.tsx
├── experience/ExperienceSection.tsx
├── skills/SkillsSection.tsx
├── education/EducationSection.tsx
├── certifications/CertificationsSection.tsx
├── languages/LanguagesSection.tsx
├── honors/HonorsSection.tsx
├── contact/ContactSection.tsx
└── shared/   (already exists from Bolt 001)
    ├── Container.tsx
    ├── Section.tsx
    ├── Heading.tsx
    ├── Tag.tsx
    └── Card.tsx
```

### Icons via lucide-react
Each section uses a small set of icons. Suggested mapping:
- Hero: `Mail`, `Linkedin`, `Globe`, `ArrowDown`
- Experience: `Briefcase` (or none — the dates are visual enough)
- Skills: no icons (tags suffice)
- Education: `GraduationCap`
- Certifications: `BadgeCheck`
- Languages: `Languages`
- Honors: `Trophy`
- Contact: `Mail`, `Phone`, `Linkedin`, `Globe`

### Date Formatting
The CV uses "January 2026" format for dates, not ISO. The `formatDateRange()` helper in `lib/cv-data.ts` handles:
- "January 2026 – Present"
- "January 2026 – February 2026"

Verify the test from Bolt 001 covers both cases.