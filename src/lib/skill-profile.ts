/**
 * Curated skill profile for the portfolio's Skills section.
 *
 * Why a manifest in code and not a JSON field?
 * - The CV JSON (`docs/LinkedIn_CV.json`) is the user's source of truth for
 *   the canonical narrative (name, summary, experience, education). Skills
 *   are how a recruiter *scans* a portfolio, not a list of facts.
 * - Recruiters respond to depth (years used, proficiency) and breadth
 *   (categories), not raw LinkedIn auto-suggested labels like
 *   "Team Collaboration" or "Subject Indexing".
 * - Putting the manifest in code means we can give each skill an icon, a
 *   proficiency level, and a category-level "anchor" used to compute years
 *   of use. The CV JSON stays clean and portable.
 *
 * To add a new skill: append a TechnicalSkill or ProfessionalSkill below
 * with name + proficiency (and icon, where useful). No schema migration
 * needed. The skills section reads this manifest directly.
 */

import type { LucideIcon } from 'lucide-react';
import {
  Cpu,
  Server,
  MonitorSmartphone,
  Database,
  Smartphone,
  Cloud,
  GitBranch,
  Users,
  Globe2,
  MessagesSquare,
  Boxes,
  ListChecks,
  Wifi,
} from 'lucide-react';
import type { CvData } from './cv-types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Proficiency = 'expert' | 'proficient' | 'working';

export const PROFICIENCY_LABELS: Record<Proficiency, string> = {
  expert: 'Expert — production-grade primary skill',
  proficient: 'Proficient — used in production',
  working: 'Working knowledge — applied in projects',
};

export type TechnicalCategory =
  | 'Languages & Runtimes'
  | 'Backend & APIs'
  | 'Frontend'
  | 'Databases & Data'
  | 'Mobile'
  | 'Cloud & DevOps'
  | 'Architecture & Practices';

export interface TechnicalSkill {
  name: string;
  proficiency: Proficiency;
}

export interface TechnicalCategoryDef {
  label: TechnicalCategory;
  icon: LucideIcon;
  /** Used by computeYearsOfUse to find the earliest start_date for this group. */
  yearsAnchor: YearsAnchor;
}

export interface ProfessionalSkill {
  name: string;
  icon: LucideIcon;
  context: string;
}

export interface SkillProfile {
  technical: TechnicalCategoryDef[];
  professional: ProfessionalSkill[];
}

// ---------------------------------------------------------------------------
// Date parser (Month YYYY format from LinkedIn CV)
// ---------------------------------------------------------------------------

const MONTHS: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

/**
 * Parse a LinkedIn-style "Month YYYY" date (e.g. "November 2018"). Returns
 * a Date for the 1st of that month, or `null` if the string isn't a valid
 * month + year pair.
 *
 * This is needed because `Date.parse("November 2018")` returns NaN in
 * V8/Node — the spec requires "Month Day, Year" format.
 */
export function parseMonthYear(s: string): Date | null {
  if (typeof s !== 'string') return null;
  const m = /^([A-Za-z]+)\s+(\d{4})$/.exec(s.trim());
  if (!m) return null;
  const monthName = m[1];
  const yearStr = m[2];
  if (!monthName || !yearStr) return null;
  const month = MONTHS[monthName.toLowerCase()];
  if (month === undefined) return null;
  const year = Number(yearStr);
  if (!Number.isFinite(year) || year < 1900 || year > 2999) return null;
  return new Date(year, month, 1);
}

// ---------------------------------------------------------------------------
// Years-of-use computation
// ---------------------------------------------------------------------------

export type YearsAnchor =
  | { kind: 'literal'; start: string }
  | {
      kind: 'keyword';
      keywords: string[];
      /** If true, scan responsibilities as well as title. Default true. */ includeResponsibilities?: boolean;
    }
  | { kind: 'all' };

/**
 * Compute integer years of use for a skill group, using the CV's experience
 * start/end dates. Returns `null` if no anchor can be resolved.
 *
 * - `{ kind: 'literal', start }`: use this fixed start date (e.g. career-start).
 * - `{ kind: 'keyword', keywords }`: pick the earliest start_date across all
 *   experiences whose title or responsibilities contain any of the keywords
 *   (case-insensitive substring).
 * - `{ kind: 'all' }`: pick the earliest start_date across all experiences.
 */
