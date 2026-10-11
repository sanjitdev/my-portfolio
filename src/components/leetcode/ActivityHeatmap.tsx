import { formatNumber } from '@/lib/leetcode/format';
import type { LeetCodeActivityDay } from '@/lib/leetcode/types';

interface ActivityHeatmapProps {
  days: LeetCodeActivityDay[];
  totalSubmissions: number;
}

const CELL = 12; // px
const GAP = 2; // px
const STRIDE = CELL + GAP;

const WEEKDAYS = ['Mon', '', 'Wed', '', 'Fri', '', ''] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const BUCKET_LIGHT = [
  'fill-slate-100',
  'fill-emerald-200',
  'fill-emerald-400',
  'fill-emerald-500',
  'fill-emerald-700',
] as const;

const BUCKET_DARK = [
  'dark:fill-slate-800',
  'dark:fill-emerald-900',
  'dark:fill-emerald-700',
  'dark:fill-emerald-500',
  'dark:fill-emerald-300',
] as const;

const LEGEND_LIGHT = [
  'bg-slate-100',
  'bg-emerald-200',
  'bg-emerald-400',
  'bg-emerald-500',
  'bg-emerald-700',
] as const;

const LEGEND_DARK = [
  'dark:bg-slate-800',
  'dark:bg-emerald-900',
  'dark:bg-emerald-700',
  'dark:bg-emerald-500',
  'dark:bg-emerald-300',
] as const;

/**
 * 90-day activity heatmap (GitHub-style).
 *
 * Layout: 13 columns (weeks) × 7 rows (Mon..Sun). We align the **last** day
 * to the bottom-right and walk backwards, blanking the first column's leading
 * days so the grid starts on a Monday.
 *
 * Five intensity buckets (story 007):
 *   0     → bucket 0
 *   1–2   → bucket 1
 *   3–5   → bucket 2
 *   6–9   → bucket 3
 *   10+   → bucket 4
 *
 * Cell color is bucket-driven. The same cell renders with a different shade
 * in dark mode via the `dark:` variant of Tailwind.
 *
 * Accessibility:
 *   - The figure has an aria-label summarising total + active days.
 *   - Each cell has a `<title>` for native tooltips.
 *   - The figure caption is the "Activity (last 90 days)" eyebrow.
 */
