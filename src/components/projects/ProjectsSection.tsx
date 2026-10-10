import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';
import type { ProjectMd } from '@/lib/projects-md';
import { HeroProjectCard } from './HeroProjectCard';
import { CompactProjectCard } from './CompactProjectCard';

interface ProjectsSectionProps {
  projects: ProjectMd[] | undefined;
}

/**
 * Featured Projects section — the part of the portfolio that most
 * directly answers "what have you actually built?" for recruiters.
 *
 * Layout strategy: the first project is rendered as a hero (big
 * editorial card) and the rest are rendered as a compact grid below.
 * The visual hierarchy makes the most prominent project unmissable
 * without losing the secondary ones.
 *
 * Placed right after the Hero so it is the first content section
 * visitors see. Hidden entirely when the projects array is missing
 * or empty, so scroll-spy never targets a phantom section.
 */
export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  const [hero, ...rest] = projects;

  return (
    <Section id="projects" ariaLabelledBy="projects-heading">
      <Container>
        <SectionEyebrow>What I&apos;ve built</SectionEyebrow>
        <Heading as="h2" id="projects-heading">
          Featured Projects
        </Heading>

        <p className="mb-10 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          A selection of work I&apos;m proud of — hand-picked to show how I ship,
          not just where I worked. For the day-to-day, see the{' '}
          <a
            href="#experience"
            className="text-accent-700 underline decoration-accent-300 underline-offset-2 hover:decoration-accent-500 dark:text-accent-400 dark:decoration-accent-700"
          >
            experience timeline
          </a>
          .
        </p>

        {hero && (
          <div className="mb-8">
            <HeroProjectCard project={hero} />
          </div>
        )}

        {rest.length > 0 && (
          <ul
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
            aria-label="More projects"
          >
            {rest.map(project => (
              <li key={project.name} className="flex">
                <CompactProjectCard project={project} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
