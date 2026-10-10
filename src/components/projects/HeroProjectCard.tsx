import { ArrowUpRight, Briefcase, Building2, Sparkles } from 'lucide-react';
import type { ProjectMd } from '@/lib/projects-md';
import { Tag } from '@/components/shared/Tag';

interface HeroProjectCardProps {
  project: ProjectMd;
}

/**
 * The "hero" project card — used for the most prominent project in the
 * section. Larger, richer, with explicit Scope / Impact / Contributions
 * framing and a two-column contributions + stack layout.
 *
 * Visual structure:
 *   ┌─ Eyebrow (e.g. "Featured · Global Client") ──────────── ↗ ─┐
 *   │                                                            │
 *   │  Big Playfair title                                         │
 *   │  Role · Year · Client (mono-uppercase chips)                │
 *   │                                                            │
 *   │  Scope (one paragraph)                                      │
 *   │                                                            │
 *   │  ┌─ IMPACT (accent box) ─────────────────────────┐          │
 *   │  │ The outcome / business result                 │          │
 *   │  └────────────────────────────────────────────────┘          │
 *   │                                                            │
 *   │  CONTRIBUTIONS                       STACK                 │
 *   │  1. ...                          [Angular] [Syncfusion]   │
 *   │  2. ...                          [.NET Core]               │
 *   │  3. ...                                                    │
 *   │  4. ...                                                    │
 *   │                                                            │
 *   │  [Read the case study →]   (footer CTA, optional)          │
 *   └────────────────────────────────────────────────────────────┘
 *
 * Optional fields degrade gracefully: missing `scope` / `impact` /
 * `contributions` / `link` remove the corresponding block entirely.
 */
export function HeroProjectCard({ project }: HeroProjectCardProps) {
  const { name, client, role, year, scope, impact, contributions, stack, link } = project;
  const hasImpact = Boolean(impact && impact.trim());
  const hasContributions = contributions.length > 0;
  const hasLink = Boolean(link);

  return (
    <article
      data-print="card"
      data-layout="hero"
      className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50/60 p-8 shadow-sm sm:p-10 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
    >
      {/* Decorative accent corner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent-500/8 blur-3xl dark:bg-accent-500/12"
      />

      {/* Eyebrow row */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent-700 dark:text-accent-400">
          <Sparkles aria-hidden="true" className="h-3 w-3" />
          Featured Project
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-accent-400"
          >
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Title + meta */}
      <header>
        <h3 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
          {name}
        </h3>

        {(role || year) && (
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
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
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">
                {year}
              </span>
            )}
          </p>
        )}
      </header>

      {/* Scope (description) */}
      {scope && (
        <p className="mt-6 text-[1.05rem] leading-relaxed text-slate-700 dark:text-slate-300">
          {scope}
        </p>
      )}

      {/* Impact (accent box) */}
      {hasImpact && (
        <div className="mt-6 rounded-lg border border-accent-200/60 bg-accent-50/60 p-5 dark:border-accent-900/40 dark:bg-accent-950/20">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-700 dark:text-accent-400">
            Impact
          </p>
          <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-800 dark:text-slate-200">
            {impact}
          </p>
        </div>
      )}

      {/* Contributions + Stack (two-column on desktop) */}
      {(hasContributions || stack.length > 0) && (
        <div className="mt-8 grid gap-8 sm:grid-cols-[1.4fr_1fr]">
          {hasContributions && (
            <div>
              <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Contributions
              </p>
              <ol className="space-y-2 text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300">
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
              <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Stack
              </p>
              <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
                {stack.map(tech => (
                  <li key={tech}>
                    <Tag className="text-[11px] font-mono uppercase tracking-wider">
                      {tech}
                    </Tag>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Footer CTA */}
      {hasLink && (
        <footer className="mt-8 border-t border-slate-200 pt-5 dark:border-slate-800">
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
    </article>
  );
}
