import { ArrowRight, Globe, Linkedin, Mail, Phone } from 'lucide-react';
import type { PublicContact } from '@/lib/cv-types';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';
import { ResumeButton } from './ResumeButton';

interface ContactSectionProps {
  contact: PublicContact;
}

interface SecondaryChannelSpec {
  /** Channel name shown in the mono-caps label (e.g. "Phone"). */
  label: string;
  /** The destination the link goes to. */
  href: string;
  /** The user-facing value (phone number, URL, etc.). */
  value: string;
  /** Whether the link opens in a new tab. */
  external: boolean;
}

/**
 * Build a normalised href for a URL-style field, prepending `https://` when
 * the value is missing a scheme.
 */
function withHttps(value: string): string {
  return value.startsWith('http') ? value : `https://${value}`;
}

/**
 * Contact section — big primary email CTA on the left, a 3-up grid of
 * secondary channels (phone, LinkedIn, website) on the right, and a
 * full-width resume row below. Email is the highest-leverage channel so
 * it gets the most visual weight.
 *
 * Privacy: the prop type is `PublicContact`, which omits `address` at the
 * type level. No rendering path ever touches a home address.
 */
export function ContactSection({ contact }: ContactSectionProps) {
  const secondary: SecondaryChannelSpec[] = [
    {
      label: 'Phone',
      href: `tel:${contact.phone.replace(/\s+/g, '')}`,
      value: contact.phone,
      external: false,
    },
    {
      label: 'LinkedIn',
      href: withHttps(contact.linkedin),
      value: `/in/${contact.linkedin.split('/').filter(Boolean).pop() ?? contact.linkedin}`,
      external: true,
    },
    {
      label: 'Website',
      href: withHttps(contact.website),
      value: contact.website,
      external: true,
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
          Open to new opportunities, contract work, and interesting conversations. Email is best — I
          usually respond within a day.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* Primary CTA: email */}
          <a
            href={`mailto:${contact.email}`}
            data-print="card"
            data-contact-channel="email"
            className="group flex flex-col gap-5 rounded-2xl border border-accent-200 bg-accent-50 p-6 transition-all hover:border-accent-300 hover:bg-accent-100/70 dark:border-accent-800/60 dark:bg-accent-900/20 dark:hover:border-accent-700 dark:hover:bg-accent-900/30"
          >
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent-700 dark:text-accent-300">
              Primary — Email
            </p>
            <p className="break-all font-heading text-xl font-semibold text-slate-900 sm:text-2xl dark:text-slate-100">
              {contact.email}
            </p>
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Best for new opportunities, contract work, and detailed questions.
              </p>
              <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-accent-700">
                Send email
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </div>
          </a>

          {/* Secondary 3-up grid: phone, LinkedIn, website */}
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {secondary.map(spec => {
              const Icon =
                spec.label === 'Phone' ? Phone : spec.label === 'LinkedIn' ? Linkedin : Globe;
              return (
                <a
                  key={spec.label}
                  href={spec.href}
                  target={spec.external ? '_blank' : undefined}
                  rel={spec.external ? 'noopener noreferrer' : undefined}
                  aria-label={`${spec.label} — ${spec.value}`}
                  data-print="card"
                  data-contact-channel={spec.label.toLowerCase()}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-accent-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:bg-slate-800/50"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {spec.label}
                    </p>
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {spec.value}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Resume row — full width, dashed border, no card chrome */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-dashed border-slate-300 bg-white/50 p-5 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-900/30">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Resume
            </p>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
              Print or save the page as PDF — formatted for a clean A4 resume.
            </p>
          </div>
          <ResumeButton variant="secondary">Download Resume</ResumeButton>
        </div>
      </Container>
    </Section>
  );
}
