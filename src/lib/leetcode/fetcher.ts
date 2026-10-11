/**
 * LeetCode stats fetcher.
 *
 * Server-side only — never import this file from a Client Component.
 * Calls LeetCode's public GraphQL endpoint at https://leetcode.com/graphql
 * using `fetch` (built-in to Next.js / Bun runtime).
 *
 * Contract guarantees:
 * - NEVER throws. Returns a `LeetCodeFetchResult` on any failure.
 * - On network error / rate-limit: returns the last-known-good payload
 *   (kept in a module-level variable) with `isStale: true`. On the first
 *   error with no prior success, returns a zeroed profile with `isStale: true`.
 * - Reads `LEETCODE_USERNAME` env var; defaults to `sanjit12`.
 */

import {
  LeetCodeFetchResultSchema,
  badgeForRating,
  type LeetCodeFetchResult,
  type LeetCodeProfile,
  type LeetCodeTopicStat,
  type LeetCodeActivityDay,
  type LeetCodeContest,
  type LeetCodeContestSummary,
} from './types';

const LEETCODE_USERNAME_DEFAULT = 'sanjit12';
const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';
/** Fetch timeout: 6s — must be < ISR's revalidate budget on Vercel. */
const FETCH_TIMEOUT_MS = 6_000;
/** Activity window in days (Bolt 005 may also use this). */
const ACTIVITY_WINDOW_DAYS = 90;
/** Hard cap on contest history length. */
const CONTEST_LIMIT = 20;

/**
 * Module-level last-known-good cache. Per server instance only — does not
 * survive a cold start, but does survive consecutive ISR regenerations on
 * the same instance. Vercel's ISR cache itself provides the durable layer.
 *
 * Exposed via `__resetLeetCodeCacheForTests` so unit tests can isolate
 * themselves; the production code path never touches the reset.
 */
let lastKnownGood: LeetCodeFetchResult | null = null;

export function __resetLeetCodeCacheForTests(): void {
  lastKnownGood = null;
}

/** Build the empty/zero fallback for first-call errors. */
function emptyResult(error?: string): LeetCodeFetchResult {
  const fallback: LeetCodeFetchResult = {
    profile: {
      username: process.env['LEETCODE_USERNAME'] ?? LEETCODE_USERNAME_DEFAULT,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      acceptanceRate: 0,
      ranking: null,
      contributionPoints: 0,
    },
    topicStats: [],
    activity: { days: [], totalSubmissions: 0 },
    contests: [],
    contestSummary: null,
    fetchedAt: new Date().toISOString(),
    isStale: true,
    error,
  };
  return LeetCodeFetchResultSchema.parse(fallback);
}

/**
 * Top-level data loader used by the `/leetcode` page and the home callout.
 *
 * This is the only function the rest of the app should call.
 */
export async function getLeetCodePageData(): Promise<LeetCodeFetchResult> {
  const username = process.env['LEETCODE_USERNAME'] ?? LEETCODE_USERNAME_DEFAULT;

  try {
    const [profileRaw, topicStatsRaw, activityRaw, contestsRaw] = await Promise.all([
      fetchLeetCodeProfile(username),
      fetchLeetCodeTopicStats(username),
      fetchLeetCodeCalendar(username),
      fetchLeetCodeContests(username),
    ]);

    const result: LeetCodeFetchResult = LeetCodeFetchResultSchema.parse({
      profile: profileRaw,
      topicStats: topicStatsRaw,
      activity: activityRaw,
      contests: contestsRaw.contests,
      contestSummary: contestsRaw.summary,
      fetchedAt: new Date().toISOString(),
      isStale: false,
    });

    lastKnownGood = result;
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown LeetCode fetch error';
    // eslint-disable-next-line no-console
    console.warn('[leetcode] fetch failed, serving fallback:', message);

    if (lastKnownGood) {
      return {
        ...lastKnownGood,
        fetchedAt: lastKnownGood.fetchedAt, // preserve original timestamp
        isStale: true,
        error: message,
      };
    }
    return emptyResult(message);
  }
}

/**
 * Lightweight variant for the home-page callout. Returns only the headline
 * number (`totalSolved`). If a last-known-good exists, returns its value;
 * otherwise returns 0 (and the callout renders without a number).
 */
export async function getLeetCodeTotalSolved(): Promise<number> {
  const data = await getLeetCodePageData();
  return data.profile.totalSolved;
}

// ---------------------------------------------------------------------------
// GraphQL queries + helpers
// ---------------------------------------------------------------------------

