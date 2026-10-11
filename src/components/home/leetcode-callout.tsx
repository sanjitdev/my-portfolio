import { ArrowRight, Code2 } from 'lucide-react';
import { Card } from '@/components/shared/Card';
import { formatNumber, formatDistanceToNow } from '@/lib/leetcode/format';
import type { LeetCodeFetchResult } from '@/lib/leetcode/types';

interface LeetCodeCalloutProps {
  data: LeetCodeFetchResult;
}

/**
 * Home-page teaser card linking to `/leetcode`.
 *
 * Renders inline on the home page between Skills and Education. Shows a
 * single headline number (total problems solved) + a link to the full
 * stats page. Hides the number gracefully if the fetcher failed (no zero,
 * no error).
 */
export function LeetCodeCallout({ data }: LeetCodeCalloutProps) {
  const { profile, isStale, fetchedAt } = data;
  const hasNumber = profile.totalSolved > 0;

  return (
    <Card className="relative overflow-hidden border-accent-200 dark:border-accent-900/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent-200/40 blur-3xl dark:bg-accent-800/30"
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent-600 dark:text-accent-400">
            <Code2 aria-hidden="true" className="h-3.5 w-3.5" />
            Problem solving
          </p>
          <h3 className="font-heading text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            {hasNumber ? (
              <>
                <span className="font-mono text-accent-700 dark:text-accent-400">
                  {formatNumber(profile.totalSolved)}
                </span>{' '}
                problems solved on LeetCode
              </>
            ) : (
              'Problem-solving stats on LeetCode'
            )}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            A breakdown of what I&apos;ve tackled — difficulty mix, topic strengths, contest rating, and a 90-day activity heatmap.
          </p>
          {!isStale && hasNumber && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
              Updated {formatDistanceToNow(fetchedAt)}
            </p>
          )}
        </div>
        <a
          href="/leetcode"
          className="inline-flex items-center gap-1.5 self-start whitespace-nowrap rounded-md bg-accent-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-700 sm:self-auto dark:bg-accent-500 dark:hover:bg-accent-400"
        >
          View full stats
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}