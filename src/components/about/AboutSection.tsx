import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';

interface AboutSectionProps {
  summary: string;
}

/**
 * About section — renders the candidate's professional summary as a single
 * readable paragraph. Max width is capped to ~75 characters for optimal
 * readability (per typography guidelines).
 */
export function AboutSection({ summary }: AboutSectionProps) {
  return (
    <Section id="about" ariaLabelledBy="about-heading">
      <Container>
        <Heading as="h2" id="about-heading">
          About
        </Heading>
        {summary ? (
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 max-w-3xl">
            {summary}
          </p>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 italic">Summary not provided.</p>
        )}
      </Container>
    </Section>
  );
}
