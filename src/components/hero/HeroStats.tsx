import { getCvStats } from '@/lib/cv-stats';
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
 */
export function HeroStats({ cv }: HeroStatsProps) {
  const stats = getCvStats(cv);

  const items = [
    { value: `${stats.yearsExperience}+`, label: 'Years experience' },
    { value: `${stats.companiesCount}`, label: 'Companies' },
    { value: `${stats.skillsCount}+`, label: 'Technologies' },
    { value: `${stats.certificationsCount}`, label: 'Certifications' },
  ];

  return (
    <dl
      aria-label="Career at a glance"
      className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-4 dark:border-slate-800 dark:bg-slate-800"
    >
      {items.map(item => (
        <div
          key={item.label}
          className="flex flex-col gap-1 bg-white px-4 py-5 sm:px-6 sm:py-6 dark:bg-slate-950"
        >
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {item.label}
          </dt>
          <dd className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
