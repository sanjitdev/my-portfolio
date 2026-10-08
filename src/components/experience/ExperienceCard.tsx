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
    <Card>
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:gap-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="text-slate-600 dark:text-slate-400">{company}</p>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 md:text-right">
          <p className="font-medium text-slate-700 dark:text-slate-300">{dateRange}</p>
          <p>{duration}</p>
          <p>{location}</p>
        </div>
      </div>
      {responsibilities.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
          {responsibilities.map((line, idx) => (
            <li key={idx} className="leading-relaxed">
              {line}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
