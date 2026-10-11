import { formatNumber } from '@/lib/leetcode/format';
import type { LeetCodeProfile } from '@/lib/leetcode/types';

interface DifficultyChartProps {
  profile: LeetCodeProfile;
}

interface Segment {
  key: 'easy' | 'medium' | 'hard';
  label: string;
  count: number;
  color: string; // hex
  ringClass: string; // tailwind class for the legend dot
}

/**
 * Difficulty distribution donut chart.
 *
 * Pure SVG — no chart library. Three concentric arcs (Easy/Medium/Hard) with
 * the total solved count centered inside and a legend below.
 *
 * Colors: Easy = emerald, Medium = amber, Hard = rose. The same colors appear
 * on the segment strokes and the legend dots. Light and dark themes use the
 * same hex values (the colors are saturated enough to read on both).
 *
 * The chart is accessible via a single `aria-label` summarizing the breakdown.
 */
export function DifficultyChart({ profile }: DifficultyChartProps) {
  const { easySolved, mediumSolved, hardSolved, totalSolved } = profile;
  const hasData = totalSolved > 0;

  const segments: Segment[] = [
    {
      key: 'easy',
      label: 'Easy',
      count: easySolved,
      color: '#10b981',
      ringClass: 'bg-emerald-500 dark:bg-emerald-400',
    },
    {
      key: 'medium',
      label: 'Medium',
      count: mediumSolved,
      color: '#f59e0b',
      ringClass: 'bg-amber-500 dark:bg-amber-400',
    },
    {
      key: 'hard',
      label: 'Hard',
      count: hardSolved,
      color: '#ef4444',
      ringClass: 'bg-rose-500 dark:bg-rose-400',
    },
  ];

  const ariaLabel = hasData
    ? `Difficulty distribution: ${segments
        .map(
          s =>
            `${formatNumber(s.count)} ${s.label} (${pct(s.count, totalSolved)}%)`,
        )
        .join(', ')}`
    : 'Difficulty distribution: no problems solved yet';

  return (
    <figure
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <figcaption className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        Difficulty distribution
      </figcaption>

      {hasData ? (
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
          <Donut segments={segments} total={totalSolved} />
          <Legend segments={segments} total={totalSolved} />
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No problems solved yet.
        </p>
      )}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Donut
// ---------------------------------------------------------------------------

function Donut({ segments, total }: { segments: Segment[]; total: number }) {
  // viewBox 100x100, radius 38, stroke 14 → circumference C ≈ 238.76
  const r = 38;
  const C = 2 * Math.PI * r;
  // Clamp negative counts (data anomaly) to 0
  const safeTotal = Math.max(0, total);
  const safeSegs = segments.map(s => ({ ...s, count: Math.max(0, s.count) }));

  let offset = 0;
  return (
    <svg
      viewBox="0 0 100 100"
      width="160"
      height="160"
      className="block flex-shrink-0"
      role="img"
      aria-hidden="true"
    >
      {/* Background track */}
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="currentColor"
        className="text-slate-100 dark:text-slate-800"
        strokeWidth="14"
      />
      {safeSegs.map(seg => {
        if (seg.count === 0) return null;
        const arc = (seg.count / safeTotal) * C;
        // Circumference-progression: each segment's offset equals the
        // cumulative length of the segments before it.
        const dashOffset = -offset;
        offset += arc;
        return (
          <circle
            key={seg.key}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="14"
            strokeDasharray={`${arc} ${C - arc}`}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 50 50)"
            strokeLinecap="butt"
          >
            <title>{`${seg.label}: ${formatNumber(seg.count)} (${pct(seg.count, safeTotal)}%)`}</title>
          </circle>
        );
      })}
      {/* Center label */}
      <text
        x="50"
        y="48"
        textAnchor="middle"
        className="fill-slate-900 dark:fill-slate-100"
        style={{ fontSize: 16, fontWeight: 600 }}
      >
        {formatNumber(safeTotal)}
      </text>
      <text
        x="50"
        y="60"
        textAnchor="middle"
        className="fill-slate-500 dark:fill-slate-400"
        style={{ fontSize: 5 }}
      >
        solved
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Legend
// ---------------------------------------------------------------------------

function Legend({ segments, total }: { segments: Segment[]; total: number }) {
  return (
    <ul className="space-y-2 text-sm">
      {segments.map(seg => (
        <li key={seg.key} className="flex items-center gap-3" data-testid={`difficulty-${seg.key}`}>
          <span
            aria-hidden="true"
            className={`inline-block h-3 w-3 rounded-sm ${seg.ringClass}`}
          />
          <span className="w-16 font-medium text-slate-700 dark:text-slate-300">{seg.label}</span>
          <span className="font-mono text-slate-900 dark:text-slate-100">
            {formatNumber(seg.count)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({pct(seg.count, total)}%)
          </span>
        </li>
      ))}
    </ul>
  );
}

function pct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 1000) / 10;
}
