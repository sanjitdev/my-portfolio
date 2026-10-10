'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProjectMd } from '@/lib/projects-md';
import { CarouselProjectCard } from './CarouselProjectCard';
import { ProjectDetailsDialog } from './ProjectDetailsDialog';

interface ProjectsCarouselClientProps {
  projects: ProjectMd[];
}

const CARD_WIDTH_SM = 300; // px — must match the sm:w-[300px] in the rail
const CARD_WIDTH_BASE = 260; // px — must match the w-[260px] in the rail
const GAP = 20; // px — must match the sm:gap-5 in the rail
const GAP_BASE = 16; // px — must match the gap-4 in the rail

/**
 * Client-side wrapper for the projects carousel. Holds the active-
 * project state for the dialog, manages scroll position for the nav
 * controls, and renders the scroll-snap rail.
 *
 * Why a Client Component: the carousel needs `useState` for the
 * modal, the modal needs a ref on a native `<dialog>`, and the
 * nav controls need to read/write `scrollLeft`. The surrounding
 * `ProjectsSection` stays a Server Component.
 *
 * Layout (ADR-006, Direction 3 — Carousel with nav controls):
 *   ┌─ Also shipped ─────────────────────────────────┐
 *   │  [←] ┌────────────────────────────────────┐ [→] │
 *   │      │  card │ card │ card │ card │ card →  │    │
 *   │      └────────────────────────────────────┘    │
 *   │                  • • ● • • •                    │
 *   └─────────────────────────────────────────────────┘
 *
 * - Prev/Next: round 40×40 buttons, absolute-positioned over the
 *   rail at left-0 / right-0 / top-1/2. Hidden on mobile (swipe
 *   is the primary affordance there) and at scroll boundaries
 *   (disabled with reduced opacity).
 * - Dots: 8px circles, one per "page" of visible cards. Click
 *   to scroll-to-page. Active dot tracks the leftmost visible
 *   card via the rail's `scroll` event.
 * - Scroll behavior: page-by-page. `scrollBy({ left: ±(cardWidth
 *   + gap) })` advances by exactly one card.
 * - Reduced motion: scrollBy uses `behavior: 'auto'` when
 *   `prefers-reduced-motion: reduce` is set (CSS already disables
 *   smooth scroll globally, but explicit `scrollBy` needs the
 *   guard).
 *
 * Only renders when 2+ projects are passed (1 project = no carousel;
 * the hero already shows it).
 */
export function ProjectsCarouselClient({ projects }: ProjectsCarouselClientProps) {
  const [activeProject, setActiveProject] = useState<ProjectMd | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    scrollLeft: 0,
    scrollWidth: 0,
    clientWidth: 0,
  });

  // Sync scrollLeft / scrollWidth / clientWidth whenever the rail
  // scrolls or the viewport changes. The page count and active dot
  // are derived from these.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const update = () => {
      setScrollState({
        scrollLeft: rail.scrollLeft,
        scrollWidth: rail.scrollWidth,
        clientWidth: rail.clientWidth,
      });
    };

    update();
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      rail.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const isAtStart = scrollState.scrollLeft <= 4;
  const isAtEnd =
    scrollState.scrollLeft + scrollState.clientWidth >=
    scrollState.scrollWidth - 4;

  // Compute card stride (card width + gap) based on viewport
  // breakpoint. Matches the Tailwind classes on the rail's items.
  // Guarded so test environments (jsdom) without matchMedia still work.
  const getStride = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return CARD_WIDTH_SM + GAP;
    }
    return window.matchMedia('(min-width: 640px)').matches
      ? CARD_WIDTH_SM + GAP
      : CARD_WIDTH_BASE + GAP_BASE;
  }, []);

  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handlePrev = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: -getStride(),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [getStride, prefersReducedMotion]);

  const handleNext = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: getStride(),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [getStride, prefersReducedMotion]);

  const handleDot = useCallback(
    (pageIndex: number) => {
      const rail = railRef.current;
      if (!rail) return;
      const stride = getStride();
      rail.scrollTo({
        left: stride * pageIndex,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    },
    [getStride, prefersReducedMotion],
  );

  if (projects.length < 2) {
    return null;
  }

  // Compute page count and active page.
  const stride = getStride();
  const pages = Math.max(
    1,
    Math.ceil(scrollState.scrollWidth / stride) || projects.length,
  );
  const activePage = Math.round(scrollState.scrollLeft / stride);

  return (
    <>
      <div
        data-testid="projects-carousel"
        data-print="hidden"
        className="relative -mx-6 sm:-mx-8"
      >
        <div className="mb-4 flex items-end justify-between gap-4 px-6 sm:px-8">
          <p
            id="more-projects-label"
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
          >
            Also shipped
          </p>
          {/* Prev / Next — desktop only (mobile uses swipe) */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isAtStart}
              aria-label="Previous projects"
              data-testid="carousel-prev"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-accent-300 hover:text-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-accent-700 dark:hover:text-accent-400 dark:focus-visible:ring-accent-400"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isAtEnd}
              aria-label="Next projects"
              data-testid="carousel-next"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-accent-300 hover:text-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-accent-700 dark:hover:text-accent-400 dark:focus-visible:ring-accent-400"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={railRef}
            role="region"
            aria-labelledby="more-projects-label"
            aria-live="polite"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pl-6 pr-6 scroll-pl-6 sm:gap-5 sm:pl-8 sm:pr-8 sm:scroll-pl-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

        {/* Dots — show when more than 1 page */}
        {pages > 1 && (
          <div
            role="tablist"
            aria-label="Carousel pages"
            data-testid="carousel-dots"
            className="mt-6 flex items-center justify-center gap-2"
          >
            {Array.from({ length: pages }, (_, i) => i).map(i => {
              const isActive = i === activePage;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to page ${i + 1} of ${pages}`}
                  onClick={() => handleDot(i)}
                  data-testid={`carousel-dot-${i}`}
                  className={`h-2 w-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 dark:focus-visible:ring-accent-400 dark:focus-visible:ring-offset-slate-950 ${
                    isActive
                      ? 'bg-accent-500 dark:bg-accent-400'
                      : 'bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      <ProjectDetailsDialog
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
}