interface GqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      // LeetCode's GraphQL endpoint enforces CSRF protection: it requires
      // a Referer header from the leetcode.com origin. Without these,
      // the request returns HTTP 403 ("CSRF verification failed"). The
      // browser sends these automatically when a user hits the page; in a
      // server-side fetch we have to set them ourselves.
      Referer: 'https://leetcode.com/',
      Origin: 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0 (compatible; my-portfolio/1.0; +https://sanjit-dev.vercel.app)',
    };

    const res = await fetch(LEETCODE_GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
      // Honor the page-level ISR revalidate window. The fetch itself is
      // cached for up to 3600s, so when Next.js regenerates `/leetcode`
      // every hour, all 4 GraphQL queries are served from this same cache
      // — keeping LeetCode's load tiny.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`LeetCode HTTP ${res.status}`);
    }
    const json = (await res.json()) as GqlResponse<T>;
    if (json.errors && json.errors.length > 0) {
      throw new Error(`LeetCode GraphQL: ${json.errors[0]?.message ?? 'unknown'}`);
    }
    if (!json.data) {
      throw new Error('LeetCode GraphQL: empty response');
    }
    return json.data;
  } finally {
    clearTimeout(timer);
  }
}

const PROFILE_QUERY = /* GraphQL */ `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
        totalSubmissionNum {
          difficulty
          count
        }
      }
      profile {
        ranking
        reputation
      }
    }
  }
`;

interface RawProfileResponse {
  matchedUser: {
    username: string;
    submitStatsGlobal: {
      acSubmissionNum: Array<{ difficulty: string; count: number; submissions: number }>;
      totalSubmissionNum: Array<{ difficulty: string; count: number; submissions: number }>;
    };
    profile: { ranking: number | null; reputation: number };
  } | null;
}

async function fetchLeetCodeProfile(username: string): Promise<LeetCodeProfile> {
  const data = await gql<RawProfileResponse>(PROFILE_QUERY, { username });
  if (!data.matchedUser) {
    throw new Error(`LeetCode user "${username}" not found`);
  }
  const u = data.matchedUser;

  const ac = byDifficulty(u.submitStatsGlobal.acSubmissionNum);
  const total = bySubmissions(u.submitStatsGlobal.totalSubmissionNum);

  const totalSolved = ac.easy + ac.medium + ac.hard;
  const totalAttempts = total.easy + total.medium + total.hard;
  const acceptanceRate = totalAttempts > 0 ? (totalSolved / totalAttempts) * 100 : 0;

  return {
    username: u.username,
    totalSolved,
    easySolved: ac.easy,
    mediumSolved: ac.medium,
    hardSolved: ac.hard,
    acceptanceRate: Math.round(acceptanceRate * 10) / 10,
    ranking: u.profile.ranking,
    contributionPoints: u.profile.reputation,
  };
}

/** Helper: index a difficulty-keyed array into named fields. */
function byDifficulty(
  arr: ReadonlyArray<{ difficulty: string; count: number }>,
): { easy: number; medium: number; hard: number } {
  let easy = 0;
  let medium = 0;
  let hard = 0;
  for (const row of arr) {
    const d = row.difficulty.toLowerCase();
    if (d === 'easy') easy = row.count;
    else if (d === 'medium') medium = row.count;
    else if (d === 'hard') hard = row.count;
  }
  return { easy, medium, hard };
}

/** Same as `byDifficulty` but reads the `submissions` field instead of `count`. */
function bySubmissions(
  arr: ReadonlyArray<{ difficulty: string; submissions: number }>,
): { easy: number; medium: number; hard: number } {
  let easy = 0;
  let medium = 0;
  let hard = 0;
  for (const row of arr) {
    const d = row.difficulty.toLowerCase();
    if (d === 'easy') easy = row.submissions;
    else if (d === 'medium') medium = row.submissions;
    else if (d === 'hard') hard = row.submissions;
  }
  return { easy, medium, hard };
}

const TOPIC_QUERY = /* GraphQL */ `
  query topicStats($username: String!) {
    matchedUser(username: $username) {
      tagProblemCounts {
        advanced { tagName tagSlug problemsSolved }
        intermediate { tagName tagSlug problemsSolved }
        fundamental { tagName tagSlug problemsSolved }
      }
    }
  }
`;

interface RawTopicResponse {
  matchedUser: {
    tagProblemCounts: {
      advanced: Array<{ tagName: string; tagSlug: string; problemsSolved: number }>;
      intermediate: Array<{ tagName: string; tagSlug: string; problemsSolved: number }>;
      fundamental: Array<{ tagName: string; tagSlug: string; problemsSolved: number }>;
    };
  } | null;
}

async function fetchLeetCodeTopicStats(username: string): Promise<LeetCodeTopicStat[]> {
  const data = await gql<RawTopicResponse>(TOPIC_QUERY, { username });
  if (!data.matchedUser) return [];

  const merged = new Map<string, LeetCodeTopicStat>();
  for (const group of [
    data.matchedUser.tagProblemCounts.advanced,
    data.matchedUser.tagProblemCounts.intermediate,
    data.matchedUser.tagProblemCounts.fundamental,
  ]) {
    for (const t of group) {
      const existing = merged.get(t.tagSlug);
      merged.set(t.tagSlug, {
        tagName: t.tagName,
        tagSlug: t.tagSlug,
        solvedCount: (existing?.solvedCount ?? 0) + t.problemsSolved,
      });
    }
  }

  return Array.from(merged.values()).sort((a, b) => b.solvedCount - a.solvedCount);
}

