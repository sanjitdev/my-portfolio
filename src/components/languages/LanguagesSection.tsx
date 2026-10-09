import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';
import type { Language } from '@/lib/cv-types';

interface LanguagesSectionProps {
  languages: Language[];
}

/**
 * Map proficiency text to a 1-5 dot rating. Recognized values:
 *   "Native" → 5, "Fluent" → 5, "Advanced" → 4, "Professional" → 4,
 *   "Upper Intermediate" → 3, "Intermediate" → 3, "Conversational" → 2,
 *   "Basic" → 2, "Elementary" → 1. Unknown → 3.
 */
function proficiencyToDots(proficiency: string): number {
  const p = proficiency.toLowerCase();
  if (p.includes('native') || p.includes('fluent') || p.includes('c2')) return 5;
  if (p.includes('advanced') || p.includes('professional') || p.includes('c1')) return 4;
  if (p.includes('upper') || p.includes('intermediate') || p.includes('b2') || p.includes('b1'))
    return 3;
  if (p.includes('conversational') || p.includes('basic') || p.includes('a2')) return 2;
  if (p.includes('elementary') || p.includes('a1')) return 1;
  return 3;
}

/**
 * Languages section — 2-column grid on desktop, single column on mobile.
 * Each row pairs the language name with a 5-dot proficiency indicator.
 * Hidden entirely when the list is empty.
 */
export function LanguagesSection({ languages }: LanguagesSectionProps) {
  if (languages.length === 0) {
    return null;
  }

  return (
    <Section id="languages" ariaLabelledBy="languages-heading">
      <Container>
        <SectionEyebrow>06 — Languages</SectionEyebrow>
        <Heading as="h2" id="languages-heading">
          Languages
        </Heading>
        <ul className="grid gap-4 sm:grid-cols-2">
          {languages.map(({ language, proficiency }) => {
            const dots = proficiencyToDots(proficiency);
            return (
              <li
                key={language}
                data-print="card"
                className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {language}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{proficiency}</span>
                </div>
                <div
                  className="mt-3 flex gap-1.5"
                  role="img"
                  aria-label={`Proficiency: ${dots} of 5`}
                >
                  {[1, 2, 3, 4, 5].map(i => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className={
                        i <= dots
                          ? 'h-1.5 flex-1 rounded-full bg-accent-500'
                          : 'h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-800'
                      }
                    />
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
