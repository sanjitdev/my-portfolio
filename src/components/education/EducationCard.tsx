import { GraduationCap, BookOpen, School, Calendar, type LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import type { Education } from '@/lib/cv-types';
import { formatDateRange } from '@/lib/cv-data';

/**
 * Resolve a friendly degree-type label and icon for an education entry.
 * The CV JSON uses `degree` for formal degrees (B.Sc., M.Sc., etc.) and
 * `program` for short courses / certificates. We classify by the value
 * shape, not by a new field, so the source data stays unchanged.
 */
function classifyEducation(entry: Education): {
  kind: 'degree' | 'program' | 'other';
  Icon: LucideIcon;
  eyebrow: string;
} {
  if (entry.degree) {
    return { kind: 'degree', Icon: GraduationCap, eyebrow: "Bachelor's degree" };
  }
  if (entry.program) {
    return { kind: 'program', Icon: BookOpen, eyebrow: 'Certificate program' };
  }
  return { kind: 'other', Icon: GraduationCap, eyebrow: 'Education' };
}

interface EducationCardProps {
  education: Education;
}

/**
 * One education entry, rendered as a timeline card. The vertical rail is
 * drawn by `EducationSection`; this card renders the dot + date column +
 * card body. Mirrors the editorial style of `ExperienceCard` so the two
 * timeline sections read as a single visual rhythm.
 */
export function EducationCard({ education }: EducationCardProps) {
  const { institution, degree, program, field_of_study, start_date, end_date } = education;
  const label = degree ?? program;
  const hasDateRange = !!(start_date && end_date);
  const dateRange = hasDateRange ? formatDateRange(start_date!, end_date!) : null;
  const { Icon, eyebrow } = classifyEducation(education);

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
          'bg-slate-300 dark:bg-slate-700',
        )}
      />

      {/* Date rail (desktop only) */}
      {hasDateRange ? (
        <div className="hidden md:block">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-300">
            {start_date}
          </p>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            {end_date}
          </p>
        </div>
      ) : (
        <div className="hidden md:block" />
      )}

      {/* Content column */}
      <div>
        {/* Mobile-only date pill */}
        {dateRange && (
          <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 md:hidden dark:text-slate-400">
            <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
            <span>{dateRange}</span>
          </p>
        )}

        {/* Eyebrow — degree type with icon */}
        <p className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent-600 dark:text-accent-400">
          <Icon aria-hidden="true" className="h-3.5 w-3.5" />
          {eyebrow}
        </p>

        {/* Degree / program name */}
        {label && (
          <h3 className="mt-2 font-heading text-xl font-semibold leading-snug text-slate-900 sm:text-2xl dark:text-slate-100">
            {label}
          </h3>
        )}

        {/* Field of study */}
        {field_of_study && (
          <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {field_of_study}
          </p>
        )}

        {/* Institution */}
        {institution && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <School aria-hidden="true" className="h-3.5 w-3.5 text-slate-500 dark:text-slate-500" />
            <span>{institution}</span>
          </p>
        )}
      </div>
    </article>
  );
}
