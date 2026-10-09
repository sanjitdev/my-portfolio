/**
 * Curated certification profile for the portfolio's Certifications section.
 *
 * Why a manifest in code and not just a flat string list?
 * - The CV JSON (`docs/LinkedIn_CV.json`) holds certifications as plain
 *   strings. That's fine for the user's record of truth, but it loses
 *   recruiter signal: which certs are stack-relevant, which have a score,
 *   what category each belongs to.
 * - The manifest enriches the strings with category, icon, and a small
 *   tag (e.g. "Stack-relevant", "C2 Proficient", "78/100") so the
 *   rendered section can be grouped and ranked.
 * - Editing the manifest is one place to update when the user picks up a
 *   new cert; no schema migration in the CV JSON.
 *
 * To add a new certification: append a `CertificationEntry` with the
 * exact string from the CV JSON, plus a category and any signals.
 */

import { Award, Code2, Languages, Users, GraduationCap, type LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CertificationCategory = 'Technical' | 'Language' | 'Leadership' | 'Training';

export interface CertificationEntry {
  /** The exact string from `cv.certifications[]`. Used as the join key. */
  name: string;
  category: CertificationCategory;
  icon: LucideIcon;
  /** Short signal phrase shown under the cert name (e.g. "Stack-relevant", "78/100 · C2"). */
  signal?: string;
  /** When true, the cert gets a small "Stack-relevant" pill in the card. */
  stackRelevant?: boolean;
}

export interface CertificationGroup {
  category: CertificationCategory;
  icon: LucideIcon;
  entries: CertificationEntry[];
}

// ---------------------------------------------------------------------------
// Curated manifest
// ---------------------------------------------------------------------------

/**
 * Each entry MUST match a string in `cv.certifications[]` (case-sensitive).
 * Order within a category = order in the rendered grid.
 */
export const CERTIFICATION_PROFILE: CertificationEntry[] = [
  {
    name: 'NopCommerce Certified Developer',
    category: 'Technical',
    icon: Code2,
    signal: 'Brain Station 23',
    stackRelevant: true,
  },
  {
    name: 'EF SET English Certificate 78/100 (C2 Proficient)',
    category: 'Language',
    icon: Languages,
    signal: '78/100 · C2 Proficient',
  },
  {
    name: 'Leadership Excellence',
    category: 'Leadership',
    icon: Users,
  },
  {
    name: 'Advance Certificate For Management Professionals (ACMP 4.0)',
    category: 'Leadership',
    icon: Award,
  },
  {
    name: 'LICT_Top-Up_JAVA Training Certificate of Achievement',
    category: 'Training',
    icon: GraduationCap,
  },
];

/** Display order for the category groups. */
const CATEGORY_ORDER: CertificationCategory[] = ['Technical', 'Language', 'Leadership', 'Training'];

/** Icon used for the category group eyebrow. */
const CATEGORY_ICONS: Record<CertificationCategory, LucideIcon> = {
  Technical: Code2,
  Language: Languages,
  Leadership: Users,
  Training: GraduationCap,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Group the curated profile by category, in display order. Entries whose
 * string doesn't appear in the CV JSON are dropped — we only render what
 * the user actually has. The result is what `CertificationsSection` maps
 * over to produce the section.
 */
export function groupCertifications(cvCertifications: ReadonlyArray<string>): CertificationGroup[] {
  const grouped = new Map<CertificationCategory, CertificationEntry[]>();

  for (const entry of CERTIFICATION_PROFILE) {
    if (cvCertifications.includes(entry.name)) {
      if (!grouped.has(entry.category)) grouped.set(entry.category, []);
      grouped.get(entry.category)!.push(entry);
    }
  }

  return CATEGORY_ORDER.filter(cat => grouped.has(cat)).map(cat => ({
    category: cat,
    icon: CATEGORY_ICONS[cat],
    entries: grouped.get(cat)!,
  }));
}
