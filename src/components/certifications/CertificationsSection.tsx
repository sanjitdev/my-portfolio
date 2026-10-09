import { BadgeCheck } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';

interface CertificationsSectionProps {
  certifications: string[];
}

/**
 * Certifications section — vertical list of certification names with a
 * BadgeCheck icon. Hidden entirely when the list is empty.
 */
export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <Section id="certifications" ariaLabelledBy="certifications-heading">
      <Container>
        <SectionEyebrow>05 — Certifications</SectionEyebrow>
        <Heading as="h2" id="certifications-heading">
          Certifications
        </Heading>
        <ul className="grid gap-3 sm:grid-cols-2">
          {certifications.map(cert => (
            <li
              key={cert}
              data-print="card"
              className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                <BadgeCheck aria-hidden="true" className="h-5 w-5" />
              </span>
              <span>{cert}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
