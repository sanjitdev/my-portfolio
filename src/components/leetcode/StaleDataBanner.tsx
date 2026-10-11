import { AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/leetcode/format';

interface StaleDataBannerProps {
  error?: string;
  /** ISO timestamp of the last successful fetch. */
  fetchedAt: string;
}

/**
 * Banner shown when the LeetCode data is stale (the data source failed
 * during this ISR regeneration and we're serving a cached/fallback payload).
 *
 * Visual treatment is intentionally subtle — not alarming. A stale banner
 * is a known constraint, not an error. The leftmost dot pulses gently
 * (via the project's `availability-dot` keyframe) to convey "live, but
 * degraded" without scaring the visitor.
 */
export function StaleDataBanner({ error, fetchedAt }: StaleDataBannerProps) {
  const ageText = formatDistanceToNow(fetchedAt);
  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-8 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200"
    >
      <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <div>
        <p className="flex items-center gap-2 font-medium">
          <span
            aria-hidden="true"
            className="availability-dot inline-block h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400"
          />
          Stats may be out of date
        </p>
        <p className="mt-1 text-amber-800/80 dark:text-amber-300/80">
          Last successful update: {ageText}. The LeetCode data source did not
          respond during this refresh; the values shown are from the previous
          successful fetch.
          {error ? <span className="mt-1 block font-mono text-xs">({error})</span> : null}
        </p>
      </div>
    </div>
  );
}