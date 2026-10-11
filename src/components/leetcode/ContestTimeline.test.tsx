import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ContestTimeline } from './ContestTimeline';
import type { LeetCodeContest, LeetCodeContestSummary } from '@/lib/leetcode/types';

function makeContest(
  i: number,
  rating: number,
  topPercentage = 5,
): LeetCodeContest {
  // Spread contests across the past 20 weeks
  const d = new Date('2026-10-11T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - (19 - i) * 7);
  return {
    contestName: `Weekly Contest ${400 + i}`,
    attendedAt: d.toISOString(),
    rating,
    ranking: 1000 + i * 50,
    topPercentage,
  };
}

const FULL_SUMMARY: LeetCodeContestSummary = {
  currentRating: 1842,
  globalRanking: 25432,
  topPercentage: 4.2,
  attendedContestsCount: 32,
  badgeName: 'Knight',
};

describe('ContestTimeline', () => {
  afterEach(cleanup);

  it('renders the current rating and badge', () => {
    const contests = [makeContest(0, 1500), makeContest(1, 1600), makeContest(2, 1842)];
    render(<ContestTimeline contests={contests} summary={FULL_SUMMARY} />);
    expect(screen.getByTestId('contest-current-rating').textContent).toBe('1,842');
    expect(screen.getByTestId('contest-badge').textContent).toMatch(/Knight/);
  });

  it('renders the "Top X% globally" line and attended count', () => {
    const contests = [makeContest(0, 1500), makeContest(1, 1842)];
    render(<ContestTimeline contests={contests} summary={FULL_SUMMARY} />);
    expect(screen.getByTestId('contest-top-percent').textContent).toMatch(/Top 4\.20% globally/);
    expect(screen.getByTestId('contest-attended-count').textContent).toMatch(/32 contests/);
  });

  it('omits the "Top X%" line when topPercentage is null', () => {
    const summary = { ...FULL_SUMMARY, topPercentage: null };
    const contests = [makeContest(0, 1500), makeContest(1, 1842)];
    render(<ContestTimeline contests={contests} summary={summary} />);
    expect(screen.queryByTestId('contest-top-percent')).toBeNull();
  });

  it('hides the badge pill when badgeName is null', () => {
    const summary = { ...FULL_SUMMARY, badgeName: null };
    const contests = [makeContest(0, 1500), makeContest(1, 1842)];
    render(<ContestTimeline contests={contests} summary={summary} />);
    expect(screen.queryByTestId('contest-badge')).toBeNull();
  });

  it('returns null when contests is empty', () => {
    const { container } = render(<ContestTimeline contests={[]} summary={FULL_SUMMARY} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when summary is null (user opted out)', () => {
    const contests = [makeContest(0, 1500), makeContest(1, 1842)];
    const { container } = render(<ContestTimeline contests={contests} summary={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when attendedContestsCount is 0', () => {
    const summary = { ...FULL_SUMMARY, attendedContestsCount: 0 };
    const contests = [makeContest(0, 1500), makeContest(1, 1842)];
    const { container } = render(<ContestTimeline contests={contests} summary={summary} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders one circle per contest in the sparkline', () => {
    const contests = Array.from({ length: 20 }, (_, i) => makeContest(i, 1500 + i * 20));
    const { container } = render(<ContestTimeline contests={contests} summary={FULL_SUMMARY} />);
    // The sparkline circles all have a <title> child with the contest name.
    // That's the most reliable way to distinguish them from any icon circles.
    const titledCircles = container.querySelectorAll('svg circle title');
    expect(titledCircles.length).toBe(20);
  });

  it('renders a single, larger circle when there is exactly one contest', () => {
    const contests = [makeContest(0, 1842)];
    const { container } = render(<ContestTimeline contests={contests} summary={FULL_SUMMARY} />);
    const titledCircles = container.querySelectorAll('svg circle title');
    expect(titledCircles.length).toBe(1);
    const circle = titledCircles[0]!.parentElement as unknown as SVGCircleElement;
    expect(circle.getAttribute('r')).toBe('4');
  });

  it('exposes an accessible label summarizing the contest section', () => {
    const contests = [makeContest(0, 1500), makeContest(1, 1842)];
    render(<ContestTimeline contests={contests} summary={FULL_SUMMARY} />);
    expect(
      screen.getByRole('region', {
        name: /Contest rating: current 1,842, Knight badge, top 4\.2% globally, across 32 contests/,
      }),
    ).toBeInTheDocument();
  });

  it('includes native tooltips on each sparkline point', () => {
    const contests = [makeContest(0, 1500), makeContest(1, 1842)];
    const { container } = render(<ContestTimeline contests={contests} summary={FULL_SUMMARY} />);
    const titles = container.querySelectorAll('svg circle title');
    expect(titles.length).toBe(2);
    expect(titles[0]?.textContent).toMatch(/Weekly Contest 400/);
    expect(titles[1]?.textContent).toMatch(/Weekly Contest 401/);
  });

  it('uses a Guardian pill style for a Guardian badge', () => {
    const summary = { ...FULL_SUMMARY, badgeName: 'Guardian', currentRating: 2700 };
    const contests = [makeContest(0, 1500), makeContest(1, 2700)];
    render(<ContestTimeline contests={contests} summary={summary} />);
    const pill = screen.getByTestId('contest-badge');
    expect(pill.textContent).toMatch(/Guardian/);
    // Sanity: the Guardian class is in the rendered class list
    expect(pill.className).toMatch(/text-blue-700|bg-blue-100/);
  });
});
