import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';
import type { Experience } from '@/lib/cv-types';
import { ExperienceCard } from './ExperienceCard';

interface ExperienceSectionProps {
  experiences: Experience[];
}

/**
 * Experience section — rendered as an editorial vertical timeline. A thin
 * gradient rail runs down the left of each entry, with a node at every
 * role. The most recent role opens by default; the rest are collapsed so
 * the page scans cleanly.
 *
 * Layout (one shared rhythm across breakpoints):
 *   - Mobile: rail at 20px from the left, content offset 48px.
 *   - Desktop: same rail at 60px from the left, content offset 88px,
 *     with a 7.5rem date column on the left of the content.
 */
export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <Section id="experience" ariaLabelledBy="experience-heading" divided>
      <Container>
        <SectionEyebrow>Experience</SectionEyebrow>
        <Heading as="h2" id="experience-heading">
          Experience
        </Heading>

        {experiences.length > 0 ? (
          <ol className="relative mt-10 space-y-12 print:space-y-6">
            {/* Vertical timeline rail — drawn behind the dots */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-2 bottom-2 left-5 w-px bg-gradient-to-b from-accent-400 via-slate-200 to-slate-100 md:left-[3.75rem] dark:from-accent-700/60 dark:via-slate-800 dark:to-slate-900 print:hidden"
            />

            {experiences.map((exp, idx) => (
              <li key={`${exp.company}-${exp.start_date}-${idx}`} className="relative">
                <ExperienceCard experience={exp} defaultExpanded={idx === 0} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-8 text-slate-500 italic dark:text-slate-400">No experience listed.</p>
        )}
      </Container>
    </Section>
  );
}
