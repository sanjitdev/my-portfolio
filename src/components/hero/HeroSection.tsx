import { ArrowDown, Globe, Linkedin, Mail } from 'lucide-react';
import type { PublicContact } from '@/lib/cv-types';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';

interface HeroSectionProps {
  contact: PublicContact;
}

/**
 * Hero section — the first thing visitors see. Renders the candidate's name
 * (h1), current title, headline, and a row of clickable contact icons
 * (email, LinkedIn, website — no phone, no address). The "Get in touch" CTA
 * smooth-scrolls to the contact section via the existing CSS scroll-behavior.
 *
 * Privacy: receives `PublicContact` (address is unreachable at compile time).
 */
export function HeroSection({ contact }: HeroSectionProps) {
  const websiteHref = contact.website
    ? contact.website.startsWith('http')
      ? contact.website
      : `https://${contact.website}`
    : null;

  const linkedinHref = contact.linkedin
    ? contact.linkedin.startsWith('http')
      ? contact.linkedin
      : `https://${contact.linkedin}`
    : null;

  const iconLinkClass =
    'inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800';

  return (
    <Section id="top" ariaLabelledBy="hero-name" className="pt-20 sm:pt-24">
      <Container>
        <div className="max-w-3xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-accent-600 dark:text-accent-400">
            {contact.location}
          </p>
          <h1
            id="hero-name"
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-100"
          >
            {contact.name}
          </h1>
          <h2 className="mt-3 text-xl font-semibold text-slate-700 sm:text-2xl dark:text-slate-300">
            {contact.current_title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            {contact.headline}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
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
          {websiteHref && (
            <a
              href={websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${contact.name}'s website`}
              className={iconLinkClass}
            >
              <Globe aria-hidden="true" className="h-5 w-5" />
            </a>
          )}
          <a
            href="#contact"
            className="ml-2 inline-flex items-center gap-2 rounded-md bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            Get in touch
            <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </Container>
    </Section>
  );
}
