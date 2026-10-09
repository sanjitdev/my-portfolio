import { Trophy } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';

interface HonorsSectionProps {
  awards: string[];
}

/**
 * Parse a 4-digit year (19xx–20xx) from the award string. Returns the
 * year as a string, or `null` if none is present.
 *
 * Examples:
 *   "Best Performer 2022" → "2022"
 *   "Best Desktop Application" → null
 */
function parseYear(award: string): string | null {
  const match = /\b(19|20)\d{2}\b/.exec(award);
  return match ? match[0] : null;
}

/**
 * Parse the issuer from the award string. Looks for text after a
 * separator (em-dash `—`, en-dash `–`, or hyphen `-`) and trims it.
 *
 * Examples:
 *   "Best Performer 2022 — Brain Station 23" → "Brain Station 23"
 *   "Spot Award — Client Delivery Excellence" → "Client Delivery Excellence"
 *   "Best Desktop Application" → null
 */
function parseIssuer(award: string): string | null {
  // Try em-dash first, then en-dash, then hyphen.
  const match = /\s*[—–-]\s*(.+)$/.exec(award);
  return match ? match[1]!.trim() : null;
}

/**
 * Strip the parsed parts (year and issuer) from the award string so we
 * can render the award name cleanly as the h3.
 */
function awardName(award: string): string {
  // Drop the issuer (everything from the separator onwards).
  let name = award.replace(/\s*[—–-]\s*.+$/, '');
  // Drop a trailing 4-digit year.
  name = name.replace(/\s+\b(19|20)\d{2}\b\s*$/, '');
  return name.trim() || award;
}

/**
 * Honors & Awards section — editorial list of full-width rows. Each row
 * shows a trophy icon, the award name (h3, font-heading), the issuer as
 * a small caption, and the year as a mono-caps tag on the right.
 *
 * Hidden entirely when the awards list is empty so the nav scroll-spy
 * does not target a phantom section.
 */
export function HonorsSection({ awards }: HonorsSectionProps) {
  if (awards.length === 0) {
    return null;
  }

  return (
    <Section id="honors" ariaLabelledBy="honors-heading">
      <Container>
        <SectionEyebrow>Honors &amp; Awards</SectionEyebrow>
        <Heading as="h2" id="honors-heading">
          Honors &amp; Awards
        </Heading>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          Recognition for shipped work.
        </p>

        <ul className="mt-10 divide-y divide-slate-200 border-t border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {awards.map(award => {
            const year = parseYear(award);
            const issuer = parseIssuer(award);
            const name = awardName(award);
            return (
              <li
                key={award}
                data-print="card"
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 sm:gap-6 sm:py-6"
              >
                {/* Trophy icon */}
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400"
                >
                  <Trophy className="h-5 w-5" />
                </span>

                {/* Name + issuer */}
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 sm:text-xl dark:text-slate-100">
                    {name}
                  </h3>
                  {issuer ? (
                    <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{issuer}</p>
                  ) : (
                    <p className="mt-0.5 text-sm italic text-slate-500 dark:text-slate-500">
                      Internal recognition
                    </p>
                  )}
                </div>

                {/* Year tag — only when we could parse one */}
                {year ? (
                  <span className="inline-flex shrink-0 items-center rounded-full bg-accent-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">
                    {year}
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
