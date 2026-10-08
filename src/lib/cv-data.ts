import cvDataRaw from '../../docs/LinkedIn_CV.json';
import { CvDataSchema, PublicContactSchema, type CvData, type PublicContact } from './cv-types';

/**
 * Validate the bundled CV JSON at module load time.
 *
 * If `docs/LinkedIn_CV.json` is malformed, this throws and the Next.js build
 * fails immediately. We intentionally do NOT fall back to an empty default —
 * a portfolio that silently renders empty is worse than one that fails to
 * build.
 */
const parsed = CvDataSchema.safeParse(cvDataRaw);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('docs/LinkedIn_CV.json failed schema validation:', parsed.error.format());
  throw new Error(
    `docs/LinkedIn_CV.json failed schema validation. See console for details.\n` +
      `First error: ${JSON.stringify(parsed.error.issues[0] ?? parsed.error, null, 2)}`,
  );
}

const cvData: CvData = parsed.data;

/**
 * Returns the validated, typed CV data. Safe to call multiple times — the
 * underlying object is cached at module load.
 */
export function loadCvData(): CvData {
  return cvData;
}

/**
 * Returns the privacy-safe contact subset. Excludes the home address.
 * Components should receive `PublicContact`, never `PersonalInfo`.
 */
export function getDisplayContact(cv: CvData): PublicContact {
  return PublicContactSchema.parse(cv.personal_information);
}

/**
 * Formats a date range for display. Handles "Present" as an end date.
 *
 * Examples:
 *   formatDateRange('January 2026', 'Present') === 'January 2026 – Present'
 *   formatDateRange('January 2026', 'February 2026') === 'January 2026 – February 2026'
 */
export function formatDateRange(start: string, end: string): string {
  if (end === 'Present' || end === 'present') {
    return `${start} – Present`;
  }
  return `${start} – ${end}`;
}

/**
 * Returns the current ISO 8601 timestamp. Captured at module load (build time).
 *
 * Used by the footer to display "Last updated: {date}" — each fresh build
 * gets a new timestamp, signaling to visitors that the content is current.
 */
export function computeBuildTimestamp(): string {
  return new Date().toISOString();
}