const CALENDAR_QUERY = /* GraphQL */ `
  query calendar($username: String!, $year: Int!) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

interface RawCalendarResponse {
  matchedUser: {
    userCalendar: {
      activeYears: number[];
      streak: number;
      totalActiveDays: number;
      /** JSON string: `{ "YYYY-MM-DD": count, ... }` (Unix timestamps). */
      submissionCalendar: string;
    };
  } | null;
}

async function fetchLeetCodeCalendar(username: string): Promise<{
  days: LeetCodeActivityDay[];
  totalSubmissions: number;
}> {
  const now = new Date();
  const data = await gql<RawCalendarResponse>(CALENDAR_QUERY, {
    username,
    year: now.getUTCFullYear(),
  });
  if (!data.matchedUser) {
    return { days: [], totalSubmissions: 0 };
  }

  const cal = data.matchedUser.userCalendar;
  let raw: Record<string, number> = {};
  try {
    raw = JSON.parse(cal.submissionCalendar) as Record<string, number>;
  } catch {
    raw = {};
  }

  // LeetCode encodes submissionCalendar with Unix timestamps (seconds).
  const days: LeetCodeActivityDay[] = [];
  const windowStart = new Date(now);
  windowStart.setUTCDate(windowStart.getUTCDate() - ACTIVITY_WINDOW_DAYS + 1);
  windowStart.setUTCHours(0, 0, 0, 0);

  let totalSubmissions = 0;
  for (const [unixSeconds, count] of Object.entries(raw)) {
    const ts = Number(unixSeconds) * 1000;
    const d = new Date(ts);
    if (d < windowStart) continue;
    const iso = d.toISOString().slice(0, 10);
    days.push({ date: iso, count });
    totalSubmissions += count;
  }

  // Fill in missing days with zeros so the heatmap has a continuous 90-day grid.
  const byDateMap = new Map(days.map(d => [d.date, d.count]));
  const filled: LeetCodeActivityDay[] = [];
  for (let i = 0; i < ACTIVITY_WINDOW_DAYS; i++) {
    const d = new Date(windowStart);
    d.setUTCDate(windowStart.getUTCDate() + i);
    const iso = d.toISOString().slice(0, 10);
    filled.push({ date: iso, count: byDateMap.get(iso) ?? 0 });
  }
  filled.sort((a, b) => a.date.localeCompare(b.date));

  return { days: filled, totalSubmissions };
}

const CONTEST_QUERY = /* GraphQL */ `
  query contests($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      topPercentage
    }
    userContestRankingHistory(username: $username) {
      contest {
        title
        startTime
      }
      rating
      ranking
    }
  }
`;

interface RawContestResponse {
  userContestRanking: {
    attendedContestsCount: number;
    rating: number;
    globalRanking: number;
    topPercentage: number;
  } | null;
  userContestRankingHistory: Array<{
    contest: { title: string; startTime: number };
    rating: number;
    ranking: number;
  }>;
}

async function fetchLeetCodeContests(
  username: string,
): Promise<{ contests: LeetCodeContest[]; summary: LeetCodeContestSummary | null }> {
  const data = await gql<RawContestResponse>(CONTEST_QUERY, { username });
  if (!data.userContestRanking) {
    return { contests: [], summary: null };
  }

  // The history no longer reports topPercentage per-contest — leave it null
  // on each row; the aggregate topPercentage on the summary is the source
  // of truth for the "Top X% globally" line.
  const history = (data.userContestRankingHistory ?? [])
    .slice(-CONTEST_LIMIT)
    .map<LeetCodeContest>(row => ({
      contestName: row.contest.title,
      attendedAt: new Date(row.contest.startTime * 1000).toISOString(),
      rating: row.rating,
      ranking: row.ranking,
      topPercentage: null,
    }));

  const r = data.userContestRanking;
  // LeetCode's API dropped the `contestBadge` field. Derive the badge tier
  // from the current rating using the same thresholds LeetCode uses:
  //   2000+ = Knight, 2500+ = Guardian, 3000+ = Hero.
  const summary: LeetCodeContestSummary = {
    currentRating: r.rating,
    globalRanking: r.globalRanking,
    topPercentage: r.topPercentage > 0 ? r.topPercentage : null,
    attendedContestsCount: r.attendedContestsCount,
    badgeName: badgeForRating(r.rating),
  };

  return { contests: history, summary };
}