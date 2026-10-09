import { Sparkles } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';
import { groupCertifications, type CertificationEntry } from '@/lib/certification-profile';

interface CertificationsSectionProps {
  certifications: string[];
}

/**
 * Certifications section — grouped by category (Technical / Language /
 * Leadership / Training) with per-card metadata. Recruiter signal is
 * surfaced by the "Stack-relevant" pill on the NopCommerce cert and by
 * the score on the EF SET one.
 *
 * Hidden entirely when no certs are in scope, so the nav scroll-spy
 * never targets a phantom section.
 */
export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const groups = groupCertifications(certifications);
  const totalCount = groups.reduce((n, g) => n + g.entries.length, 0);

  if (totalCount === 0) {
    return null;
  }

  return (
    <Section id="certifications" ariaLabelledBy="certifications-heading">
      <Container>
        <SectionEyebrow>What I've earned</SectionEyebrow>
        <Heading as="h2" id="certifications-heading">
          Certifications
        </Heading>

        <div className="mt-10 space-y-10">
          {groups.map(group => (
            <div key={group.category}>
              {/* Category eyebrow */}
              <h3 className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <group.icon aria-hidden="true" className="h-3.5 w-3.5 text-accent-500" />
                {group.category}
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                  ·
                </span>
                <span className="text-slate-400 dark:text-slate-500">{group.entries.length}</span>
              </h3>

              {/* Cards */}
              <ul className="grid gap-3 sm:grid-cols-2">
                {group.entries.map(entry => (
                  <CertificationCard key={entry.name} entry={entry} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function CertificationCard({ entry }: { entry: CertificationEntry }) {
  const Icon = entry.icon;

  return (
    <li
      data-print="card"
      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium leading-snug text-slate-700 dark:text-slate-300">
          <span>{entry.name}</span>
          {entry.stackRelevant && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">
              <Sparkles aria-hidden="true" className="h-2.5 w-2.5" />
              Stack-relevant
            </span>
          )}
        </p>

        {entry.signal && (
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
            {entry.signal}
          </p>
        )}
      </div>
    </li>
  );
}
