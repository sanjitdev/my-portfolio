import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';
import type { Education } from '@/lib/cv-types';
import { EducationCard } from './EducationCard';

interface EducationSectionProps {
  education: Education[];
}

/**
 * Education section — rendered as an editorial vertical timeline, matching
 * the rhythm of the Experience section so the two timeline-based sections
 * read as a single visual story.
 *
 * Hidden entirely when the education list is empty so the nav scroll-spy
 * does not target a phantom section.
 */
export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) {
    return null;
  }

  return (
    <Section id="education" ariaLabelledBy="education-heading">
      <Container>
        <SectionEyebrow>Where I studied</SectionEyebrow>
        <Heading as="h2" id="education-heading">
          Education
        </Heading>

        <ol className="relative mt-10 space-y-12 print:space-y-6">
          {/* Vertical timeline rail — same gradient treatment as ExperienceSection */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2 bottom-2 left-5 w-px bg-gradient-to-b from-accent-400 via-slate-200 to-slate-100 md:left-[3.75rem] dark:from-accent-700/60 dark:via-slate-800 dark:to-slate-900 print:hidden"
          />

          {education.map((entry, idx) => (
            <li key={`${entry.institution}-${entry.start_date ?? idx}`} className="relative">
              <EducationCard education={entry} />
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
