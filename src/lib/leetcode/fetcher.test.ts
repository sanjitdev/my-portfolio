import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Unit tests for the LeetCode fetcher.
 *
 * These tests focus on the contract that matters for downstream rendering:
 *   - The fetcher never throws
 *   - On any error, it returns an `isStale: true` payload (zeroed or last-known)
 *   - The empty fallback has the expected shape
 *   - The `getLeetCodeTotalSolved` helper returns the right number
 *
 * We mock the global `fetch` so the test does not depend on the real
 * LeetCode GraphQL endpoint being reachable. The fetcher's module-level
 * last-known-good cache is reset between tests via the internal hook.
 */

import { getLeetCodePageData, getLeetCodeTotalSolved, __resetLeetCodeCacheForTests } from './fetcher';

const originalFetch = globalThis.fetch;
const originalEnv = process.env['LEETCODE_USERNAME'];

beforeEach(() => {
  __resetLeetCodeCacheForTests();
  delete process.env['LEETCODE_USERNAME'];
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalEnv === undefined) {
    delete process.env['LEETCODE_USERNAME'];
  } else {
    process.env['LEETCODE_USERNAME'] = originalEnv;
  }
  vi.restoreAllMocks();
});

function gqlOk(body: unknown) {
  return vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ data: body }),
  })) as unknown as typeof fetch;
}

/**
 * Multi-body mock: serves a different response per GraphQL query. The fetcher
 * issues 4 parallel queries (userProfile, topicStats, calendar, contests);
 * a single-body mock would conflate them and trip on shape validation.
 *
 * `byQuery` is a map from a substring of the query body to the response data
 * to serve for that query. A query whose body does not match any key falls
 * through to `fallback`.
 */
function gqlOkMulti(
  byQuery: Record<string, unknown>,
  fallback: unknown,
) {
  return vi.fn(async (_url: string, init?: { body?: string }) => {
    const body = init?.body ?? '';
    let chosen: unknown = fallback;
    for (const [key, val] of Object.entries(byQuery)) {
      if (body.includes(key)) {
        chosen = val;
        break;
      }
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ data: chosen }),
    };
  }) as unknown as typeof fetch;
}

function gqlFail(status = 500) {
  return vi.fn(async () => ({
    ok: false,
    status,
    json: async () => ({}),
  })) as unknown as typeof fetch;
}

const FULL_USER = {
  matchedUser: {
    username: 'sanjit12',
    submitStatsGlobal: {
      // AC: solved count + accepted submissions (count === solved in acSubmissionNum).
      acSubmissionNum: [
        { difficulty: 'Easy', count: 100, submissions: 120 },
        { difficulty: 'Medium', count: 200, submissions: 250 },
        { difficulty: 'Hard', count: 50, submissions: 80 },
      ],
      // Total: count = total problems at difficulty, submissions = total attempts.
      // 100+200+50 = 350 solved; 200+400+200 = 800 total attempts.
      // acceptanceRate = 350 / 800 * 100 = 43.75 → rounded 43.8.
      totalSubmissionNum: [
        { difficulty: 'Easy', count: 800, submissions: 200 },
        { difficulty: 'Medium', count: 1500, submissions: 400 },
        { difficulty: 'Hard', count: 600, submissions: 200 },
      ],
    },
    profile: { ranking: 12345, reputation: 42 },
  },
};

const EMPTY_TOPIC = { matchedUser: { tagProblemCounts: { advanced: [], intermediate: [], fundamental: [] } } };
const EMPTY_CALENDAR = { matchedUser: { userCalendar: { activeYears: [2026], streak: 0, totalActiveDays: 0, submissionCalendar: '{}' } } };
const EMPTY_CONTESTS = { userContestRanking: null, userContestRankingHistory: [] };
const FULL_CONTESTS = {
  userContestRanking: {
    attendedContestsCount: 32,
    rating: 2142,
    globalRanking: 25432,
    topPercentage: 4.2,
  },
  userContestRankingHistory: [
    { contest: { title: 'Weekly Contest 410', startTime: 1696636800 }, rating: 1500, ranking: 5000 },
    { contest: { title: 'Weekly Contest 411', startTime: 1697241600 }, rating: 2142, ranking: 1500 },
  ],
};

