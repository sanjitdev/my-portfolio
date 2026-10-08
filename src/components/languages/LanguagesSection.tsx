import { Languages } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import type { Language } from '@/lib/cv-types';

interface LanguagesSectionProps {
  languages: Language[];
}

/**
 * Languages section — 2-column grid on desktop, single column on mobile.
 * Each row pairs the language name with its proficiency level.
 * Hidden entirely when the list is empty.
 */
export function LanguagesSection({ languages }: LanguagesSectionProps) {
  if (languages.length === 0) {
    return null;
  }

  return (
    <Section id="languages" ariaLabelledBy="languages-heading">
      <Container>
        <div className="mb-8 flex items-center gap-3">
          <Languages aria-hidden="true" className="h-6 w-6 text-accent-600 dark:text-accent-400" />
          <Heading as="h2" id="languages-heading" className="mb-0">
            Languages
          </Heading>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {languages.map(({ language, proficiency }) => (
            <li
              key={language}
              className="flex items-baseline justify-between gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="font-medium text-slate-900 dark:text-slate-100">{language}</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">— {proficiency}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
