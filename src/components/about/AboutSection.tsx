import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';

interface AboutSectionProps {
  summary: string;
}

/**
 * About section — renders the candidate's professional summary as a single
 * readable paragraph, capped to ~75 characters for an editorial measure.
 * The first sentence is treated as a pull-quote (slightly larger, italic)
 * to draw readers in before the body text.
 */
export function AboutSection({ summary }: AboutSectionProps) {
  // Split on the first period so the first sentence can be styled as a
  // pull-quote, while the rest remains prose.
  const [first, ...rest] = summary.split(/(?<=\.)\s+/);
  const lead = first ?? summary;
  const body = rest.join(' ');

  return (
    <Section id="about" ariaLabelledBy="about-heading" divided>
      <Container>
        <SectionEyebrow>01 — About</SectionEyebrow>
        <Heading as="h2" id="about-heading">
          About
        </Heading>
        {summary ? (
          <div className="max-w-3xl">
            <p className="text-pretty text-xl font-heading italic leading-relaxed text-slate-700 dark:text-slate-300">
              {lead}
            </p>
            {body && (
              <p className="mt-5 text-pretty text-[1.05rem] leading-relaxed text-slate-600 dark:text-slate-400">
                {body}
              </p>
            )}
          </div>
        ) : (
          <p className="text-slate-500 italic dark:text-slate-400">Summary not provided.</p>
        )}
      </Container>
    </Section>
  );
}
