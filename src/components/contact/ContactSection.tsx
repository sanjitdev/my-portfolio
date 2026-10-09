import { Download, Globe, Linkedin, Mail, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PublicContact } from '@/lib/cv-types';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';
import { ResumeButton } from './ResumeButton';

interface ContactSectionProps {
  contact: PublicContact;
}

interface ChannelSpec {
  /** Channel name shown in the accent mono-caps tag (e.g. "EMAIL"). */
  kind: string;
  /** The destination the link goes to, or `null` for non-link rows. */
  href: string | null;
  /** The user-facing value (email, phone, URL — the thing the user copies). */
  value: string;
  /** Whether the link opens in a new tab. */
  external: boolean;
  /** Lucide icon for the row (also drives the a11y label). */
  icon: LucideIcon;
}

/**
 * Build the accessible name for a channel row from its kind and value, e.g.
 * `"Email — sanjit@example.com"`.
 */
function rowAriaLabel(spec: Pick<ChannelSpec, 'kind' | 'value'>): string {
  return `${spec.kind.charAt(0)}${spec.kind.slice(1).toLowerCase()} — ${spec.value}`;
}

/**
 * Contact section — a compact single-column list of channel rows inside a
 * bordered panel. Each row is one line: an accent mono-caps kind tag on
 * the left (EMAIL / PHONE / LINKEDIN / WEBSITE) and the destination as
 * the link on the right. Below the channels sits a single resume row
 * with a print-PDF button.
 *
 * Privacy: the prop type is `PublicContact`, which omits `address` at the
 * type level. No rendering path ever touches a home address.
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

  const channels: ChannelSpec[] = [
    {
      kind: 'EMAIL',
      href: `mailto:${contact.email}`,
      value: contact.email,
      external: false,
      icon: Mail,
    },
    {
      kind: 'PHONE',
      href: `tel:${contact.phone.replace(/\s+/g, '')}`,
      value: contact.phone,
      external: false,
      icon: Phone,
    },
    {
      kind: 'LINKEDIN',
      href: linkedinHref,
      value: contact.linkedin,
      external: true,
      icon: Linkedin,
    },
    {
      kind: 'WEBSITE',
      href: websiteHref,
      value: contact.website,
      external: true,
      icon: Globe,
    },
  ];

  return (
    <Section id="contact" ariaLabelledBy="contact-heading" divided>
      <Container>
        <SectionEyebrow>08 — Get in touch</SectionEyebrow>
        <Heading as="h2" id="contact-heading">
          Contact
        </Heading>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          Open to new opportunities, contract work, and interesting conversations. Reach out via any
          channel below — I usually respond within a day.
        </p>

        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-800">
            {channels.map(spec => {
              const Icon = spec.icon;
              return (
                <li
                  key={spec.kind}
                  data-print="card"
                  data-contact-channel={spec.kind.toLowerCase()}
                  className="flex items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-5 sm:py-3"
                >
                  {/* Kind tag — names the channel, mono-caps accent chip. */}
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">
                    <Icon aria-hidden="true" className="h-3 w-3" />
                    {spec.kind}
                  </span>

                  {/* Destination — linkable when href is set. */}
                  {spec.href !== null ? (
                    <a
                      href={spec.href}
                      target={spec.external ? '_blank' : undefined}
                      rel={spec.external ? 'noopener noreferrer' : undefined}
                      aria-label={rowAriaLabel(spec)}
                      className="min-w-0 truncate text-sm text-slate-700 transition-colors hover:text-accent-700 focus-visible:text-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 dark:text-slate-300 dark:hover:text-accent-300 dark:focus-visible:text-accent-300"
                    >
                      {spec.value}
                    </a>
                  ) : (
                    <span className="min-w-0 truncate text-sm text-slate-700 dark:text-slate-300">
                      {spec.value}
                    </span>
                  )}
                </li>
              );
            })}

            {/* Resume row — same panel, last entry, with the print button. */}
            <li
              data-print="card"
              className="flex items-center gap-3 bg-slate-50 px-4 py-3 sm:gap-4 sm:px-5 sm:py-3 dark:bg-slate-800/50"
            >
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">
                <Download aria-hidden="true" className="h-3 w-3" />
                RESUME
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-slate-700 dark:text-slate-300">
                Print or save the page as PDF — formatted for a clean A4 resume.
              </span>
              <ResumeButton className="shrink-0 rounded-md bg-accent-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500" />
            </li>
          </ul>
        </div>
      </Container>
    </Section>
  );
}
