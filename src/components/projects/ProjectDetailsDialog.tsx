'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight, Briefcase, Building2, Sparkles, TrendingUp, X } from 'lucide-react';
import type { ProjectMd } from '@/lib/projects-md';

interface ProjectDetailsDialogProps {
  project: ProjectMd | null;
  onClose: () => void;
}

/**
 * Native `<dialog>` modal showing the full project details.
 *
 * Why native `<dialog>`: it gives us focus trap, ESC dismiss, body
 * scroll lock, and proper `role="dialog" aria-modal="true"` for free
 * with zero new dependencies. We just call `showModal()` / `close()`.
 *
 * Behavior (ADR-006, Direction 2):
 *   - Opens when `project` becomes non-null (useEffect → showModal()).
 *   - Closes when `project` becomes null OR the user presses ESC OR
 *     clicks the backdrop OR clicks the X button.
 *   - Backdrop click: native `<dialog>` doesn't fire close on
 *     backdrop click by default, so we attach a click listener that
 *     closes if `event.target === dialogRef.current` (the backdrop
 *     region). Clicks on the inner panel stop at the panel because
 *     of `event.stopPropagation()` on the panel handler.
 *   - Body scroll lock: provided by `showModal()` automatically.
 *
 * The `project-dialog` class (defined in globals.css) handles the
 * backdrop and open animation; Tailwind v4's `backdrop:` variant
 * isn't always reliable, so we use a dedicated utility class.
 *
 * Visual treatment: matches `HeroProjectCard` (Direction 1) for
 * consistency — Playfair heading, gradient impact box with TrendingUp
 * icon, numbered contributions, pill stack tags.
 */
export function ProjectDetailsDialog({ project, onClose }: ProjectDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Sync React state with the <dialog> element's open/close.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project && !dialog.open) {
      dialog.showModal();
      // Move focus to the close button after open so keyboard users
      // have a predictable focus target.
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (!project && dialog.open) {
      dialog.close();
    }
  }, [project]);

  // Backdrop click handler — close if the click landed on the
  // <dialog> element itself (i.e., the backdrop), not on a child.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClick = (event: MouseEvent) => {
      if (event.target === dialog) {
        onClose();
      }
    };

    dialog.addEventListener('click', handleClick);
    return () => dialog.removeEventListener('click', handleClick);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="project-dialog-title"
      className="project-dialog m-auto max-w-2xl w-[calc(100%-2rem)] max-h-[calc(100vh-4rem)] rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      data-testid="project-dialog"
      onClick={event => event.stopPropagation()}
    >
      {project ? (
        <DialogContent
          project={project}
          onClose={onClose}
          closeButtonRef={closeButtonRef}
        />
      ) : null}
    </dialog>
  );
}

interface DialogContentProps {
  project: ProjectMd;
  onClose: () => void;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
}

function DialogContent({ project, onClose, closeButtonRef }: DialogContentProps) {
  const { name, client, role, year, scope, impact, contributions, stack, link } = project;
  const hasImpact = Boolean(impact && impact.trim());
  const hasContributions = contributions.length > 0;
  const hasLink = Boolean(link);

  return (
    <div
      className="relative flex max-h-[calc(100vh-4rem)] flex-col overflow-hidden"
      data-testid="project-dialog-content"
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-4 border-b border-slate-100 p-6 dark:border-slate-800 sm:p-8">
        <div className="min-w-0 flex-1">
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-400">
            <Sparkles aria-hidden="true" className="h-3 w-3" />
            Project
            {client && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                  ·
                </span>
                <Building2 aria-hidden="true" className="h-3 w-3" />
                {client}
              </>
            )}
          </p>
          <h2
            id="project-dialog-title"
            className="font-heading text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100"
          >
            {name}
          </h2>
          {(role || year) && (
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
              {role && (
                <span className="inline-flex items-center gap-1.5 font-medium text-accent-700 dark:text-accent-400">
                  <Briefcase aria-hidden="true" className="h-3.5 w-3.5" />
                  {role}
                </span>
              )}
              {role && year && (
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                  ·
                </span>
              )}
              {year && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]">
                  {year}
                </span>
              )}
            </p>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          {hasLink && (
            <a
              href={link!.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link!.label} (opens in a new tab)`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-100 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-accent-400"
            >
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Body — scrollable */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8">
        {scope && (
          <p className="mb-6 max-w-[65ch] text-[1rem] leading-relaxed text-slate-700 dark:text-slate-300">
            {scope}
          </p>
        )}

        {hasImpact && (
          <div className="relative mb-7 rounded-2xl border border-accent-200 bg-gradient-to-br from-accent-100 to-accent-50 p-6 dark:border-accent-900/40 dark:bg-gradient-to-br dark:from-accent-900/40 dark:to-accent-950/20">
            <TrendingUp
              aria-hidden="true"
              className="absolute right-5 top-4 h-5 w-5 text-accent-500 dark:text-accent-400"
            />
            <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-400">
              Impact
            </p>
            <p className="pr-8 text-[0.95rem] leading-relaxed text-slate-800 dark:text-slate-200">
              {impact}
            </p>
          </div>
        )}

        {hasContributions && (
          <div className="mb-6">
            <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Contributions
            </p>
            <ol className="flex flex-col gap-2.5 text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300">
              {contributions.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-100 font-mono text-[10px] font-semibold text-accent-700 dark:bg-accent-900/40 dark:text-accent-300"
                  >
                    {i + 1}
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {stack.length > 0 && (
          <div>
            <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Stack
            </p>
            <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
              {stack.map(tech => (
                <li
                  key={tech}
                  className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      {hasLink && (
        <footer className="border-t border-slate-100 p-6 dark:border-slate-800 sm:px-8">
          <a
            href={link!.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 transition-colors hover:text-accent-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:text-accent-400 dark:hover:text-accent-300"
          >
            {link!.label}
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </footer>
      )}
    </div>
  );
}
