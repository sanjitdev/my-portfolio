import type { CvData } from '@/lib/cv-types';
import type { ProjectMd } from '@/lib/projects-md';

export interface NavLink {
  id: string;
  label: string;
  /**
   * If present, the link navigates to a Next.js route (rendered as a real
   * `<Link>` / `<a>`). If absent, the link is an in-page anchor used by
   * the scroll-spy on the home page.
   */
  href?: string;
  /**
   * Optional id of a section on the home page that this link should
   * anchor-scroll to when the user is on `/`. When set together with
   * `href`, the link renders as an anchor on home and a route link on
   * other pages — keeping the LeetCode nav link consistent with the rest
   * of the primary row, which all scroll to their sections on home.
   */
  scrollId?: string;
}

/**
 * Curated navigation shape.
 *
 * The portfolio has up to 10 anchors (one per section). Showing all 10 in a
 * flat horizontal nav looks cluttered, so we split into:
 *
 *   - `primary`:  always-visible top-level anchors
 *   - `secondary`: condensed into a "More" dropdown
 *
 * Both groups are derived from CV data, so sections that are empty simply
 * disappear from the nav. Ordering inside each group is deliberate.
 */
export interface NavGroups {
  primary: NavLink[];
  secondary: NavLink[];
}

const SECONDARY_ORDER: ReadonlyArray<{ id: string; label: string; key: keyof CvData }> = [
  // The summary/about section's DOM id is "about" (see AboutSection.tsx) —
  // moved to the primary row in Direction 5 (2026-10-10) so the top nav
  // mirrors the page section order (Profile is now the second anchor
  // after Home).
  { id: 'skills', label: 'Skills', key: 'top_skills' },
  { id: 'education', label: 'Education', key: 'education' },
  { id: 'certifications', label: 'Certifications', key: 'certifications' },
  { id: 'languages', label: 'Languages', key: 'languages' },
  // CvData field is "honors_awards"; the nav DOM id is "honors" (matches
  // HonorsSection.tsx).
  { id: 'honors', label: 'Honors', key: 'honors_awards' },
  { id: 'recommendations', label: 'Recommendations', key: 'recommendations' },
];

/**
 * Derives the navigation groups from CV data and the curated projects.
 *
 * The primary row always shows: Home, Profile, Experience, Projects (if
 * any), LeetCode (route link), Contact. The page renders the sections in
 * the same order: Hero → Profile → Experience → Projects → Skills → ... so
 * the primary nav mirrors the visual order.
 *
 * LeetCode was added as a route link (Bolt 004 of intent 002) — it lives
 * at `/leetcode` and is rendered as a real `<Link>` rather than an anchor.
 *
 * History:
 * - Direction 4 (2026-10-10): Profile and Experience moved ahead of
 *   Projects so recruiters see the career timeline before the project
 *   detail.
 * - Direction 5 (2026-10-10): Profile (the summary/about section)
 *   promoted from the "More" dropdown to the primary row so the top
 *   nav exposes the second section directly. The page composition
 *   became Hero → Profile → Experience → Projects → ...
 *
 * "Skills" remains in the secondary group — Skills is dense enough to
 * be a "deeper" stop after the recruiter has scanned the experience
 * and projects.
 *
 * The secondary group is only emitted when at least one of its items has
 * data, so a CV with no languages, honors, or recommendations will not
 * show a "More" dropdown at all.
 */
export function getNavLinks(projects: ProjectMd[], cv: CvData): NavGroups {
  const hasProjects = projects.length > 0;

  const primary: NavLink[] = [
    { id: 'top', label: 'Home' },
    { id: 'about', label: 'Profile' },
    { id: 'experience', label: 'Experience' },
    ...(hasProjects ? [{ id: 'projects' as const, label: 'Projects' }] : []),
    // Route link (Bolt 004 / 002-leetcode-stats): on the home page, this
    // link smooth-scrolls to the #leetcode-callout section; on any other
    // page it navigates to /leetcode. The dual behavior keeps the nav
    // consistent with the rest of the primary row.
    { id: 'leetcode', label: 'LeetCode', href: '/leetcode', scrollId: 'leetcode-callout' },
  ];

  const secondary: NavLink[] = [];
  for (const item of SECONDARY_ORDER) {
    const value = cv[item.key];
    const isPresent = Array.isArray(value) ? value.length > 0 : Boolean(value);
    if (isPresent) {
      secondary.push({ id: item.id, label: item.label });
    }
  }

  // Contact is always last and always primary.
  primary.push({ id: 'contact', label: 'Contact' });

  return { primary, secondary };
}

/**
 * Flat list of every nav target (primary + secondary), in display order.
 * Useful for the mobile menu where vertical space is plentiful.
 */
export function getFlatNavLinks(projects: ProjectMd[], cv: CvData): NavLink[] {
  const { primary, secondary } = getNavLinks(projects, cv);
  return [...primary, ...secondary];
}