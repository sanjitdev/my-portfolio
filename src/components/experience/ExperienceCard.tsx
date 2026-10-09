import { Briefcase, Calendar, MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/shared/Card';
import type { Experience } from '@/lib/cv-types';
import { formatDateRange } from '@/lib/cv-data';

interface ExperienceCardProps {
  experience: Experience;
}

/**
 * A single experience entry. Two-column layout on desktop (role + company on
 * the left, dates + location + duration on the right), stacked on mobile.
 */
export function ExperienceCard({ experience }: ExperienceCardProps) {
  const { company, title, start_date, end_date, duration, location, responsibilities } = experience;
  const dateRange = formatDateRange(start_date, end_date);

  return (
    <Card data-print="card" className="relative">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:gap-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 sm:text-xl dark:text-slate-100">
            {title}
          </h3>
          <p className="mt-1 inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Briefcase aria-hidden="true" className="h-4 w-4 text-accent-500" />
            <span className="font-medium">{company}</span>
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-slate-500 md:items-end md:text-right dark:text-slate-400">
          <p className="inline-flex items-center gap-1.5 font-mono font-medium text-slate-700 md:justify-end dark:text-slate-300">
            <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
            {dateRange}
          </p>
          <p className="inline-flex items-center gap-1.5 md:justify-end">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
            {location}
          </p>
          <p className="inline-flex items-center gap-1.5 md:justify-end">
            <Clock aria-hidden="true" className="h-3.5 w-3.5" />
            {duration}
          </p>
        </div>
      </div>
      {responsibilities.length > 0 && (
        <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 pl-0 text-slate-700 dark:border-slate-800 dark:text-slate-300">
          {responsibilities.map((line, idx) => (
            <li
              key={idx}
              className="relative pl-5 leading-relaxed before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent-500"
            >
              {line}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
