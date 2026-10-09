import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';
import type { Recommendation } from '@/lib/cv-types';

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
}

/**
 * Build the initials fallback for the recommender avatar tile. Takes the
 * first letter of each whitespace-separated token, up to 2 letters.
 *
 * Examples:
 *   "Utpaul Sarkar" → "US"
 *   "Cher"          → "C"
 *   "Mary Anne"     → "MA"
 */
function initialsFor(name: string): string {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  const firsts = tokens.slice(0, 2).map(t => t.charAt(0).toUpperCase());
  return firsts.join('') || '?';
}

/**
 * Recommendations section — a single hero-style quote card filling the
 * section. Designed to read as a magazine pull-quote: large Playfair
 * italic body, decorative opening-quote glyph, accent left rule, and a
 * recommender block at the bottom (initials avatar, name, relationship,
 * date, optional stack tags).
 *
 * Renders nothing when the list is empty so the nav scroll-spy never
 * targets a phantom section.
 */
export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  if (recommendations.length === 0) {
    return null;
  }

  // For now we render the first recommendation as the hero quote. The
  // schema accepts multiple so a future update can switch to a list
  // without changing the data shape.
  const rec = recommendations[0]!;

  return (
    <Section id="recommendations" ariaLabelledBy="recommendations-heading">
      <Container>
        <SectionEyebrow>What colleagues say</SectionEyebrow>
        <Heading as="h2" id="recommendations-heading">
          Recommendations
        </Heading>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          What it's like to ship alongside me.
        </p>

        <figure className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30">
          <div className="relative px-6 py-10 sm:px-10 sm:py-12">
            {/* Decorative opening quote glyph, anchored to the top-left. */}
            <span
              aria-hidden="true"
              className="absolute top-2 left-4 select-none font-heading text-7xl leading-none text-accent-500/30 sm:left-6 sm:text-8xl"
            >
              &ldquo;
            </span>

            {/* Body — large Playfair italic, one paragraph per array entry. */}
            <blockquote className="relative mt-2 text-pretty font-heading text-xl leading-snug text-slate-900 sm:text-2xl dark:text-slate-100">
              {rec.body.map((paragraph, idx) => (
                <p key={idx} className={idx > 0 ? 'mt-5' : ''}>
                  {paragraph}
                </p>
              ))}
            </blockquote>

            {/* Divider rule before the recommender block. */}
            <hr
              aria-hidden="true"
              className="mt-8 border-t border-slate-200 dark:border-slate-700"
            />

            {/* Recommender block: avatar tile + name + relationship + date. */}
            <figcaption className="mt-6 flex flex-wrap items-center gap-4">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-600 font-mono text-sm font-semibold text-white"
              >
                {initialsFor(rec.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-base font-semibold text-slate-900 dark:text-slate-100">
                  {rec.name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{rec.relationship}</p>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
                  {rec.date}
                </p>
              </div>
              {rec.stack ? (
                <p className="max-w-xs text-right font-mono text-[11px] uppercase tracking-wider text-accent-700 dark:text-accent-300 sm:text-left">
                  {rec.stack}
                </p>
              ) : null}
            </figcaption>
          </div>
        </figure>
      </Container>
    </Section>
  );
}
