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
    <Card>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{institution}</h3>
      {label && (
        <p className="text-slate-600 dark:text-slate-400">
          {label}
          {field_of_study ? ` · ${field_of_study}` : ''}
        </p>
      )}
      {dateRange && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{dateRange}</p>}
    </Card>
  );
}
