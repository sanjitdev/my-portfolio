import { Container } from '@/components/shared/Container';
import { Monogram } from '@/components/branding/Monogram';

interface FooterProps {
  name: string;
  lastUpdated: string;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });

/**
 * Footer with "Last updated" timestamp. The timestamp is captured at build
 * time (from `computeBuildTimestamp()` in `lib/cv-data.ts`) and passed in as
 * an ISO 8601 string. The human-readable date is formatted with
 * `Intl.DateTimeFormat` to respect the candidate's locale.
 */
export function Footer({ name, lastUpdated }: FooterProps) {
  const year = new Date(lastUpdated).getUTCFullYear();
  const formatted = dateFormatter.format(new Date(lastUpdated));
  return (
    <footer className="mt-16 border-t border-slate-200 py-8 print-hidden dark:border-slate-800">
      <Container>
        <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <Monogram size="sm" />
            <p>
              © {year}{' '}
              <span className="font-medium text-slate-700 dark:text-slate-300">{name}</span>
            </p>
          </div>
          <p>
            Last updated:{' '}
            <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
              {formatted}
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
