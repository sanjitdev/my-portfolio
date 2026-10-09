import { Globe, Linkedin, Mail, Phone, Download } from 'lucide-react';
import type { PublicContact } from '@/lib/cv-types';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';
import { ContactRow } from './ContactRow';
import { ResumeButton } from './ResumeButton';

interface ContactSectionProps {
  contact: PublicContact;
}

/**
 * Contact section — shows Email, Phone, LinkedIn, and Website as clickable
 * rows. Crucially, the prop type is `PublicContact` which excludes `address`
 * — TypeScript will refuse to compile any code that tries to access it.
 *
 * The address is also absent from rendered output by construction: even if
 * it leaked into `PublicContact`, no row renders it.
 */
export function ContactSection({ contact }: ContactSectionProps) {
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

  return (
    <Section id="contact" ariaLabelledBy="contact-heading" divided>
      <Container>
        <SectionEyebrow>08 — Get in touch</SectionEyebrow>
        <Heading as="h2" id="contact-heading">
          Contact
        </Heading>
        <p className="mb-8 max-w-2xl text-slate-600 dark:text-slate-400">
          Open to new opportunities, contract work, and interesting conversations. Reach out via any
          channel below — I usually respond within a day.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div
            data-print="contact-row"
            className="rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900"
          >
            <ContactRow
              icon={Mail}
              label="Email"
              value={contact.email}
              href={`mailto:${contact.email}`}
            />
          </div>
          <div
            data-print="contact-row"
            className="rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900"
          >
            <ContactRow
              icon={Phone}
              label="Phone"
              value={contact.phone}
              href={`tel:${contact.phone.replace(/\s+/g, '')}`}
            />
          </div>
          <div
            data-print="contact-row"
            className="rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900"
          >
            <ContactRow
              icon={Linkedin}
              label="LinkedIn"
              value={contact.linkedin}
              href={linkedinHref}
            />
          </div>
          <div
            data-print="contact-row"
            className="rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900"
          >
            <ContactRow icon={Globe} label="Website" value={contact.website} href={websiteHref} />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 rounded-xl border border-accent-200 bg-accent-50 p-6 dark:border-accent-800 dark:bg-accent-900/20">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent-600 text-white">
            <Download aria-hidden="true" className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Take my resume with you
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Print or save the page as PDF — formatted for a clean A4 resume.
            </p>
          </div>
          <ResumeButton />
        </div>
      </Container>
    </Section>
  );
}
