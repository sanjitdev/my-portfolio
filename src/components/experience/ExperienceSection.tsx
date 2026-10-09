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
 * Experience section — renders all entries in the order provided (assumed to
 * be most-recent-first per CV data convention). Each entry is an
 * ExperienceCard. The section always renders because the candidate always
 * has at least one experience entry; if the array is empty, a muted
 * placeholder is shown.
 */
export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <Section id="experience" ariaLabelledBy="experience-heading" divided>
      <Container>
        <SectionEyebrow>02 — Experience</SectionEyebrow>
        <Heading as="h2" id="experience-heading">
          Experience
        </Heading>
        {experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <ExperienceCard key={`${exp.company}-${exp.start_date}-${idx}`} experience={exp} />
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic dark:text-slate-400">No experience listed.</p>
        )}
      </Container>
    </Section>
  );
}
