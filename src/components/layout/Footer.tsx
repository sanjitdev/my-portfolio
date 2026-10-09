import { Container } from '@/components/shared/Container';

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
    <footer className="mt-16 border-t border-slate-200 py-8 dark:border-slate-800">
      <Container>
        <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:justify-between sm:items-center dark:text-slate-400">
          <p>
            © {year} {name}
          </p>
          <p>Last updated: {formatted}</p>
        </div>
      </Container>
    </footer>
  );
}
