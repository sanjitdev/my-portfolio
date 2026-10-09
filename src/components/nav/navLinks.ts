import type { CvData } from '@/lib/cv-types';

export interface NavLink {
  id: string;
  label: string;
}

/**
 * Derives the navigation links from CV data. Only includes links for
 * sections that have content — so if Education is empty, it does not appear
 * in the nav (and the section itself renders nothing, by agreement in
 * EducationSection.tsx).
 *
 * "Home" is always shown and points at the hero (`#top`).
 * "Contact" is always shown last.
 */
export function getNavLinks(cv: CvData): NavLink[] {
  const links: NavLink[] = [
    { id: 'top', label: 'Home' },
    { id: 'about', label: 'Profile' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
  ];
  if (cv.education.length > 0) {
    links.push({ id: 'education', label: 'Education' });
  }
  if (cv.certifications.length > 0) {
    links.push({ id: 'certifications', label: 'Certifications' });
  }
  if (cv.languages.length > 0) {
    links.push({ id: 'languages', label: 'Languages' });
  }
  if (cv.honors_awards.length > 0) {
    links.push({ id: 'honors', label: 'Honors' });
  }
  if (cv.recommendations.length > 0) {
    links.push({ id: 'recommendations', label: 'Recommendations' });
  }
  links.push({ id: 'contact', label: 'Contact' });
  return links;
}
