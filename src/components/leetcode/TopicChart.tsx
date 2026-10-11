import { formatNumber } from '@/lib/leetcode/format';
import type { LeetCodeTopicStat } from '@/lib/leetcode/types';

interface TopicChartProps {
  topics: LeetCodeTopicStat[];
}

const TOPIC_LIMIT = 8;

/**
 * Horizontal bar chart of the top 8 solved topics.
 *
 * Pure CSS — each row is a flexbox with a label, a `<div>` track, and a
 * `<div>` fill whose width is `count / max * 100%`. No SVG, no canvas.
 *
 * Ties at the same solved count are broken alphabetically (per story 006).
 * If the data source provides no topic tags, the component returns `null`
 * and the page hides the section entirely.
 */
export function TopicChart({ topics }: TopicChartProps) {
  if (!topics || topics.length === 0) return null;

  const sorted = [...topics]
    .sort((a, b) => {
      if (b.solvedCount !== a.solvedCount) return b.solvedCount - a.solvedCount;
      return a.tagName.localeCompare(b.tagName);
    })
    .slice(0, TOPIC_LIMIT);

  const max = sorted[0]?.solvedCount ?? 1;

  const ariaLabel = `Top ${sorted.length} topics by solved count: ${sorted
    .map(t => `${t.tagName} (${formatNumber(t.solvedCount)})`)
    .join(', ')}`;

  return (
    <figure
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <figcaption className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        Top topics solved
      </figcaption>
      <ul className="space-y-2.5" data-testid="topic-list">
        {sorted.map(topic => {
          const widthPct = max > 0 ? (topic.solvedCount / max) * 100 : 0;
          return (
            <li
              key={topic.tagSlug}
              className="flex items-center gap-3"
              data-testid={`topic-row-${topic.tagSlug}`}
            >
              <span
                className="w-[120px] flex-shrink-0 truncate text-sm text-slate-700 sm:w-[160px] dark:text-slate-300"
                title={topic.tagName}
              >
                {topic.tagName}
              </span>
              <div
                className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                role="presentation"
              >
                <div
                  className="h-full rounded-full bg-accent-500 transition-all duration-500 dark:bg-accent-400"
                  style={{ width: `${widthPct}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className="w-12 flex-shrink-0 text-right font-mono text-sm tabular-nums text-slate-900 dark:text-slate-100">
                {formatNumber(topic.solvedCount)}
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
