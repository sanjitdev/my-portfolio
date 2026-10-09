import { getHeroStatValues } from '@/lib/hero-stats';
import type { CvData } from '@/lib/cv-types';

interface HeroStatsProps {
  cv: CvData;
}

/**
 * Stats bar shown beneath the hero copy. Four quick numbers that give a
 * scanning reader a sense of scope:
 *   - Years of professional experience
 *   - Companies worked at
 *   - Technologies in toolkit
 *   - Professional certifications
 *
 * Editorial stat strip (matches the magazine-style typography used
 * elsewhere on the site):
 *   - "Career at a glance" eyebrow in mono caps, accent color.
 *   - One row of four stat cells. Each cell: big Playfair number, a
 *     short accent underline, then a two-line label (primary metric
 *     name in mono caps + secondary descriptor in light text).
 *   - 4-up on desktop, 2x2 on mobile. No boxes, no grid borders — just
 *     spacing and a hairline rule between the row and the eyebrow.
 *
 * Number sources come from `getHeroStatValues(cv)` — years is derived
 * from CV dates; the other three are curated values (see
 * `src/lib/hero-stats.ts`).
 */
export function HeroStats({ cv }: HeroStatsProps) {
  const stats = getHeroStatValues(cv);

  const items = [
    { value: `${stats.yearsExperience}+`, label: 'Years', descriptor: 'experience' },
    { value: `${stats.companies}`, label: 'Companies', descriptor: 'worked at' },
    { value: `${stats.technologies}+`, label: 'Technologies', descriptor: 'in toolkit' },
    { value: `${stats.certifications}`, label: 'Certifications', descriptor: 'earned' },
  ];

  return (
    <section aria-label="Career at a glance" className="mt-14 sm:mt-16">
      <p className="mb-6 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent-600 dark:text-accent-400">
        <span aria-hidden="true" className="h-px w-8 bg-accent-400/60 dark:bg-accent-600/60" />
        Career at a glance
      </p>

      <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-10 sm:gap-y-0">
        {items.map(item => (
          <div key={item.label} className="flex flex-col">
            <dt>
              <span className="font-heading text-5xl font-semibold leading-none tracking-tight text-slate-900 sm:text-6xl dark:text-slate-100">
                {item.value}
              </span>
              <span
                aria-hidden="true"
                className="mt-3 block h-px w-10 bg-accent-400/70 sm:mt-4 dark:bg-accent-500/60"
              />
            </dt>
            <dd className="mt-3 sm:mt-4">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-slate-700 dark:text-slate-300">
                {item.label}
              </p>
              <p className="mt-0.5 text-sm leading-snug text-slate-500 dark:text-slate-500">
                {item.descriptor}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
