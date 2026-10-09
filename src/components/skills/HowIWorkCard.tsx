import type { ProfessionalSkill } from '@/lib/skill-profile';

interface HowIWorkCardProps {
  skill: ProfessionalSkill;
}

/**
 * One "How I Work" card — a professional skill rendered as an icon + name
 * + 1-line context. Used in the second zone of the Skills section, which
 * distinguishes the human signals recruiters screen for from the technical
 * stack.
 */
export function HowIWorkCard({ skill }: HowIWorkCardProps) {
  const Icon = skill.icon;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400"
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{skill.name}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {skill.context}
        </p>
      </div>
    </div>
  );
}
