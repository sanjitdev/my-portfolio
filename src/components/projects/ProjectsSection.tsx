import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import type { ProjectMd } from '@/lib/projects-md';
import { HeroProjectCard } from './HeroProjectCard';
import { ProjectsCarouselClient } from './ProjectsCarouselClient';

interface ProjectsSectionProps {
  projects: ProjectMd[] | undefined;
}

/**
 * Featured Projects section — the part of the portfolio that most
 * directly answers "what have you actually built?" for recruiters.
 *
 * Layout (ADR-006, Direction 2 — Carousel magazine spread):
 *   - First project is the hero editorial card (full details).
 *   - The remaining 2+ projects render as a horizontal CSS
 *     scroll-snap carousel showing only name + stack — a teaser
 *     surface. Clicking a card opens a `<dialog>` with the full
 *     project details.
 *
 * Section treatment (ADR-006):
 *   - A subtle radial accent gradient at the top of the section + a
 *     vertical grid pattern (faint 64px columns) announce the section
 *     before the heading lands.
 *   - The eyebrow / heading / tagline live inside an accent-tinted
 *     rounded "anchor card" with a corner blur orb.
 *   - Dark-mode-aware: uses the codebase's documented tokens
 *     (`bg-white dark:bg-slate-900`, `border-slate-200 dark:border-slate-800`,
 *     `bg-accent-50 dark:bg-accent-950/20`, etc.).
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
  const hasRest = rest.length >= 2;

  return (
    <Section
      id="projects"
      ariaLabelledBy="projects-heading"
      divided
      className="relative overflow-hidden bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,theme(colors.accent.50),transparent_60%),linear-gradient(180deg,#fbfaf7_0%,#fff_100%)] py-20 before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px)] before:bg-[length:64px_100%] before:content-[''] sm:py-24 dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,oklch(0.24_0.08_254_/_0.4),transparent_60%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] dark:before:bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px)]"
    >
      <Container className="relative max-w-[1100px]">
        <div
          data-print="hidden"
          className="relative mb-14 overflow-hidden rounded-[20px] border border-accent-200 bg-gradient-to-br from-accent-50 via-white to-white p-10 before:pointer-events-none before:absolute before:-right-12 before:-top-12 before:h-60 before:w-60 before:rounded-full before:bg-accent-200/50 before:blur-3xl before:content-[''] sm:p-12 dark:border-accent-900/40 dark:bg-gradient-to-br dark:from-accent-950/20 dark:via-slate-900 dark:to-slate-900 dark:before:bg-accent-800/30"
        >
          <p className="mb-4 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent-600 before:h-px before:w-8 before:bg-accent-400 before:content-[''] dark:text-accent-400 dark:before:bg-accent-600">
            What I&apos;ve built
          </p>
          <h2
            id="projects-heading"
            className="mb-4 font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-100"
          >
            Featured Projects
          </h2>
          <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-slate-600 dark:text-slate-400">
            A selection of work I&apos;m proud of — hand-picked to show how I
            ship, not just where I worked. Click any project below to see
            the details. For the day-to-day, see the{' '}
            <a
              href="#experience"
              className="text-accent-700 underline decoration-accent-300 underline-offset-2 hover:decoration-accent-500 dark:text-accent-400 dark:decoration-accent-700"
            >
              experience timeline
            </a>
            .
          </p>
        </div>

        {hero && (
          <div className="mb-12">
            <HeroProjectCard project={hero} />
          </div>
        )}

        {hasRest && <ProjectsCarouselClient projects={rest} />}
      </Container>
    </Section>
  );
}
