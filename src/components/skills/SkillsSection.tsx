import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Tag } from '@/components/shared/Tag';

interface SkillsSectionProps {
  skills: string[];
}

/**
 * Skills section — renders each top skill as a Tag pill. The section always
 * renders (even with zero skills) so visitors see the heading; an empty state
 * is shown as muted text instead of empty space.
 */
export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <Section id="skills" ariaLabelledBy="skills-heading">
      <Container>
        <Heading as="h2" id="skills-heading">
          Skills
        </Heading>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 italic">No skills listed.</p>
        )}
      </Container>
    </Section>
  );
}
