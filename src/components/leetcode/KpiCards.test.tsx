import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { KpiCards } from './KpiCards';
import type { LeetCodeProfile } from '@/lib/leetcode/types';

const baseProfile: LeetCodeProfile = {
  username: 'sanjit12',
  totalSolved: 412,
  easySolved: 150,
  mediumSolved: 200,
  hardSolved: 62,
  acceptanceRate: 43.8,
  ranking: 12345,
  contributionPoints: 42,
};

describe('KpiCards', () => {
  beforeEach(() => {
    // matchMedia is jsdom-undefined by default; stub it so prefers-reduced-motion
    // is true. This makes the count-up skip the animation and render the final
    // value immediately — exactly what we want to assert in tests, AND what we
    // want to verify the hook does in production for users with that preference.
    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query.includes('reduce'),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        })),
      });
    }
  });

  afterEach(() => {
    cleanup();
  });

  it('renders all four tile labels', () => {
    render(<KpiCards profile={baseProfile} />);
    expect(screen.getByText('Total Solved')).toBeInTheDocument();
    expect(screen.getByText('Acceptance Rate')).toBeInTheDocument();
    expect(screen.getByText('Global Ranking')).toBeInTheDocument();
    expect(screen.getByText('Contribution Points')).toBeInTheDocument();
  });

  it('shows the final numbers in SSR HTML (so no hydration mismatch)', () => {
    render(<KpiCards profile={baseProfile} />);
    // The hook initializes to the final value, so the rendered text reflects it
    expect(screen.getByTestId('kpi-total-solved').textContent).toMatch(/412/);
    expect(screen.getByTestId('kpi-acceptance-rate').textContent).toContain('43.8%');
    expect(screen.getByTestId('kpi-global-ranking').textContent).toContain('12,345');
    expect(screen.getByTestId('kpi-contribution-points').textContent).toMatch(/42/);
  });

  it('uses a thousands separator on the Total Solved tile', () => {
    const p = { ...baseProfile, totalSolved: 12345 };
    render(<KpiCards profile={p} />);
    expect(screen.getByTestId('kpi-total-solved').textContent).toContain('12,345');
  });

  it('shows "—" for Global Ranking when the user opted out', () => {
    const p = { ...baseProfile, ranking: null };
    render(<KpiCards profile={p} />);
    const ranking = screen.getByTestId('kpi-global-ranking');
    expect(ranking.textContent).toBe('—');
    expect(ranking).toHaveAttribute('title', expect.stringMatching(/hidden/i));
  });

  it('shows "—" for Acceptance Rate when zero', () => {
    const p = { ...baseProfile, acceptanceRate: 0 };
    render(<KpiCards profile={p} />);
    expect(screen.getByTestId('kpi-acceptance-rate').textContent).toContain('—');
  });

  it('exposes accessible labels summarising each tile', () => {
    render(<KpiCards profile={baseProfile} />);
    expect(
      screen.getByRole('group', { name: /Total Solved: 412 problems/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /Acceptance Rate: 43\.8 percent/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /Global Ranking: number 12,345/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /Contribution Points: 42/ }),
    ).toBeInTheDocument();
  });

  it('exposes a "not available" label when ranking is hidden', () => {
    const p = { ...baseProfile, ranking: null };
    render(<KpiCards profile={p} />);
    expect(
      screen.getByRole('group', { name: /Global Ranking: not available/ }),
    ).toBeInTheDocument();
  });
});
