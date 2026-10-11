/**
 * Constants shared across the `/leetcode` page and the home-page callout.
 *
 * Centralized so the username and the LeetCode URL stay in lockstep.
 */
export const LEETCODE_USERNAME_DEFAULT = 'sanjit12';
export const LEETCODE_PROFILE_BASE_URL = 'https://leetcode.com';

/** Returns the absolute URL to a LeetCode profile page. */
export function leetcodeProfileUrl(username: string): string {
  return `${LEETCODE_PROFILE_BASE_URL}/${username}/`;
}