import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ActivityHeatmap } from './ActivityHeatmap';
import type { LeetCodeActivityDay } from '@/lib/leetcode/types';

/**
 * Build 90 consecutive days ending today (UTC). Most are 0; some have
 * representative counts for the bucket tests.
 */
function buildDays(): LeetCodeActivityDay[] {
  const out: LeetCodeActivityDay[] = [];
  const today = new Date('2026-10-11T00:00:00Z');
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    // Place one day in each bucket for visual confirmation.
    let count = 0;
    if (iso === '2026-10-11') count = 12; // bucket 4 (10+)
    else if (iso === '2026-10-10') count = 8; // bucket 3 (6-9)
    else if (iso === '2026-10-09') count = 4; // bucket 2 (3-5)
    else if (iso === '2026-10-08') count = 2; // bucket 1 (1-2)
    out.push({ date: iso, count });
  }
  return out;
}

describe('ActivityHeatmap', () => {
  afterEach(cleanup);

  it('renders one cell per day', () => {
    const days = buildDays();
    render(<ActivityHeatmap days={days} totalSubmissions={28} />);
    // 90 days = 90 cells
    const cells = screen.getAllByTestId(/^heatmap-cell-/);
    expect(cells.length).toBe(90);
  });

  it('shows the eyebrow + the total / active days summary', () => {
    const days = buildDays();
    render(<ActivityHeatmap days={days} totalSubmissions={28} />);
    expect(screen.getByText(/Activity \(last 90 days\)/i)).toBeInTheDocument();
    expect(screen.getByTestId('heatmap-submissions').textContent).toMatch(/28/);
    expect(screen.getByTestId('heatmap-active-days').textContent).toMatch(/4/);
  });

  it('renders the weekday labels (Mon, Wed, Fri) and skips Tue/Thu/Sat/Sun', () => {
    const days = buildDays();
    render(<ActivityHeatmap days={days} totalSubmissions={28} />);
    // The WEEKDAYS array is ['Mon', '', 'Wed', '', 'Fri', '', '']
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    // Other weekday slots render an empty span — verify by absence of "Sat"
    expect(screen.queryByText('Sat')).toBeNull();
  });

  it('places the highest-bucket day (10+) in bucket 4 via the fill class', () => {
    const days = buildDays();
    render(<ActivityHeatmap days={days} totalSubmissions={28} />);
    const cell = screen.getByTestId('heatmap-cell-2026-10-11');
    const cls = cell.getAttribute('class') ?? '';
    expect(cls).toMatch(/fill-emerald-700/);
  });

  it('places a 0-count day in bucket 0 (slate)', () => {
    const days = buildDays();
    render(<ActivityHeatmap days={days} totalSubmissions={28} />);
    const cell = screen.getByTestId('heatmap-cell-2026-10-07');
    const cls = cell.getAttribute('class') ?? '';
    expect(cls).toMatch(/fill-slate-100/);
  });

  it('exposes an aria-label summarising the data', () => {
    const days = buildDays();
    render(<ActivityHeatmap days={days} totalSubmissions={28} />);
    expect(
      screen.getByRole('figure', {
        name: /90-day activity: 28 submissions, 4 active days/,
      }),
    ).toBeInTheDocument();
  });

  it('renders an empty state when days is empty', () => {
    render(<ActivityHeatmap days={[]} totalSubmissions={0} />);
    expect(screen.getByText(/No activity data available/i)).toBeInTheDocument();
  });
});
