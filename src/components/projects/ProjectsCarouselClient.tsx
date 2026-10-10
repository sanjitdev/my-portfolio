'use client';

import { useState } from 'react';
import type { ProjectMd } from '@/lib/projects-md';
import { CarouselProjectCard } from './CarouselProjectCard';
import { ProjectDetailsDialog } from './ProjectDetailsDialog';

interface ProjectsCarouselClientProps {
  projects: ProjectMd[];
}

/**
 * Client-side wrapper for the projects carousel. Holds the active-
 * project state for the dialog and renders the scroll-snap rail.
 *
 * Why a Client Component: the carousel needs `useState` for the
 * modal, and the modal needs a ref on a native `<dialog>`. The
 * surrounding `ProjectsSection` stays a Server Component.
 *
 * Layout (ADR-006, Direction 2 — Carousel magazine spread):
 *   - A horizontal CSS scroll-snap rail (no JS, no new deps).
 *   - Each card is a `<button>` (keyboard-activatable) with
 *     `aria-haspopup="dialog"` announcing the modal.
 *   - The dialog is a native `<dialog>` opened via `showModal()`.
 *
 * Only renders when 2+ projects are passed (1 project = no carousel;
 * the hero already shows it).
 */
export function ProjectsCarouselClient({ projects }: ProjectsCarouselClientProps) {
  const [activeProject, setActiveProject] = useState<ProjectMd | null>(null);

  if (projects.length < 2) {
    return null;
  }

  return (
    <>
      <div
        data-testid="projects-carousel"
        data-print="hidden"
        className="relative -mx-6 sm:-mx-8"
      >
        <p
          id="more-projects-label"
          className="mb-4 px-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:px-8 dark:text-slate-400"
        >
          Also shipped
        </p>
        <div
          role="region"
          aria-labelledby="more-projects-label"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-pl-6 sm:gap-5 sm:scroll-pl-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingLeft: '1.5rem' }}
        >
          {projects.map(project => (
            <div
              key={project.name}
              className="w-[260px] flex-shrink-0 snap-start sm:w-[300px]"
            >
              <CarouselProjectCard
                project={project}
                onOpen={setActiveProject}
              />
            </div>
          ))}
        </div>
      </div>

      <ProjectDetailsDialog
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
}