export function computeYearsOfUse(
  cv: CvData,
  anchor: YearsAnchor,
  now: Date = new Date(),
): number | null {
  if (anchor.kind === 'literal') {
    const d = parseMonthYear(anchor.start);
    if (!d) return null;
    return yearsBetween(d, now);
  }

  if (anchor.kind === 'all') {
    if (cv.experience.length === 0) return null;
    let earliest: Date | null = null;
    for (const exp of cv.experience) {
      const d = parseMonthYear(exp.start_date);
      if (d && (!earliest || d < earliest)) earliest = d;
    }
    return earliest ? yearsBetween(earliest, now) : null;
  }

  // keyword
  const includeResp = anchor.includeResponsibilities !== false;
  const kws = anchor.keywords.map(k => k.toLowerCase());
  let earliest: Date | null = null;
  for (const exp of cv.experience) {
    const haystack = (
      exp.title +
      ' ' +
      (includeResp ? exp.responsibilities.join(' ') : '')
    ).toLowerCase();
    const matches = kws.some(k => haystack.includes(k));
    if (!matches) continue;
    const d = parseMonthYear(exp.start_date);
    if (d && (!earliest || d < earliest)) earliest = d;
  }
  return earliest ? yearsBetween(earliest, now) : null;
}

function yearsBetween(start: Date, end: Date): number {
  let years = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < start.getDate())) {
    years -= 1;
  }
  return Math.max(0, years);
}

// ---------------------------------------------------------------------------
// Curated manifest
// ---------------------------------------------------------------------------

/**
 * Technical categories, each with their category-level icon and the anchor
 * used to compute years of experience for the whole group.
 *
 * Order matters — this is the order they render in the section.
 */
export const TECHNICAL_CATEGORIES: TechnicalCategoryDef[] = [
  {
    label: 'Languages & Runtimes',
    icon: Cpu,
    yearsAnchor: { kind: 'keyword', keywords: ['C#', 'TypeScript', 'JavaScript', 'Java', 'SQL'] },
  },
  {
    label: 'Backend & APIs',
    icon: Server,
    yearsAnchor: {
      kind: 'keyword',
      keywords: ['.NET Core', '.NET', 'REST API', 'REST APIs', 'Entity Framework', 'nopCommerce'],
    },
  },
  {
    label: 'Frontend',
    icon: MonitorSmartphone,
    yearsAnchor: { kind: 'keyword', keywords: ['Angular', 'TypeScript', 'JavaScript'] },
  },
  {
    label: 'Databases & Data',
    icon: Database,
    yearsAnchor: { kind: 'keyword', keywords: ['SQL Server', 'SQL'] },
  },
  {
    label: 'Mobile',
    icon: Smartphone,
    yearsAnchor: { kind: 'keyword', keywords: ['Android'] },
  },
  {
    label: 'Cloud & DevOps',
    icon: Cloud,
    yearsAnchor: { kind: 'keyword', keywords: ['Docker', 'CI/CD', 'Git', 'Azure', 'AWS', 'cloud'] },
  },
  {
    label: 'Architecture & Practices',
    icon: GitBranch,
    yearsAnchor: { kind: 'all' },
  },
];

