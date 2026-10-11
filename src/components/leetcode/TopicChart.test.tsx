import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { TopicChart } from './TopicChart';
import type { LeetCodeTopicStat } from '@/lib/leetcode/types';

const TOPICS: LeetCodeTopicStat[] = [
  { tagName: 'Array', tagSlug: 'array', solvedCount: 200 },
  { tagName: 'Hash Table', tagSlug: 'hash-table', solvedCount: 180 },
  { tagName: 'Dynamic Programming', tagSlug: 'dynamic-programming', solvedCount: 120 },
  { tagName: 'String', tagSlug: 'string', solvedCount: 100 },
  { tagName: 'Tree', tagSlug: 'tree', solvedCount: 80 },
  { tagName: 'Depth-First Search', tagSlug: 'depth-first-search', solvedCount: 60 },
  { tagName: 'Binary Search', tagSlug: 'binary-search', solvedCount: 50 },
  { tagName: 'Greedy', tagSlug: 'greedy', solvedCount: 40 },
  { tagName: 'Graph', tagSlug: 'graph', solvedCount: 30 }, // should NOT appear (top 8)
];

describe('TopicChart', () => {
  afterEach(cleanup);

  it('returns null when there are no topics', () => {
    const { container } = render(<TopicChart topics={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows the top 8 topics sorted by count descending', () => {
    render(<TopicChart topics={TOPICS} />);
    const list = screen.getByTestId('topic-list');
    // Graph (count 30) should be the 9th item — absent.
    expect(screen.queryByTestId('topic-row-graph')).toBeNull();
    // Array (200) is the top item — present.
    expect(screen.getByTestId('topic-row-array')).toBeInTheDocument();
  });

  it('breaks ties at the same count alphabetically', () => {
    const tied: LeetCodeTopicStat[] = [
      { tagName: 'Zebra', tagSlug: 'zebra', solvedCount: 50 },
      { tagName: 'Apple', tagSlug: 'apple', solvedCount: 50 },
      { tagName: 'Mango', tagSlug: 'mango', solvedCount: 50 },
    ];
    render(<TopicChart topics={tied} />);
    const list = screen.getByTestId('topic-list');
    const items = Array.from(list.querySelectorAll('li'));
    const names = items.map(li => li.querySelector('span')!.textContent);
    expect(names).toEqual(['Apple', 'Mango', 'Zebra']);
  });

  it('truncates long topic names with a title attribute', () => {
    render(<TopicChart topics={TOPICS} />);
    const dp = screen.getByText('Dynamic Programming');
    expect(dp).toHaveAttribute('title', 'Dynamic Programming');
    // The CSS `truncate` class is present:
    expect(dp.className).toMatch(/\btruncate\b/);
  });

  it('has an accessible label summarising the top topics', () => {
    render(<TopicChart topics={TOPICS} />);
    expect(
      screen.getByRole('figure', {
        name: /Top 8 topics by solved count: Array \(200\), Hash Table \(180\), Dynamic Programming \(120\), String \(100\), Tree \(80\), Depth-First Search \(60\), Binary Search \(50\), Greedy \(40\)/,
      }),
    ).toBeInTheDocument();
  });

  it('uses the maximum count to scale bar widths (so the top bar is 100%)', () => {
    render(<TopicChart topics={TOPICS} />);
    const firstFill = screen.getByTestId('topic-row-array').querySelector('div > div') as HTMLElement;
    expect(firstFill.style.width).toBe('100%');
  });
});
