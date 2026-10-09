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
 * Infer a CEFR level (A1–C2) from a proficiency string. Returns `null`
 * when no level can be confidently inferred — the badge is then omitted
 * in the rendered output.
 *
 * Two strategies, applied in order:
 *   1. If the string contains a CEFR code (A1/A2/B1/B2/C1/C2), use it.
 *   2. Otherwise, infer from the proficiency keywords (Native → C2,
 *      Professional → B2, etc.). See the table in the section's plan.
 */
function parseCEFR(proficiency: string): string | null {
  // 1. Look for an explicit CEFR code first (highest signal).
  const cefrMatch = /\b([abc][12])\b/i.exec(proficiency);
  if (cefrMatch) {
    return cefrMatch[1]!.toUpperCase();
  }

  // 2. Look for a JLPT level (Japanese Language Proficiency Test).
  //    Scale: N5 (easiest) → N1 (hardest). The user can be "close to N4"
  //    without being certified — we still show the N4 badge as a target.
  const jlptMatch = /\b(n[1-5])\b/i.exec(proficiency);
  if (jlptMatch) {
    return jlptMatch[1]!.toUpperCase();
  }

  // 3. Otherwise infer from the proficiency keyword.
  const p = proficiency.toLowerCase();
  if (p.includes('native') || p.includes('bilingual') || p.includes('fluent')) return 'C2';
  if (p.includes('advanced') || p.includes('proficient')) return 'C1';
  if (p.includes('professional') || p.includes('working')) return 'B2';
  if (p.includes('upper')) return 'B2';
  if (p.includes('intermediate')) return 'B1';
  if (p.includes('conversational')) return 'A2';
  if (p.includes('basic')) return 'A1';
  if (p.includes('elementary')) return 'A1';
  return null;
}

/**
 * Map a language name to a country flag emoji. The list is intentionally
 * short — we only carry flags for languages the user is known to speak.
 * Add a new entry here when the user picks up a new language. Unknown
 * languages fall back to a globe emoji (🌐).
 */
const FLAGS: Record<string, string> = {
  Bengali: '🇧🇩',
  English: '🇬🇧',
  Hindi: '🇮🇳',
  Japanese: '🇯🇵',
};

function flagForLanguage(language: string): string {
  return FLAGS[language] ?? '🌐';
}

/**
 * Languages section — single-column editorial list. Each row shows the
 * flag, language name, proficiency text, a 5-dot bar, and a CEFR badge
 * (e.g. C2 / B2 / A1) inferred from the proficiency string.
 *
 * Hidden entirely when the list is empty so the nav scroll-spy does not
 * target a phantom section.
 */
export function LanguagesSection({ languages }: LanguagesSectionProps) {
  if (languages.length === 0) {
    return null;
  }

  return (
    <Section id="languages" ariaLabelledBy="languages-heading">
      <Container>
        <SectionEyebrow>Languages</SectionEyebrow>
        <Heading as="h2" id="languages-heading">
          Languages
        </Heading>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          Working and conversational fluency.
        </p>

        <ul className="mt-10 divide-y divide-slate-200 border-t border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {languages.map(({ language, proficiency }) => {
            const dots = proficiencyToDots(proficiency);
            const cefr = parseCEFR(proficiency);
            const flag = flagForLanguage(language);
            return (
              <li
                key={language}
                data-print="card"
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 sm:gap-6 sm:py-6"
              >
                {/* Flag */}
                <span
                  aria-hidden="true"
                  role="img"
                  aria-label={`${language} flag`}
                  className="text-2xl sm:text-3xl"
                >
                  {flag}
                </span>

                {/* Name + proficiency text + dot bar */}
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 sm:text-xl dark:text-slate-100">
                    {language}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{proficiency}</p>
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
                            ? 'h-1 flex-1 rounded-full bg-accent-500'
                            : 'h-1 flex-1 rounded-full bg-slate-200 dark:bg-slate-800'
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* CEFR badge — only when we could infer one */}
                {cefr ? (
                  <span className="inline-flex shrink-0 items-center rounded-full bg-accent-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">
                    {cefr}
                  </span>
                ) : (
                  <span aria-hidden="true" className="w-12 shrink-0 sm:w-14" />
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
