import { clsx } from 'clsx';
import type { Proficiency } from '@/lib/skill-profile';

interface SkillChipProps {
  name: string;
  proficiency: Proficiency;
  /** Years of use. `null` means "no anchor matched" — UI renders no hint. */
  years: number | null;
}

/**
 * Skill chip — a Tag-style pill with a proficiency dot and (optionally) a
 * monospace years-of-use hint. Used in the Technical Stack grid of the
 * Skills section.
 *
 * Visual signals layered onto each chip (recruiter-focused):
 *  - Proficiency dot (filled / half-tone / outlined) → depth at a glance.
 *  - Years hint (`· 7y`) → concrete experience, not just a label.
 */
export function SkillChip({ name, proficiency, years }: SkillChipProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
        'bg-slate-100 text-slate-700',
        'dark:bg-slate-800 dark:text-slate-300',
      )}
    >
      <ProficiencyDot level={proficiency} />
      <span>{name}</span>
      {years !== null && years > 0 && (
        <span
          className="font-mono text-[10px] tracking-wide text-slate-500 dark:text-slate-400"
          aria-label={`${years} year${years === 1 ? '' : 's'} of use`}
        >
          · {years}y
        </span>
      )}
    </span>
  );
}

function ProficiencyDot({ level }: { level: Proficiency }) {
  return (
    <span
      aria-hidden="true"
      title={level}
      className={clsx(
        'inline-block h-1.5 w-1.5 rounded-full',
        level === 'expert' && 'bg-accent-500',
        level === 'proficient' && 'bg-accent-300',
        level === 'working' && 'border border-slate-400 dark:border-slate-500',
      )}
    />
  );
}
