'use client';

import { Linkedin, Mail } from 'lucide-react';
import type { PublicContact } from '@/lib/cv-types';

interface HeroQuickActionsProps {
  contact: PublicContact;
  /** Pre-rendered Resume button (so the click handler is co-located). */
  resumeButton: React.ReactNode;
}

/**
 * Primary CTA row shown in the hero. Renders:
 *  - Resume download button (passed as a child element so the click handler
 *    stays co-located with the layout)
 *  - LinkedIn button (external)
 *  - Email button (mailto:)
 *  - "Get in touch" → smooth-scrolls to the contact section
 *
 * Privacy: receives only `PublicContact` so address is unreachable.
 */
export function HeroQuickActions({ contact, resumeButton }: HeroQuickActionsProps) {
  const linkedinHref = contact.linkedin
    ? contact.linkedin.startsWith('http')
      ? contact.linkedin
      : `https://${contact.linkedin}`
    : null;

  const iconLinkClass =
    'inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800';

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 print-hidden">
      {resumeButton}
      <a
        href={`mailto:${contact.email}`}
        aria-label={`Email ${contact.name}`}
        className={iconLinkClass}
      >
        <Mail aria-hidden="true" className="h-5 w-5" />
      </a>
      {linkedinHref && (
        <a
          href={linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${contact.name} on LinkedIn`}
          className={iconLinkClass}
        >
          <Linkedin aria-hidden="true" className="h-5 w-5" />
        </a>
      )}
      <a
        href="#contact"
        className="ml-2 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        Get in touch
      </a>
    </div>
  );
}
