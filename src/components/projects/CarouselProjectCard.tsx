import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { ProjectMd } from '@/lib/projects-md';

interface CarouselProjectCardProps {
  project: ProjectMd;
  onOpen: (project: ProjectMd) => void;
}

/**
 * A teaser card for the projects carousel — shows just the project
 * name and stack tags, with a clear "click to view details" cue.
 *
 * Visual structure (ADR-006, Direction 2 — Carousel magazine spread):
 *   ┌─ Sparkles · Stack ────────── ↗ ─┐
 *   │ Project Name (Playfair h3)      │
 *   │                                  │
 *   │ [Stack tags...]                 │
 *   └──────────────────────────────────┘
 *
 * Decorative treatment: 3px accent left rule (visual cousin of the
 * older compact card so the section still feels consistent). Hover
 * lifts the card and reveals the accent color on the arrow icon.
 *
 * The whole card is a single `<button>` so it is keyboard-activatable
 * by default. The button announces `aria-haspopup="dialog"` so screen
 * readers know clicking it will open a modal.
 */
export function CarouselProjectCard({ project, onOpen }: CarouselProjectCardProps) {
  const { name, stack, client } = project;
  const showClient = Boolean(client);

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-haspopup="dialog"
      aria-label={`Open details for ${name}`}
      data-layout="carousel"
      className="group relative flex h-full w-full flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 before:pointer-events-none before:absolute before:left-0 before:top-5 before:bottom-5 before:w-[3px] before:rounded-r before:bg-accent-300 before:content-[''] hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)] focus-visible:-translate-y-0.5 focus-visible:border-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 active:translate-y-0 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)] dark:before:bg-accent-700 dark:hover:border-accent-700 dark:hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)] dark:focus-visible:border-accent-600 dark:focus-visible:ring-accent-400 dark:focus-visible:ring-offset-slate-950"
    >
      <div className="flex w-full items-start justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          <Sparkles aria-hidden="true" className="h-3 w-3 text-accent-500 dark:text-accent-400" />
          {showClient ? client : 'Project'}
        </p>
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 flex-shrink-0 text-slate-400 transition-colors group-hover:text-accent-600 group-focus-visible:text-accent-600 dark:text-slate-500 dark:group-hover:text-accent-400 dark:group-focus-visible:text-accent-400"
        />
      </div>

      <h3 className="font-heading text-lg font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-100">
        {name}
      </h3>

      {stack.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Tech stack">
          {stack.map(tech => (
            <li
              key={tech}
              className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
    </button>
  );
}
