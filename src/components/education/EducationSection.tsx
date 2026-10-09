import type { Education } from '@/lib/cv-types';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';
import { EducationCard } from './EducationCard';

interface EducationSectionProps {
  education: Education[];
}

/**
 * Education section — hidden entirely when the education list is empty so
 * the nav scroll-spy does not target a phantom section.
 */
export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) {
    return null;
  }

  return (
    <Section id="education" ariaLabelledBy="education-heading">
      <Container>
        <SectionEyebrow>04 — Education</SectionEyebrow>
        <Heading as="h2" id="education-heading">
          Education
        </Heading>
        <div className="space-y-4">
          {education.map((entry, idx) => (
            <EducationCard
              key={`${entry.institution}-${entry.start_date ?? idx}`}
              education={entry}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