describe('getLeetCodePageData', () => {
  /**
   * Builds a multi-body mock that serves the right shape for each of the
   * 4 GraphQL queries the fetcher issues.
   */
  function mockAllResponses(overrides: {
    profile?: unknown;
    topic?: unknown;
    calendar?: unknown;
    contests?: unknown;
  } = {}) {
    return gqlOkMulti(
      {
        userProfile: overrides.profile ?? FULL_USER,
        topicStats: overrides.topic ?? EMPTY_TOPIC,
        calendar: overrides.calendar ?? EMPTY_CALENDAR,
        contests: overrides.contests ?? EMPTY_CONTESTS,
      },
      // Fallback for safety — should never be hit
      { ...EMPTY_TOPIC, ...EMPTY_CALENDAR, ...EMPTY_CONTESTS, matchedUser: null },
    );
  }

  it('returns a fully-populated, non-stale result on success', async () => {
    globalThis.fetch = mockAllResponses();

    const data = await getLeetCodePageData();
    expect(data.isStale).toBe(false);
    expect(data.profile.username).toBe('sanjit12');
    expect(data.profile.totalSolved).toBe(350);
    expect(data.profile.easySolved).toBe(100);
    expect(data.profile.mediumSolved).toBe(200);
    expect(data.profile.hardSolved).toBe(50);
    expect(data.profile.ranking).toBe(12345);
    expect(data.profile.contributionPoints).toBe(42);
    // acceptanceRate = 350 / (200+400+200) * 100 = 43.75 → rounded 43.8
    expect(data.profile.acceptanceRate).toBeCloseTo(43.8, 1);
    expect(data.error).toBeUndefined();
  });

  it('returns a zeroed, isStale result on first-call failure (no throw)', async () => {
    globalThis.fetch = gqlFail(503);

    const data = await getLeetCodePageData();
    expect(data.isStale).toBe(true);
    expect(data.profile.totalSolved).toBe(0);
    expect(data.profile.username).toBe('sanjit12');
    expect(data.error).toBeDefined();
  });

  it('returns the last-known-good payload (isStale=true) on subsequent failure', async () => {
    // First call: success
    globalThis.fetch = mockAllResponses();
    const first = await getLeetCodePageData();
    expect(first.isStale).toBe(false);
    expect(first.profile.totalSolved).toBe(350);

    // Second call: failure — should serve last-known-good
    globalThis.fetch = gqlFail(429);
    const second = await getLeetCodePageData();
    expect(second.isStale).toBe(true);
    expect(second.profile.totalSolved).toBe(350); // same as first
    expect(second.fetchedAt).toBe(first.fetchedAt); // original timestamp preserved
  });

  it('handles missing user gracefully (matchedUser null)', async () => {
    globalThis.fetch = mockAllResponses({ profile: { matchedUser: null, submitStatsGlobal: null, profile: null } });

    const data = await getLeetCodePageData();
    expect(data.isStale).toBe(true);
    expect(data.error).toContain('not found');
  });

  it('honors LEETCODE_USERNAME env var when set', async () => {
    process.env['LEETCODE_USERNAME'] = 'different_user';
    globalThis.fetch = mockAllResponses();
    const data = await getLeetCodePageData();
    // raw response wins for the displayed username (the API echoes the queried user)
    expect(data.profile.username).toBe('sanjit12');
    // Verify the env var was used in the GraphQL call
    expect(globalThis.fetch).toHaveBeenCalled();
    const lastCall = (globalThis.fetch as unknown as { mock: { calls: unknown[][] } }).mock.calls.at(-1);
    expect(JSON.stringify(lastCall)).toContain('different_user');
  });

  it('populates contestSummary from userContestRanking on success', async () => {
    globalThis.fetch = mockAllResponses({ contests: FULL_CONTESTS });
    const data = await getLeetCodePageData();
    expect(data.contestSummary).not.toBeNull();
    expect(data.contestSummary?.currentRating).toBe(2142);
    expect(data.contestSummary?.globalRanking).toBe(25432);
    expect(data.contestSummary?.topPercentage).toBe(4.2);
    expect(data.contestSummary?.attendedContestsCount).toBe(32);
    // badgeName is derived from currentRating (2142 ≥ 2000 → Knight) because
    // LeetCode's API no longer exposes the `contestBadge` field directly.
    expect(data.contestSummary?.badgeName).toBe('Knight');
    expect(data.contests).toHaveLength(2);
    expect(data.contests[0]?.contestName).toBe('Weekly Contest 410');
    // Per-contest rows no longer carry topPercentage from the API.
    expect(data.contests[0]?.topPercentage).toBeNull();
    expect(data.contests[1]?.topPercentage).toBeNull();
  });

  it('returns null contestSummary when userContestRanking is null', async () => {
    globalThis.fetch = mockAllResponses({ contests: EMPTY_CONTESTS });
    const data = await getLeetCodePageData();
    expect(data.contestSummary).toBeNull();
    expect(data.contests).toEqual([]);
  });
});

describe('getLeetCodeTotalSolved', () => {
  it('returns the totalSolved from the full payload', async () => {
    globalThis.fetch = gqlOkMulti(
      {
        userProfile: FULL_USER,
        topicStats: EMPTY_TOPIC,
        calendar: EMPTY_CALENDAR,
        contests: EMPTY_CONTESTS,
      },
      null,
    );
    await expect(getLeetCodeTotalSolved()).resolves.toBe(350);
  });

  it('returns 0 on first-call failure', async () => {
    globalThis.fetch = gqlFail(503);
    await expect(getLeetCodeTotalSolved()).resolves.toBe(0);
  });
});