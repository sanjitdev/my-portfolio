/**
 * Small formatting helpers used by LeetCode UI components.
 *
 * These are pure functions so they're trivial to unit-test and tree-shake
 * out of the client bundle when only used on the server.
 */

/** "5 minutes ago" / "2 hours ago" / "3 days ago". */
export function formatDistanceToNow(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  if (Number.isNaN(diffMs)) return 'unknown';

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

/** Format an integer with a thousands separator (e.g. 12345 → "12,345"). */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}