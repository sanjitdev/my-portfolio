import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';

interface AboutSectionProps {
  summary: string;
}

/**
 * Profile section — renders the candidate's professional summary as a
 * single editorial block. The first sentence is lifted out as a pull-quote
 * (larger, italic Playfair, accented left border, decorative opening
 * quote glyph) so the section reads as a magazine spread, not a
 * single-page CV. The remainder of the summary follows as body prose.
 *
 * The section id is kept as `about` so the TopNav scroll-spy continues
 * to resolve — only the visible label has been renamed to "Profile".
 */
export function AboutSection({ summary }: AboutSectionProps) {
  // Split on the first period so the first sentence can be styled as a
  // pull-quote, while the rest remains prose.
  const [first, ...rest] = summary.split(/(?<=\.)\s+/);
  const lead = first ?? summary;
  const body = rest.join(' ');

  return (
    <Section id="about" ariaLabelledBy="profile-heading" divided>
      <Container>
        <SectionEyebrow>Profile</SectionEyebrow>
        <Heading as="h2" id="profile-heading">
          Profile
        </Heading>

        {summary ? (
          <div className="mt-2 max-w-3xl">
            {/* Pull-quote: first sentence, large Playfair, accent left rule,
                decorative opening quote glyph. */}
            <figure className="relative border-l-2 border-accent-500 pl-6 sm:pl-8">
              <span
                aria-hidden="true"
                className="absolute -left-1 -top-3 select-none font-heading text-6xl leading-none text-accent-500/40 sm:-left-2 sm:-top-4 sm:text-7xl"
              >
                &ldquo;
              </span>
              <blockquote className="text-pretty font-heading text-2xl italic leading-snug text-slate-900 sm:text-3xl dark:text-slate-100">
                {lead}
              </blockquote>
            </figure>

            {/* Body prose: the rest of the summary. */}
            {body && (
              <p className="mt-6 text-pretty text-[1.05rem] leading-relaxed text-slate-600 dark:text-slate-400">
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
