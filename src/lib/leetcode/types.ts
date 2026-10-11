import { z } from 'zod';

/**
 * Type definitions for the LeetCode stats feature.
 *
 * Source: LeetCode's public GraphQL endpoint at https://leetcode.com/graphql.
 * We do NOT depend on any community wrapper — we hit GraphQL directly with
 * `fetch`, which is built into Next.js and keeps the dependency surface small.
 *
 * Every type is derived from a Zod schema in `./schemas.ts` so the boundary
 * between "what the network returned" and "what the page consumes" is
 * enforced at runtime.
 */

/** Solved-count distribution per difficulty (Easy/Medium/Hard). */
export const LeetCodeProfileSchema = z.object({
  username: z.string(),
  totalSolved: z.number().int().nonnegative(),
  easySolved: z.number().int().nonnegative(),
  mediumSolved: z.number().int().nonnegative(),
  hardSolved: z.number().int().nonnegative(),
  /** Percentage 0–100, rounded to one decimal. */
  acceptanceRate: z.number().min(0).max(100),
  /** Global ranking. `null` if the user opted out. */
  ranking: z.number().int().positive().nullable(),
  contributionPoints: z.number().int().nonnegative(),
});
export type LeetCodeProfile = z.infer<typeof LeetCodeProfileSchema>;

/** Solved count per topic tag. */
export const LeetCodeTopicStatSchema = z.object({
  tagName: z.string(),
  tagSlug: z.string(),
  solvedCount: z.number().int().nonnegative(),
});
export type LeetCodeTopicStat = z.infer<typeof LeetCodeTopicStatSchema>;

/** One day's submission count. */
export const LeetCodeActivityDaySchema = z.object({
  /** ISO date YYYY-MM-DD (no time component). */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  count: z.number().int().nonnegative(),
});
export type LeetCodeActivityDay = z.infer<typeof LeetCodeActivityDaySchema>;

/** Recent activity over a window (default 90 days). */
export const LeetCodeActivitySchema = z.object({
  days: z.array(LeetCodeActivityDaySchema),
  /** Sum of all `count`s in `days`. */
  totalSubmissions: z.number().int().nonnegative(),
});
export type LeetCodeActivity = z.infer<typeof LeetCodeActivitySchema>;

/** Single contest rating snapshot. */
export const LeetCodeContestSchema = z.object({
  contestName: z.string(),
  /** ISO 8601 timestamp. */
  attendedAt: z.string(),
  rating: z.number().int(),
  ranking: z.number().int().positive(),
  /** Top X% as a percentage 0–100, e.g. 4.2 means "Top 4.2%". `null` if unknown. */
  topPercentage: z.number().min(0).max(100).nullable(),
});
export type LeetCodeContest = z.infer<typeof LeetCodeContestSchema>;

/**
 * Aggregate contest information from LeetCode's `userContestRanking`.
 * `null` when the user has opted out of public contest rankings.
 */
export const LeetCodeContestSummarySchema = z.object({
  /** Current LeetCode contest rating. */
  currentRating: z.number().int(),
  /** User's global ranking among all LeetCode contest participants. */
  globalRanking: z.number().int().positive(),
  /** Top X% as a percentage 0–100. `null` if LeetCode didn't report one. */
  topPercentage: z.number().min(0).max(100).nullable(),
  /** How many contests the user has attended. */
  attendedContestsCount: z.number().int().nonnegative(),
  /** LeetCode badge tier name ('Knight' | 'Guardian' | 'Hero'), or `null`. */
  badgeName: z.string().nullable(),
});
export type LeetCodeContestSummary = z.infer<typeof LeetCodeContestSummarySchema>;

/** Highest-level payload returned by the fetcher. ALWAYS safe to render. */
export const LeetCodeFetchResultSchema = z.object({
  profile: LeetCodeProfileSchema,
  topicStats: z.array(LeetCodeTopicStatSchema),
  activity: LeetCodeActivitySchema,
  contests: z.array(LeetCodeContestSchema),
  /** Aggregate contest info. `null` if the user opted out of contest rankings. */
  contestSummary: LeetCodeContestSummarySchema.nullable(),
  /** When the data was last successfully fetched. ISO 8601. */
  fetchedAt: z.string(),
  /** `true` when the fetch failed and we're serving the last-known-good payload. */
  isStale: z.boolean(),
  /** Optional human-readable error message for the banner. Never thrown to caller. */
  error: z.string().optional(),
});
export type LeetCodeFetchResult = z.infer<typeof LeetCodeFetchResultSchema>;

/** LeetCode badge tier thresholds (per LeetCode convention). */
export const LEETCODE_BADGES = [
  { minRating: 3000, name: 'Hero', color: '#f97316' },
  { minRating: 2500, name: 'Guardian', color: '#1d4ed8' },
  { minRating: 2000, name: 'Knight', color: '#7c3aed' },
] as const;

/** Returns the badge name for a rating, or `null` if below the Knight threshold. */
export function badgeForRating(rating: number): string | null {
  for (const tier of LEETCODE_BADGES) {
    if (rating >= tier.minRating) return tier.name;
  }
  return null;
}