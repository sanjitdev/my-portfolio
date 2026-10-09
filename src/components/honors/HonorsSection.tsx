import { Trophy } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';

interface HonorsSectionProps {
  awards: string[];
}

/**
 * Honors & Awards section — vertical list with Trophy icons. Hidden entirely
 * when the awards list is empty.
 */
export function HonorsSection({ awards }: HonorsSectionProps) {
  if (awards.length === 0) {
    return null;
  }

  return (
    <Section id="honors" ariaLabelledBy="honors-heading">
      <Container>
        <SectionEyebrow>07 — Honors &amp; Awards</SectionEyebrow>
        <Heading as="h2" id="honors-heading">
          Honors &amp; Awards
        </Heading>
        <ul className="grid gap-3 sm:grid-cols-2">
          {awards.map(award => (
            <li
              key={award}
              data-print="card"
              className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                <Trophy aria-hidden="true" className="h-5 w-5" />
              </span>
              <span>{award}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
