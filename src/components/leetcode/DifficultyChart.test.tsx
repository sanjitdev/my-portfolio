import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { DifficultyChart } from './DifficultyChart';
import type { LeetCodeProfile } from '@/lib/leetcode/types';

const profile: LeetCodeProfile = {
  username: 'sanjit12',
  totalSolved: 412,
  easySolved: 150,
  mediumSolved: 200,
  hardSolved: 62,
  acceptanceRate: 43.8,
  ranking: 12345,
  contributionPoints: 42,
};

describe('DifficultyChart', () => {
  afterEach(cleanup);

  it('renders the eyebrow caption', () => {
    render(<DifficultyChart profile={profile} />);
    expect(screen.getByText(/Difficulty distribution/i)).toBeInTheDocument();
  });

  it('shows counts and percentages for all three difficulties', () => {
    render(<DifficultyChart profile={profile} />);
    expect(screen.getByTestId('difficulty-easy').textContent).toMatch(/150/);
    expect(screen.getByTestId('difficulty-easy').textContent).toMatch(/36\.4%/);
    expect(screen.getByTestId('difficulty-medium').textContent).toMatch(/200/);
    expect(screen.getByTestId('difficulty-medium').textContent).toMatch(/48\.5%/);
    expect(screen.getByTestId('difficulty-hard').textContent).toMatch(/62/);
    expect(screen.getByTestId('difficulty-hard').textContent).toMatch(/15%/);
  });

  it('shows the total solved inside the donut', () => {
    const { container } = render(<DifficultyChart profile={profile} />);
    // The donut has a <text> with the total in the center.
    expect(container.querySelector('svg')?.textContent).toContain('412');
  });

  it('has an accessible label summarising the breakdown', () => {
    render(<DifficultyChart profile={profile} />);
    expect(
      screen.getByRole('figure', {
        name: /Difficulty distribution: 150 Easy \(36\.4%\), 200 Medium \(48\.5%\), 62 Hard \(15%\)/,
      }),
    ).toBeInTheDocument();
  });

  it('renders an empty state when nothing is solved', () => {
    const empty: LeetCodeProfile = { ...profile, totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
    render(<DifficultyChart profile={empty} />);
    expect(screen.getByText(/No problems solved yet/i)).toBeInTheDocument();
  });

  it('clamps negative counts to 0 (data anomaly): no segment drawn', () => {
    const weird: LeetCodeProfile = { ...profile, easySolved: -5, totalSolved: 412 };
    const { container } = render(<DifficultyChart profile={weird} />);
    // The legend still shows the raw -5 count, but the donut SVG must NOT
    // contain a <circle> with strokeDasharray for the easy segment (clamped
    // arc length is 0, so the segment is skipped).
    const donutCircles = container.querySelectorAll('svg circle[stroke-dasharray]');
    // medium + hard are still drawn (2 segments). Easy is not.
    expect(donutCircles.length).toBe(2);
  });
});
