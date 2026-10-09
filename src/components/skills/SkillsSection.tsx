import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';
import {
  getSkillProfile,
  computeYearsOfUse,
  TECHNICAL_SKILLS,
  TOP_SKILLS,
} from '@/lib/skill-profile';
import type { CvData } from '@/lib/cv-types';
import { SkillsSectionClient, type SkillsViewModel } from './SkillsSectionClient';

/**
 * Server component — does the years-of-use computation against the CV
 * (which must never be sent to the client because of the address privacy
 * invariant) and hands the client component only a plain view model.
 *
 * Splitting this way keeps the `cv` prop server-side. The client subtree
 * only sees pre-computed year numbers and the static skill manifest —
 * no contact data, no address, no personal_information object.
 */
export function SkillsSection({ cv }: { cv: CvData }) {
  const profile = getSkillProfile();

  // Pre-compute years of use per technical category (server-side, build time).
  const categoryYears: Record<string, number | null> = {};
  for (const cat of profile.technical) {
    categoryYears[cat.label] = computeYearsOfUse(cv, cat.yearsAnchor);
  }
  const professionalYears = computeYearsOfUse(cv, { kind: 'all' });

  // Build the headline row data (top N skills, with proficiency) for the client.
  const headline = TOP_SKILLS.flatMap(name => {
    for (const list of Object.values(TECHNICAL_SKILLS)) {
      const found = list.find(s => s.name === name);
      if (found) return [{ name: found.name, proficiency: found.proficiency }];
    }
    return [];
  });

  // Flatten technical categories into plain-data rows (icon names are strings
  // resolved on the client by SkillsSectionClient).
  const technical = profile.technical.map(cat => ({
    label: cat.label,
    iconName: cat.label, // resolve via map on the client
    years: categoryYears[cat.label] ?? null,
  }));

  const vm: SkillsViewModel = {
    headline,
    technical,
    professional: profile.professional.map(p => ({
      name: p.name,
      iconKey: p.name, // resolve via map on the client
      context: p.context,
    })),
    professionalYears,
  };

  return (
    <Section id="skills" ariaLabelledBy="skills-heading">
      <Container>
        <SectionEyebrow>03 — Skills</SectionEyebrow>
        <Heading as="h2" id="skills-heading">
          Skills
        </Heading>

        {professionalYears !== null && professionalYears > 0 && (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-600 dark:text-accent-400">
            · {professionalYears}+ years professional experience
          </p>
        )}

        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          A snapshot of the stack I ship with and how I work. Scan the headline, or open the
          breakdown for the full picture.
        </p>

        <SkillsSectionClient vm={vm} />
      </Container>
    </Section>
  );
}

// Re-export for tests that import the type.
export type { SkillsViewModel } from './SkillsSectionClient';
