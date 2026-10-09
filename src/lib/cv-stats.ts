import type { CvData } from './cv-types';

export interface CvStats {
  yearsExperience: number;
  certificationsCount: number;
  skillsCount: number;
  languagesCount: number;
  companiesCount: number;
}

/**
 * Compute high-level portfolio stats from CV data. Pure function — used at
 * build time by the hero stats bar.
 *
 * - yearsExperience: integer years from the earliest `start_date` across
 *   all experience entries to today. Falls back to 0 if dates are unparseable.
 * - certificationsCount: cv.certifications.length
 * - skillsCount: cv.top_skills.length
 * - languagesCount: cv.languages.length
 * - companiesCount: distinct `company` strings in cv.experience
 */
export function getCvStats(cv: CvData): CvStats {
  const certificationsCount = cv.certifications.length;
  const skillsCount = cv.top_skills.length;
  const languagesCount = cv.languages.length;
  const companiesCount = new Set(cv.experience.map(e => e.company)).size;

  const yearsExperience = computeYearsExperience(cv);

  return {
    yearsExperience,
    certificationsCount,
    skillsCount,
    languagesCount,
    companiesCount,
  };
}

function computeYearsExperience(cv: CvData): number {
  if (cv.experience.length === 0) return 0;

  // Parse each start_date; collect the earliest
  const startDates: number[] = [];
  for (const exp of cv.experience) {
    const ts = Date.parse(exp.start_date);
    if (Number.isFinite(ts)) startDates.push(ts);
  }
  if (startDates.length === 0) return 0;

  const earliestMs = Math.min(...startDates);
  const earliest = new Date(earliestMs);
  const now = new Date();

  let years = now.getFullYear() - earliest.getFullYear();
  // Subtract one year if the anniversary hasn't happened yet this calendar year
  const monthDiff = now.getMonth() - earliest.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < earliest.getDate())) {
    years -= 1;
  }
  return Math.max(0, years);
}
