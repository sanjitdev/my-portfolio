/**
 * Curated hero stats — the four numbers shown in the hero stat strip.
 *
 * Why a manifest in code and not raw `cv` counts?
 * - The CV's `top_skills` (3 weak LinkedIn labels) and `certifications`
 *   (5 plain strings) don't represent what the portfolio actually shows.
 *   The Skills section renders a curated manifest (~40+ skills); the
 *   Certifications section renders a curated profile of stack-relevant
 *   items. The hero numbers should reflect that — so the strip tells the
 *   same story as the sections below it.
 * - Some numbers are intentionally rounded / editorial (e.g. "5+ tech" not
 *   "40+ tech") because the strip is a 30-second scan, not a count.
 * - Years of experience is still derived from the CV (it's a date-derived
 *   fact, not a curatable opinion), via `getCvStats`.
 *
 * To update: change a value below. No schema migration, no CV edit.
 */

import { getCvStats } from './cv-stats';
import type { CvData } from './cv-types';

export interface HeroStatValues {
  yearsExperience: number;
  companies: number;
  technologies: number;
  certifications: number;
}

/**
 * Curated stat values. Numbers are display-only — they may not match
 * the CV byte-for-byte (e.g. the Skills section shows ~40 skills; the
 * hero says "5+ tech" because the strip is a headline, not a count).
 *
 * `yearsExperience` is computed from the CV because it's a fact, not an
 * opinion — the rest are editorial choices.
 */
export function getHeroStatValues(cv: CvData): HeroStatValues {
  const cvStats = getCvStats(cv);
  return {
    yearsExperience: cvStats.yearsExperience,
    companies: 4,
    technologies: 5,
    certifications: 6,
  };
}
