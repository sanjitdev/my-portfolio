import { Trophy, Award, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/leetcode/format';
import type { LeetCodeContest, LeetCodeContestSummary } from '@/lib/leetcode/types';

interface ContestTimelineProps {
  contests: LeetCodeContest[];
  summary: LeetCodeContestSummary | null;
}

/**
 * Contest rating timeline for the `/leetcode` page.
 *
 * Layout:
 *   [Contest rating eyebrow]              [Knight pill]    (if badge)
 *   [Big rating number]   [Sparkline]     [Top X% globally] (if known)
 *                                         [Attended N contests]
 *
 * Returns `null` (hides the section) when:
 *   - `contests` is empty
 *   - `summary` is null (user opted out of contest rankings)
 *   - `summary.attendedContestsCount` is 0
 *
 * The sparkline is a custom SVG line chart (no chart library) plotting the
 * last 20 contests. Each data point is a `<circle>` with a `<title>` for
 * native tooltip support (contest name + date + rating).
 */
export function ContestTimeline({ contests, summary }: ContestTimelineProps) {
  if (!summary) return null;
  if (summary.attendedContestsCount === 0) return null;
  if (contests.length === 0) return null;

  const sorted = [...contests].sort((a, b) =>
    a.attendedAt.localeCompare(b.attendedAt),
  );

  const ariaLabel = `Contest rating: current ${formatNumber(summary.currentRating)}${
    summary.badgeName ? `, ${summary.badgeName} badge` : ''
  }${summary.topPercentage !== null ? `, top ${summary.topPercentage}% globally` : ''}, across ${formatNumber(summary.attendedContestsCount)} contests`;

  return (
    <section
      aria-label={ariaLabel}
      data-testid="contest-timeline"
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr_auto] lg:items-center">
        {/* Left: current rating + badge */}
        <div>
          <p className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            <Trophy aria-hidden="true" className="h-4 w-4" />
            Contest rating
          </p>
          <div className="flex items-baseline gap-3">
            <span
              className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100"
              data-testid="contest-current-rating"
            >
              {formatNumber(summary.currentRating)}
            </span>
            {summary.badgeName ? (
              <BadgePill name={summary.badgeName} />
            ) : null}
          </div>
        </div>

        {/* Middle: sparkline */}
        <div>
          <Sparkline contests={sorted} />
        </div>

        {/* Right: ranking + count */}
        <div className="space-y-1 text-sm lg:text-right">
          {summary.topPercentage !== null ? (
            <p
              className="flex items-center gap-1.5 font-mono text-slate-900 lg:justify-end dark:text-slate-100"
              data-testid="contest-top-percent"
            >
              <TrendingUp aria-hidden="true" className="h-3.5 w-3.5 text-accent-500 dark:text-accent-400" />
              Top {summary.topPercentage.toFixed(2)}% globally
            </p>
          ) : null}
          <p className="text-xs text-slate-500 dark:text-slate-400" data-testid="contest-attended-count">
            {formatNumber(summary.attendedContestsCount)} contest
            {summary.attendedContestsCount === 1 ? '' : 's'} attended
          </p>
          {summary.globalRanking ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked #{formatNumber(summary.globalRanking)} worldwide
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------

const SPARK_W = 600;
const SPARK_H = 80;
const SPARK_PAD = 6;

function Sparkline({ contests }: { contests: LeetCodeContest[] }) {
  if (contests.length === 0) return null;

  const ratings = contests.map(c => c.rating);
  const minR = Math.min(...ratings);
  const maxR = Math.max(...ratings);
  // Auto-scale with a small margin so the line doesn't hug the edges
  const range = Math.max(1, maxR - minR);
  const yMin = minR - Math.max(20, Math.floor(range * 0.1));
  const yMax = maxR + Math.max(20, Math.floor(range * 0.1));
  const ySpan = Math.max(1, yMax - yMin);

  const xStep = contests.length === 1 ? 0 : (SPARK_W - 2 * SPARK_PAD) / (contests.length - 1);

  const points = contests.map((c, i) => {
    const x = SPARK_PAD + i * xStep;
    const y = SPARK_H - SPARK_PAD - ((c.rating - yMin) / ySpan) * (SPARK_H - 2 * SPARK_PAD);
    return { x, y, contest: c };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath =
    `M${points[0]!.x.toFixed(1)} ${(SPARK_H - SPARK_PAD).toFixed(1)} ` +
    points.map(p => `L${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') +
    ` L${points[points.length - 1]!.x.toFixed(1)} ${(SPARK_H - SPARK_PAD).toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
      preserveAspectRatio="none"
      width="100%"
      height={SPARK_H}
      className="block"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" className="text-accent-500 dark:text-accent-400" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" className="text-accent-500 dark:text-accent-400" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkline-fill)" />
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        className="text-accent-500 dark:text-accent-400"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => {
        const date = new Date(p.contest.attendedAt);
        const dateStr = date.toISOString().slice(0, 10);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={contests.length === 1 ? 4 : 2.5}
            fill="currentColor"
            className="text-accent-600 dark:text-accent-300"
          >
            <title>{`${p.contest.contestName} — ${dateStr}: ${formatNumber(p.contest.rating)} (${
              p.contest.topPercentage !== null
                ? `Top ${p.contest.topPercentage.toFixed(1)}%`
                : `rank ${formatNumber(p.contest.ranking)}`
            })`}</title>
          </circle>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Badge pill
// ---------------------------------------------------------------------------

const BADGE_STYLES: Record<string, { bg: string; text: string; ring: string }> = {
  Knight: {
    bg: 'bg-violet-100 dark:bg-violet-950/40',
    text: 'text-violet-700 dark:text-violet-300',
    ring: 'ring-violet-200 dark:ring-violet-900/50',
  },
  Guardian: {
    bg: 'bg-blue-100 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    ring: 'ring-blue-200 dark:ring-blue-900/50',
  },
  Hero: {
    bg: 'bg-orange-100 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-300',
    ring: 'ring-orange-200 dark:ring-orange-900/50',
  },
};

function BadgePill({ name }: { name: string }) {
  const style = BADGE_STYLES[name] ?? BADGE_STYLES['Knight']!;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ${style.bg} ${style.text} ${style.ring}`}
      data-testid="contest-badge"
    >
      <Award aria-hidden="true" className="h-3 w-3" />
      {name}
    </span>
  );
}
