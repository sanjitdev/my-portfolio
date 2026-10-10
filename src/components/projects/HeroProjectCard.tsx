import { ArrowUpRight, Briefcase, Building2, Sparkles, TrendingUp } from 'lucide-react';
import type { ProjectMd } from '@/lib/projects-md';

interface HeroProjectCardProps {
  project: ProjectMd;
}

/**
 * The "hero" project card — used for the most prominent project in the
 * section. Larger, richer, with explicit Scope / Impact / Contributions
 * framing and a two-column contributions + stack layout.
 *
 * Visual structure (ADR-006, Direction 1 — Editorial magazine spread):
 *   ┌─ Featured · Client ──────────────────────── ↗ ─┐
 *   │                                                │
 *   │  Big Playfair title (clamp 2rem → 3rem)        │
 *   │  Role · Year (mono-uppercase)                  │
 *   │                                                │
 *   │  Scope (one paragraph)                          │
 *   │                                                │
 *   │  ┌─ IMPACT (gradient accent box, TrendingUp) ┐ │
 *   │  │ The outcome / business result              │ │
 *   │  └────────────────────────────────────────────┘ │
 *   │                                                │
 *   │  CONTRIBUTIONS                       STACK     │
 *   │  1. ...                          [Angular] ...  │
 *   │  2. ...                                       │
 *   │  3. ...                                       │
 *   │                                                │
 *   │  [Read the case study →]   (footer CTA)        │
 *   └────────────────────────────────────────────────┘
 *
 * Decorative treatment:
 *   - White background with a corner blur orb in the top-right
 *   - Thick 4px gradient accent-400 → accent-200 left rule
 *   - Bigger impact box (gradient bg, 24px padding, TrendingUp icon)
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
      className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-12 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_60px_-20px_rgba(15,23,42,0.08)] sm:p-14 before:pointer-events-none before:absolute before:-right-20 before:-top-20 before:h-80 before:w-80 before:rounded-full before:bg-accent-100 before:blur-3xl after:pointer-events-none after:absolute after:left-0 after:top-12 after:bottom-12 after:w-1 after:rounded-r after:bg-gradient-to-b after:from-accent-400 after:to-accent-200 dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Eyebrow row */}
      <div className="relative mb-6 flex items-center justify-between gap-4">
        <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700 dark:text-accent-400">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          Featured Project
          {client && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                ·
              </span>
              <Building2 aria-hidden="true" className="h-3.5 w-3.5" />
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-100 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-accent-400"
          >
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Title + meta */}
      <header>
        <h3 className="mb-4 font-heading text-3xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
          {name}
        </h3>

        {(role || year) && (
          <p className="mb-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
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
        <p className="mb-7 max-w-[65ch] text-[1.0625rem] leading-relaxed text-slate-700 dark:text-slate-300">
          {scope}
        </p>
      )}

      {/* Impact (accent gradient box) */}
      {hasImpact && (
        <div className="relative mb-9 rounded-2xl border border-accent-200 bg-gradient-to-br from-accent-100 to-accent-50 p-6 sm:p-7 dark:border-accent-900/40">
          <TrendingUp
            aria-hidden="true"
            className="absolute right-6 top-5 h-5 w-5 text-accent-500"
          />
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-400">
            Impact
          </p>
          <p className="text-[1rem] leading-relaxed text-slate-800 dark:text-slate-200">
            {impact}
          </p>
        </div>
      )}

      {/* Contributions + Stack (two-column on desktop) */}
      {(hasContributions || stack.length > 0) && (
        <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:gap-12">
          {hasContributions && (
            <div>
              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
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
              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
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
      )}

      {/* Footer CTA */}
      {hasLink && (
        <footer className="mt-9 border-t border-slate-200 pt-6 dark:border-slate-800">
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
