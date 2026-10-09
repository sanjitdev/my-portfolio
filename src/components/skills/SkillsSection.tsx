import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';
import {
  getSkillProfile,
  computeYearsOfUse,
  TECHNICAL_SKILLS,
  type TechnicalCategory,
  type TechnicalCategoryDef,
} from '@/lib/skill-profile';
import type { CvData } from '@/lib/cv-types';
import { SkillChip } from './SkillChip';
import { HowIWorkCard } from './HowIWorkCard';

interface SkillsSectionProps {
  cv: CvData;
}

/**
 * Skills section — two-zone layout.
 *
 *   Zone 1: "Technical Stack" — 7 category cards, each with SkillChips
 *           (proficiency dot + name + years-of-use hint).
 *   Zone 2: "How I Work"       — 6 professional-skill cards with lucide
 *           icons and 1-line context, anchored to career length.
 *
 * The section id stays "skills" so the TopNav scroll-spy keeps working.
 * Data is sourced from `src/lib/skill-profile.ts` (curated manifest), not
 * from `cv.top_skills` (which LinkedIn auto-suggests as weak soft labels).
 */
export function SkillsSection({ cv }: SkillsSectionProps) {
  const profile = getSkillProfile();

  // Pre-compute years of use per technical category once at render time
  // (this is a server component — runs at build, cached).
  const categoryYears = new Map<string, number | null>();
  for (const cat of profile.technical) {
    categoryYears.set(cat.label, computeYearsOfUse(cv, cat.yearsAnchor));
  }
  const professionalYears = computeYearsOfUse(cv, { kind: 'all' });

  const totalTechnical = Object.values(TECHNICAL_SKILLS).reduce((n, list) => n + list.length, 0);

  if (totalTechnical === 0) {
    return (
      <Section id="skills" ariaLabelledBy="skills-heading">
        <Container>
          <SectionEyebrow>03 — Skills</SectionEyebrow>
          <Heading as="h2" id="skills-heading">
            Skills
          </Heading>
          <p className="text-slate-500 italic dark:text-slate-400">No skills listed.</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="skills" ariaLabelledBy="skills-heading">
      <Container>
        <SectionEyebrow>03 — Skills</SectionEyebrow>
        <Heading as="h2" id="skills-heading">
          Skills
        </Heading>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          A snapshot of the stack I ship with and how I work. The numbers are years of use, derived
          from the experience timeline above.
        </p>

        {/* Zone 1: Technical Stack */}
        <div className="mt-10">
          <h3 className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Technical Stack · {totalTechnical} skills
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {profile.technical.map(cat => (
              <CategoryCard
                key={cat.label}
                category={cat}
                years={categoryYears.get(cat.label) ?? null}
              />
            ))}
          </div>
        </div>

        {/* Zone 2: How I Work */}
        <div className="mt-14">
          <h3 className="mb-5 flex items-baseline gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            <span>How I Work</span>
            {professionalYears !== null && professionalYears > 0 && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                · {professionalYears}+ years
              </span>
            )}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.professional.map(skill => (
              <HowIWorkCard key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function CategoryCard({
  category,
  years,
}: {
  category: TechnicalCategoryDef;
  years: number | null;
}) {
  const Icon = category.icon;
  const skills = TECHNICAL_SKILLS[category.label as TechnicalCategory] ?? [];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <Icon aria-hidden="true" className="h-4 w-4 text-accent-500" />
          {category.label}
        </h4>
        {years !== null && years > 0 && (
          <span
            className="font-mono text-[10px] tracking-wide text-slate-500 dark:text-slate-400"
            aria-label={`${years} year${years === 1 ? '' : 's'} of use`}
          >
            {years}y
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <SkillChip
            key={skill.name}
            name={skill.name}
            proficiency={skill.proficiency}
            years={years}
          />
        ))}
      </div>
    </div>
  );
}