/** Skills in each technical category, ordered by recruiter importance. */
export const TECHNICAL_SKILLS: Record<TechnicalCategory, TechnicalSkill[]> = {
  'Languages & Runtimes': [
    { name: 'C#', proficiency: 'expert' },
    { name: 'TypeScript', proficiency: 'expert' },
    { name: 'JavaScript', proficiency: 'expert' },
    { name: 'SQL', proficiency: 'expert' },
    { name: 'HTML / CSS', proficiency: 'proficient' },
    { name: 'Java', proficiency: 'proficient' },
  ],
  'Backend & APIs': [
    { name: '.NET Core', proficiency: 'expert' },
    { name: 'ASP.NET', proficiency: 'expert' },
    { name: 'REST API design', proficiency: 'expert' },
    { name: 'Entity Framework', proficiency: 'proficient' },
    { name: 'nopCommerce', proficiency: 'proficient' },
    { name: 'Microservices', proficiency: 'working' },
  ],
  Frontend: [
    { name: 'Angular', proficiency: 'expert' },
    { name: 'RxJS', proficiency: 'proficient' },
    { name: 'Component architecture', proficiency: 'proficient' },
    { name: 'Responsive UI', proficiency: 'expert' },
  ],
  'Databases & Data': [
    { name: 'SQL Server', proficiency: 'expert' },
    { name: 'Query optimization', proficiency: 'proficient' },
    { name: 'Schema design', proficiency: 'proficient' },
    { name: 'Indexing', proficiency: 'proficient' },
  ],
  Mobile: [
    { name: 'Android', proficiency: 'proficient' },
    { name: 'Cross-platform mobile', proficiency: 'working' },
  ],
  'Cloud & DevOps': [
    { name: 'Git', proficiency: 'expert' },
    { name: 'CI/CD', proficiency: 'proficient' },
    { name: 'Docker', proficiency: 'proficient' },
    { name: 'GitHub Actions', proficiency: 'proficient' },
    { name: 'Azure', proficiency: 'working' },
    { name: 'Linux', proficiency: 'working' },
  ],
  'Architecture & Practices': [
    { name: 'Clean architecture', proficiency: 'proficient' },
    { name: 'SOLID principles', proficiency: 'proficient' },
    { name: 'Design patterns', proficiency: 'proficient' },
    { name: 'Performance optimization', proficiency: 'expert' },
    { name: 'Code maintainability', proficiency: 'expert' },
    { name: 'OWASP basics', proficiency: 'working' },
  ],
};

/**
 * "How I Work" — professional / soft skills with iconography and a
 * 1-line context. These are the human signals recruiters screen for.
 * Anchored to overall career length (kind: 'all').
 */
export const PROFESSIONAL_SKILLS: ProfessionalSkill[] = [
  {
    name: 'Mentoring & code review',
    icon: Users,
    context: 'Guiding junior engineers through reviews, pairing, and shared standards.',
  },
  {
    name: 'Async collaboration',
    icon: MessagesSquare,
    context: 'Comfortable across time zones with distributed, remote-first teams.',
  },
  {
    name: 'Stakeholder communication',
    icon: Globe2,
    context: 'Translating business needs into clear, workable technical tasks.',
  },
  {
    name: 'System design',
    icon: Boxes,
    context: 'Designing clean, scalable systems that hold up under real load.',
  },
  {
    name: 'Project leadership',
    icon: ListChecks,
    context: 'Driving projects from concept to production — scope, delivery, support.',
  },
  {
    name: 'Remote-first work',
    icon: Wifi,
    context: '7+ years operating in async, distributed environments.',
  },
];

// ---------------------------------------------------------------------------
// Headline / "Top skills" — the curated 8 always visible above the toggle
// ---------------------------------------------------------------------------

/**
 * The 8 chips shown in the top headline row of the Skills section, before
 * the user clicks "Show full breakdown". Ordered by recruiter impact.
 *
 * Names must match entries in `TECHNICAL_SKILLS` (we look them up there to
 * get their proficiency). This list is the recruiter's "30-second scan"
 * version of the full manifest.
 */
export const TOP_SKILLS: ReadonlyArray<string> = [
  'C#',
  '.NET Core',
  'Angular',
  'TypeScript',
  'SQL Server',
  'REST API design',
  'nopCommerce',
  'Android',
];

// ---------------------------------------------------------------------------
// Public accessor
// ---------------------------------------------------------------------------

/**
 * Return the full skill profile. Pure / deterministic — the manifest is
 * static. Years-of-use is computed per-category inside SkillsSection so
 * this function stays side-effect free.
 */
export function getSkillProfile(): SkillProfile {
  return {
    technical: TECHNICAL_CATEGORIES,
    professional: PROFESSIONAL_SKILLS,
  };
}
