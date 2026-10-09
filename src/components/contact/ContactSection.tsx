import { Download, Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
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

interface ContactRowSpec {
  /** Channel name shown in the accent mono-caps tag (e.g. "EMAIL"). */
  kind: string;
  /** Visual identifier — used for the a11y label and icon lookup. */
  channel: 'email' | 'phone' | 'linkedin' | 'website' | 'location';
  /** User-facing label, e.g. "Email" or "Location". */
  label: string;
  /** The value to display, e.g. the email address or phone number. */
  value: string;
  /** Click target. `null` renders a non-interactive row (e.g. location). */
  href: string | null;
  /** Whether the link opens in a new tab. */
  external: boolean;
  /** Lucide icon for the row. */
  icon: LucideIcon;
}

const ICON_CLASS = 'h-5 w-5';

function rowAriaLabel(spec: Pick<ContactRowSpec, 'kind' | 'label' | 'value'>): string {
  return `${spec.kind} — ${spec.label} (${spec.value})`;
}

/**
 * Contact section — single-column editorial list of full-width rows.
 * Mirrors the Honors / Languages / Certifications pattern: each row is a
 * horizontal flex with an icon, the channel value as the primary text, a
 * small accent mono-caps tag naming the kind (EMAIL / PHONE / …) on the
 * right, and a final resume callout row.
 *
 * The home address is intentionally absent — the prop type is
 * `PublicContact`, which omits the `address` field at the type level. We
 * additionally surface `location` (city / country) as a non-link row.
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

  const rows: ContactRowSpec[] = [
    {
      kind: 'EMAIL',
      channel: 'email',
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      external: false,
      icon: Mail,
    },
    {
      kind: 'PHONE',
      channel: 'phone',
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s+/g, '')}`,
      external: false,
      icon: Phone,
    },
    {
      kind: 'LINKEDIN',
      channel: 'linkedin',
      label: 'LinkedIn',
      value: contact.linkedin,
      href: linkedinHref,
      external: true,
      icon: Linkedin,
    },
    {
      kind: 'WEBSITE',
      channel: 'website',
      label: 'Website',
      value: contact.website,
      href: websiteHref,
      external: true,
      icon: Globe,
    },
    {
      kind: 'LOCATION',
      channel: 'location',
      label: 'Location',
      value: contact.location,
      href: null,
      external: false,
      icon: MapPin,
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

        <ul className="mt-10 divide-y divide-slate-200 border-t border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {rows.map(spec => {
            const Icon = spec.icon;
            // The middle column is either a focusable link (email / phone /
            // linkedin / website) or a plain block (location). The icon and
            // kind tag stay outside the anchor so they don't pull a tabular
            // layout into the link's hit area.
            const value = (
              <div className="min-w-0">
                <p className="font-heading text-lg font-semibold text-slate-900 sm:text-xl dark:text-slate-100">
                  {spec.label}
                </p>
                <p className="mt-0.5 break-all text-sm text-slate-600 dark:text-slate-400">
                  {spec.value}
                </p>
              </div>
            );
            return (
              <li
                key={spec.channel}
                data-print="card"
                data-contact-channel={spec.channel}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 sm:gap-6 sm:py-6"
              >
                {/* Icon tile — same chip treatment as the Honors trophy */}
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400"
                >
                  <Icon className={ICON_CLASS} />
                </span>

                {/* Label + value — wrapped in <a> when clickable */}
                {spec.href !== null ? (
                  <a
                    href={spec.href}
                    target={spec.external ? '_blank' : undefined}
                    rel={spec.external ? 'noopener noreferrer' : undefined}
                    aria-label={rowAriaLabel(spec)}
                    className="-m-2 block min-w-0 rounded-md p-2 transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 dark:hover:bg-slate-800 dark:focus-visible:bg-slate-800"
                  >
                    {value}
                  </a>
                ) : (
                  value
                )}

                {/* Channel kind tag (EMAIL / PHONE / …) */}
                <span
                  aria-hidden="true"
                  className="inline-flex shrink-0 items-center rounded-full bg-accent-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-700 dark:bg-accent-900/30 dark:text-accent-400"
                >
                  {spec.kind}
                </span>
              </li>
            );
          })}

          {/* Resume row — visually the same as a channel row, but the right
              column is a print-PDF button instead of a kind tag. */}
          <li
            data-print="card"
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 sm:gap-6 sm:py-6"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400"
            >
              <Download className={ICON_CLASS} />
            </span>
            <div className="min-w-0">
              <p className="font-heading text-lg font-semibold text-slate-900 sm:text-xl dark:text-slate-100">
                Take my resume with you
              </p>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                Print or save the page as PDF — formatted for a clean A4 resume.
              </p>
            </div>
            <div className="shrink-0">
              <ResumeButton />
            </div>
          </li>
        </ul>
      </Container>
    </Section>
  );
}

// Re-export the row-a11y helper so tests can assert the same accessible
// labels that the rendered anchors use.
export { rowAriaLabel };
