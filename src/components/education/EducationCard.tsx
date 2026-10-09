import { GraduationCap, Calendar } from 'lucide-react';
import { Card } from '@/components/shared/Card';
import type { Education } from '@/lib/cv-types';
import { formatDateRange } from '@/lib/cv-data';

interface EducationCardProps {
  education: Education;
}

/**
 * A single education entry. The schema allows either `degree` or `program`
 * (some entries have one, some the other) and optional `field_of_study`,
 * `start_date`, and `end_date`. We render whichever fields are present.
 */
export function EducationCard({ education }: EducationCardProps) {
  const { institution, degree, program, field_of_study, start_date, end_date } = education;
  const label = degree ?? program;
  const hasDateRange = start_date && end_date;
  const dateRange = hasDateRange ? formatDateRange(start_date, end_date) : null;

  return (
    <Card data-print="card">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
          <GraduationCap aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
            {institution}
          </h3>
          {label && (
            <p className="mt-0.5 text-slate-600 dark:text-slate-400">
              {label}
              {field_of_study ? ` · ${field_of_study}` : ''}
            </p>
          )}
          {dateRange && (
            <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
              {dateRange}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
