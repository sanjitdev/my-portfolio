import { ArrowUpRight, Building2, Sparkles } from 'lucide-react';
import type { ProjectMd } from '@/lib/projects-md';

interface CompactProjectCardProps {
  project: ProjectMd;
  /**
   * Optional label override for the section eyebrow (e.g. "Previous").
   * Defaults to "Also shipped".
   */
  eyebrow?: string;
}

/**
 * A compact project card — used for projects below the hero. Richer
 * than a "truncated" version (Direction 1 design): shows every
 * contribution, the full impact box, and the full stack so the
 * supporting projects have real weight next to the hero.
 *
 * Visual structure (ADR-006, Direction 1 — Editorial magazine spread):
 *   ┌─ Also shipped · Client ─────────────── ↗ ─┐
 *   │ Title (Playfair h3)                        │
 *   │ Role · Year (mono-uppercase)               │
 *   │ Scope (one paragraph)                      │
 *   │                                            │
 *   │ ┌─ IMPACT (accent box) ────────────────┐   │
 *   │ │ outcome                              │   │
 *   │ └──────────────────────────────────────┘   │
 *   │                                            │
 *   │ • contribution                              │
 *   │ • contribution                              │
 *   │ • contribution                              │
 *   │                                            │
 *   │ [Stack tags]              [Read →]         │
 *   └────────────────────────────────────────────┘
 *
 * Decorative treatment: thick 3px accent-300 left rule.
 */
export function CompactProjectCard({ project, eyebrow = 'Also shipped' }: CompactProjectCardProps) {
  const { name, client, role, year, scope, impact, contributions, stack, link } = project;
  const hasImpact = Boolean(impact && impact.trim());
  const hasContributions = contributions.length > 0;
  const hasLink = Boolean(link);

  return (
    <article
      data-print="card"
      data-layout="compact"
      className="relative flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-9 before:pointer-events-none before:absolute before:left-0 before:top-6 before:bottom-6 before:w-[3px] before:rounded-r before:bg-accent-300 dark:border-slate-800 dark:bg-slate-900"
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          <Sparkles aria-hidden="true" className="h-3 w-3 text-accent-500" />
          {eyebrow}
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
        {hasLink && (
          <a
            href={link!.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link!.label} (opens in a new tab)`}
            className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-100 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-accent-400"
          >
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        )}
      </header>

      <h3 className="mb-2 font-heading text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-[1.5rem] dark:text-slate-100">
        {name}
      </h3>

      {(role || year) && (
        <p className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-500">
          {role && <span className="font-medium text-accent-700 dark:text-accent-400">{role}</span>}
          {role && year && (
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
              ·
            </span>
          )}
          {year && <span className="font-mono text-[11px] uppercase tracking-[0.14em]">{year}</span>}
        </p>
      )}

      {scope && (
        <p className="mb-4 text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300">
          {scope}
        </p>
      )}

      {hasImpact && (
        <div className="mb-5 rounded-xl border border-accent-200 bg-accent-50 p-4 dark:border-accent-900/30 dark:bg-accent-950/20">
          <p className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-400">
            Impact
          </p>
          <p className="text-[0.9rem] leading-relaxed text-slate-800 dark:text-slate-200">
            {impact}
          </p>
        </div>
      )}

      {hasContributions && (
        <ul className="mb-6 flex flex-col gap-2 text-[0.9rem] leading-relaxed text-slate-700 dark:text-slate-300">
          {contributions.map((c, i) => (
            <li key={i} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-500"
              />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-auto flex flex-1 flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
        {stack.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
            {stack.map(tech => (
              <li
                key={tech}
                className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : (
          <span />
        )}
        {hasLink && (
          <a
            href={link!.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-accent-700 hover:text-accent-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:text-accent-400 dark:hover:text-accent-300"
          >
            {link!.label}
            <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
          </a>
        )}
      </footer>
    </article>
  );
}
