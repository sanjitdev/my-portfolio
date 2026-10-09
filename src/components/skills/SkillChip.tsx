import { clsx } from 'clsx';
import type { Proficiency } from '@/lib/skill-profile';

interface SkillChipProps {
  name: string;
  proficiency: Proficiency;
}

/**
 * Skill chip — minimal, name-first pill. The proficiency is shown as a
 * short uppercase text label (Expert / Proficient / Working) so the chip
 * stays scannable without dots or numbers.
 *
 * Years-of-use is intentionally NOT shown on individual chips — it lives
 * at the section level (subtitle) to keep the chip quiet.
 */
export function SkillChip({ name, proficiency }: SkillChipProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-baseline gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
        'bg-slate-100 text-slate-700',
        'dark:bg-slate-800 dark:text-slate-300',
      )}
    >
      <span>{name}</span>
      <span
        className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
        aria-label={proficiencyAriaLabel(proficiency)}
      >
        · {proficiency}
      </span>
    </span>
  );
}

function proficiencyAriaLabel(p: Proficiency): string {
  switch (p) {
    case 'expert':
      return 'Expert — production-grade primary skill';
    case 'proficient':
      return 'Proficient — used in production';
    case 'working':
      return 'Working knowledge — applied in projects';
  }
}
