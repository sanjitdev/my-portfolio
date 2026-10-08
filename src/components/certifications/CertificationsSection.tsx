import { BadgeCheck } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';

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
        <Heading as="h2" id="certifications-heading">
          Certifications
        </Heading>
        <ul className="space-y-3">
          {certifications.map(cert => (
            <li key={cert} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <BadgeCheck
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600 dark:text-accent-400"
              />
              <span className="leading-relaxed">{cert}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
