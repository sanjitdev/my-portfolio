import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';

/**
 * Loading skeleton for `/leetcode`.
 *
 * Renders while the server-side fetcher is fetching on the first request
 * (before the ISR cache is warm). Once the page is cached, this skeleton
 * is not shown.
 */
export default function LeetCodeLoading() {
  return (
    <main>
      <Section
        id="leetcode-top"
        ariaLabelledBy="leetcode-loading-heading"
        divided
        className="relative overflow-hidden"
      >
        <Container className="relative max-w-[1100px]">
          <div className="mb-4 h-3 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div
            id="leetcode-loading-heading"
            className="mb-4 h-12 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800"
          />
          <div className="mb-8 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

          {/* 4 KPI placeholders */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>

          {/* 3 chart placeholders */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}