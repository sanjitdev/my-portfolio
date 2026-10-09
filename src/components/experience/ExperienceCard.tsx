'use client';

import { useId, useState } from 'react';
import { Briefcase, ChevronDown, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import type { Experience } from '@/lib/cv-types';
import { formatDateRange } from '@/lib/cv-data';

interface ExperienceCardProps {
  experience: Experience;
  /** Open by default (used for the most recent role). */
  defaultExpanded?: boolean;
}

/**
 * One experience entry, rendered as a timeline card. The vertical timeline
 * rail is drawn by `ExperienceSection`; this card renders the dot + content.
 *
 * Progressive disclosure: the responsibilities are collapsed by default and
 * revealed via a "N responsibilities" / "Hide details" toggle. The most
 * recent role (`defaultExpanded`) is open initially to give a quick sense of
 * current work. Subsequent roles stay closed so the page scans cleanly.
 *
 * Privacy: receives only the public `Experience` shape — no address fields.
 */
export function ExperienceCard({ experience, defaultExpanded = false }: ExperienceCardProps) {
  const { company, title, start_date, end_date, duration, location, responsibilities } = experience;
  const dateRange = formatDateRange(start_date, end_date);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const detailsId = useId();

  const hasDetails = responsibilities.length > 0;
  const isCurrent = end_date === 'Present' || end_date === 'present';

  return (
    <article
      data-print="card"
      className={clsx('relative pl-12 md:pl-24', 'md:grid md:grid-cols-[5.5rem_1fr] md:gap-6')}
    >
      {/* Timeline dot — centered on the rail at left-5 (mobile) / left-15 (desktop) */}
      <span
        aria-hidden="true"
        className={clsx(
          'absolute top-2 z-10 h-3 w-3 rounded-full',
          'left-[14px] md:left-[58px]',
          isCurrent
            ? 'bg-accent-500 ring-4 ring-white dark:ring-slate-950'
            : 'bg-slate-300 group-hover:bg-accent-500 dark:bg-slate-700 dark:group-hover:bg-accent-500',
        )}
      />

      {/* Date rail (desktop only) */}
      <div className="hidden md:block">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-300">
          {start_date.split(' ')[1] ?? start_date}
        </p>
        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          {isCurrent ? 'Present' : (end_date.split(' ')[1] ?? end_date)}
        </p>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-500">{duration}</p>
      </div>

      {/* Content column */}
      <div>
        {/* Mobile-only date pill */}
        <p className="mb-2 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 md:hidden dark:text-slate-400">
          <span>{dateRange}</span>
          <span aria-hidden="true">·</span>
          <span>{duration}</span>
        </p>

        <h3 className="font-heading text-xl font-semibold leading-snug text-slate-900 sm:text-2xl dark:text-slate-100">
          {title}
        </h3>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 font-medium text-accent-700 dark:text-accent-400">
            <Briefcase aria-hidden="true" className="h-3.5 w-3.5" />
            {company}
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
            {location}
          </span>
        </p>

        {hasDetails && (
          <>
            <button
              type="button"
              onClick={() => setExpanded(v => !v)}
              aria-expanded={expanded}
              aria-controls={detailsId}
              className={clsx(
                'mt-4 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium',
                'text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900',
                'dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                'print-hidden',
              )}
            >
              {expanded ? 'Hide details' : `${responsibilities.length} responsibilities`}
              <ChevronDown
                aria-hidden="true"
                className={clsx(
                  'h-3.5 w-3.5 transition-transform duration-200',
                  expanded && 'rotate-180',
                )}
              />
            </button>

            <div
              id={detailsId}
              className={clsx(
                'grid transition-[grid-template-rows] duration-300 ease-out',
                expanded ? 'mt-4 grid-rows-[1fr]' : 'grid-rows-[0fr]',
                'print:grid-rows-[1fr] print:mt-4',
              )}
            >
              <div className="overflow-hidden">
                <ul className="space-y-2.5 border-l-2 border-accent-200/70 pl-5 dark:border-accent-800/50">
                  {responsibilities.map((line, idx) => (
                    <li
                      key={idx}
                      className="relative text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
