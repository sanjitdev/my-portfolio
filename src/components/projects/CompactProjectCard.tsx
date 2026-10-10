import { ArrowUpRight, Building2, Sparkles } from 'lucide-react';
import type { ProjectMd } from '@/lib/projects-md';
import { Tag } from '@/components/shared/Tag';

interface CompactProjectCardProps {
  project: ProjectMd;
  /**
   * Optional label override for the section eyebrow (e.g. "Previous").
   * Defaults to "Also shipped".
   */
  eyebrow?: string;
}

/**
 * A compact project card — used for projects below the hero. Smaller,
 * denser, but still uses the same Scope / Impact / Contributions
 * structure as the hero card so the two feel like the same family.
 *
 * Visual structure:
 *   ┌─ Also shipped · Client ─────────────── ↗ ─┐
 *   │ Title (Playfair h3)                        │
 *   │ Scope (one paragraph)                      │
 *   │                                            │
 *   │ ┌─ IMPACT ────────────────┐                │
 *   │ │ outcome                  │                │
 *   │ └──────────────────────────┘                │
 *   │                                            │
 *   │ [Stack tags]              [Read →]         │
 *   └────────────────────────────────────────────┘
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
      className="group relative flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      <header className="flex items-start justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
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
            className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-accent-400"
          >
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        )}
      </header>

      <h3 className="mt-3 font-heading text-xl font-semibold leading-snug text-slate-900 sm:text-2xl dark:text-slate-100">
        {name}
      </h3>

      {(role || year) && (
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-500">
          {role && <span className="font-medium text-accent-700 dark:text-accent-400">{role}</span>}
          {role && year && (
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
              ·
            </span>
          )}
          {year && <span className="font-mono uppercase tracking-[0.14em]">{year}</span>}
        </p>
      )}

      {scope && (
        <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300">
          {scope}
        </p>
      )}

      {hasImpact && (
        <div className="mt-4 rounded-md border border-accent-200/60 bg-accent-50/40 p-3.5 dark:border-accent-900/30 dark:bg-accent-950/15">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-accent-700 dark:text-accent-400">
            Impact
          </p>
          <p className="mt-1 text-[0.9rem] leading-relaxed text-slate-800 dark:text-slate-200">
            {impact}
          </p>
        </div>
      )}

      {hasContributions && (
        <ul className="mt-4 space-y-1.5 text-[0.85rem] leading-relaxed text-slate-600 dark:text-slate-400">
          {contributions.slice(0, 3).map((c, i) => (
            <li key={i} className="flex gap-2">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent-500"
              />
              <span>{c}</span>
            </li>
          ))}
          {contributions.length > 3 && (
            <li className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              + {contributions.length - 3} more
            </li>
          )}
        </ul>
      )}

      <footer className="mt-5 flex flex-1 flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        {stack.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
            {stack.map(tech => (
              <li key={tech}>
                <Tag className="text-[10px] font-mono uppercase tracking-wider">{tech}</Tag>
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