export function ActivityHeatmap({ days, totalSubmissions }: ActivityHeatmapProps) {
  if (!days || days.length === 0) {
    return (
      <figure
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        aria-label="90-day activity: no data"
      >
        <figcaption className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          Activity (last 90 days)
        </figcaption>
        <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No activity data available.
        </p>
      </figure>
    );
  }

  // Normalize: the fetcher may hand us any number of days, but the contract
  // is a 90-day window. We trust the input's last entry is "today" and work
  // backwards.
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const lastDate = new Date(`${sorted[sorted.length - 1]!.date}T00:00:00Z`);
  const lastDow = lastDate.getUTCDay(); // 0 = Sun .. 6 = Sat
  // Mon=0 in our grid → map: Sun→6, Mon→0, Tue→1, ...
  const lastColDay = (lastDow + 6) % 7;

  // Determine column count: each week is 7 days. We add leading blanks to
  // align the last day in the bottom-right corner of its column.
  const totalDays = sorted.length;
  const totalCellsNeeded = totalDays + lastColDay; // 0..6 blanks on the right + days
  const numCols = Math.ceil(totalCellsNeeded / 7);

  // Build a 2D grid: grid[col][row] = day | null
  const byDate = new Map(sorted.map(d => [d.date, d]));
  const grid: (LeetCodeActivityDay | null)[][] = Array.from({ length: numCols }, () =>
    Array(7).fill(null),
  );

  for (let i = 0; i < totalDays; i++) {
    const day = sorted[i]!;
    // Position this day in the grid: first day goes at column 0 row (firstColDay),
    // walking left-to-right, top-to-bottom.
    const firstColDay = (lastColDay - ((totalDays - 1) % 7) + 7) % 7;
    const absoluteIndex = firstColDay + i;
    const col = Math.floor(absoluteIndex / 7);
    const row = absoluteIndex % 7;
    if (grid[col]) {
      grid[col]![row] = day;
    }
  }

  // Build the month labels: for each column, the first row containing a day
  // tells us its month (we just look up the first day in that column).
  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  for (let c = 0; c < numCols; c++) {
    const col = grid[c]!;
    const firstDay = col.find(d => d !== null);
    if (firstDay) {
      const m = new Date(`${firstDay.date}T00:00:00Z`).getUTCMonth();
      if (m !== lastMonth) {
        monthLabels.push({ col: c, label: MONTHS[m]! });
        lastMonth = m;
      }
    }
  }

  const activeDays = sorted.filter(d => d.count > 0).length;
  const width = numCols * STRIDE - GAP;
  const height = 7 * STRIDE - GAP;

  const ariaLabel = `90-day activity: ${formatNumber(totalSubmissions)} submissions, ${formatNumber(activeDays)} active days`;

  return (
    <figure
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          Activity (last 90 days)
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-mono text-slate-900 dark:text-slate-100" data-testid="heatmap-submissions">
            {formatNumber(totalSubmissions)}
          </span>{' '}
          submissions ·{' '}
          <span className="font-mono text-slate-900 dark:text-slate-100" data-testid="heatmap-active-days">
            {formatNumber(activeDays)}
          </span>{' '}
          active days
        </span>
      </figcaption>

      <div className="overflow-x-auto" data-testid="heatmap-wrapper">
        <div className="inline-flex flex-col gap-1">
          <div className="flex" style={{ paddingLeft: 28 }}>
            <svg
              width={width}
              height={12}
              viewBox={`0 0 ${width} 12`}
              className="block text-slate-500 dark:text-slate-400"
              aria-hidden="true"
            >
              {monthLabels.map(({ col, label }) => (
                <text
                  key={`${col}-${label}`}
                  x={col * STRIDE}
                  y={10}
                  style={{ fontSize: 9 }}
                  className="fill-current"
                >
                  {label}
                </text>
              ))}
            </svg>
          </div>

          <div className="flex gap-1">
            <div className="flex flex-col gap-0.5 pt-0.5" style={{ width: 24 }}>
              {WEEKDAYS.map((label, i) => (
                <span
                  key={i}
                  className="text-[9px] leading-3 text-slate-500 dark:text-slate-400"
                  style={{ height: CELL }}
                >
                  {label}
                </span>
              ))}
            </div>

            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-hidden="true"
            >
              {grid.map((col, c) =>
                col.map((day, r) => {
                  if (!day) return null;
                  const bucket = bucketFor(day.count);
                  return (
                    <rect
                      key={day.date}
                      x={c * STRIDE}
                      y={r * STRIDE}
                      width={CELL}
                      height={CELL}
                      rx={2}
                      ry={2}
                      className={`${BUCKET_LIGHT[bucket]} ${BUCKET_DARK[bucket]}`}
                      data-testid={`heatmap-cell-${day.date}`}
                    >
                      <title>{`${day.date}: ${day.count} submission${day.count === 1 ? '' : 's'}`}</title>
                    </rect>
                  );
                }),
              )}
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
        <span>Less</span>
        {LEGEND_LIGHT.map((cls, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`inline-block h-3 w-3 rounded-sm ${cls} ${LEGEND_DARK[i]}`}
          />
        ))}
        <span>More</span>
      </div>

      {totalSubmissions === 0 && (
        <p className="mt-3 text-center text-xs italic text-slate-500 dark:text-slate-400">
          No submissions in the last 90 days.
        </p>
      )}
    </figure>
  );
}

/** Map a count to a 0..4 intensity bucket. */
function bucketFor(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}
