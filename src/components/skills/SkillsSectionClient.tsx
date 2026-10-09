'use client';

import { useId, useState } from 'react';
import {
  ChevronDown,
  Cpu,
  Server,
  MonitorSmartphone,
  Database,
  Smartphone,
  Cloud,
  GitBranch,
  Users,
  Globe2,
  MessagesSquare,
  Boxes,
  ListChecks,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { clsx } from 'clsx';
import { TECHNICAL_SKILLS, type TechnicalCategory, type Proficiency } from '@/lib/skill-profile';
import { SkillChip } from './SkillChip';

/**
 * Plain-data view model passed from the server `SkillsSection`. Crucially
 * this contains NO contact / personal_information fields — the address
 * privacy invariant is preserved because `cv` never crosses the
 * server/client boundary.
 */
export interface SkillsViewModel {
  headline: ReadonlyArray<{ name: string; proficiency: Proficiency }>;
  technical: ReadonlyArray<{ label: TechnicalCategory; iconName: string; years: number | null }>;
  professional: ReadonlyArray<{ name: string; iconKey: string; context: string }>;
  professionalYears: number | null;
}

interface SkillsSectionClientProps {
  vm: SkillsViewModel;
}

/**
 * Resolve an icon component for a technical-category label. Categories and
 * their icons are a static mapping from `skill-profile.ts`; we duplicate
 * the keys here (only the names, not the components) so the server can
 * pass plain strings.
 */
const TECHNICAL_ICON_MAP: Record<TechnicalCategory, LucideIcon> = {
  'Languages & Runtimes': Cpu,
  'Backend & APIs': Server,
  Frontend: MonitorSmartphone,
  'Databases & Data': Database,
  Mobile: Smartphone,
  'Cloud & DevOps': Cloud,
  'Architecture & Practices': GitBranch,
};

const PROFESSIONAL_ICON_MAP: Record<string, LucideIcon> = {
  'Mentoring & code review': Users,
  'Async collaboration': MessagesSquare,
  'Stakeholder communication': Globe2,
  'System design': Boxes,
  'Project leadership': ListChecks,
  'Remote-first work': Wifi,
};

/**
 * Client subtree of the Skills section. Owns the toggle state for
 * progressive disclosure. Receives only the pre-computed view model — see
 * the privacy note on `SkillsViewModel`.
 */
export function SkillsSectionClient({ vm }: SkillsSectionClientProps) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();

  const totalTechnical = Object.values(TECHNICAL_SKILLS).reduce((n, list) => n + list.length, 0);

  if (totalTechnical === 0) {
    return <p className="mt-8 text-slate-500 italic dark:text-slate-400">No skills listed.</p>;
  }

  return (
    <>
      {/* Headline row — always visible. The first thing a recruiter sees. */}
      <div className="mt-8 flex flex-wrap gap-2">
        {vm.headline.map(chip => (
          <SkillChip key={chip.name} name={chip.name} proficiency={chip.proficiency} />
        ))}
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        aria-controls={detailsId}
        className={clsx(
          'mt-6 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium',
          'border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900',
          'dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
          'print-hidden',
        )}
      >
        {expanded ? 'Hide full breakdown' : 'Show full breakdown'}
        <ChevronDown
          aria-hidden="true"
          className={clsx(
            'h-3.5 w-3.5 transition-transform duration-200',
            expanded && 'rotate-180',
          )}
        />
      </button>

      {/* Collapsible full breakdown */}
      <div
        id={detailsId}
        className={clsx(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          expanded ? 'mt-10 grid-rows-[1fr]' : 'grid-rows-[0fr]',
          'print:grid-rows-[1fr] print:mt-10',
        )}
      >
        <div className="overflow-hidden">
          {/* Technical Stack grid */}
          <div>
            <h3 className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Technical Stack · {totalTechnical} skills
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {vm.technical.map(row => {
                const Icon = TECHNICAL_ICON_MAP[row.label];
                const skills = TECHNICAL_SKILLS[row.label] ?? [];
                return (
                  <div
                    key={row.label}
                    className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {Icon ? (
                          <Icon aria-hidden="true" className="h-4 w-4 text-accent-500" />
                        ) : null}
                        {row.label}
                      </h4>
                      {row.years !== null && row.years > 0 && (
                        <span
                          className="font-mono text-[10px] tracking-wide text-slate-500 dark:text-slate-400"
                          aria-label={`${row.years} year${row.years === 1 ? '' : 's'} of use`}
                        >
                          {row.years}y
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <SkillChip
                          key={skill.name}
                          name={skill.name}
                          proficiency={skill.proficiency}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How I Work grid */}
          <div className="mt-14">
            <h3 className="mb-5 flex items-baseline gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              <span>How I Work</span>
              {vm.professionalYears !== null && vm.professionalYears > 0 && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  · {vm.professionalYears}+ years
                </span>
              )}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {vm.professional.map(p => {
                const Icon = PROFESSIONAL_ICON_MAP[p.iconKey];
                return (
                  <div
                    key={p.name}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400"
                    >
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {p.context}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
