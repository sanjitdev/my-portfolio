import { Trophy } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';

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
        <Heading as="h2" id="honors-heading">
          Honors &amp; Awards
        </Heading>
        <ul className="space-y-3">
          {awards.map(award => (
            <li key={award} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Trophy
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600 dark:text-accent-400"
              />
              <span className="leading-relaxed">{award}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
