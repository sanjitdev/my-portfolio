import { ArrowUpRight } from 'lucide-react';
import { leetcodeProfileUrl } from './constants';

interface LeetCodeCtaProps {
  username: string;
}

/**
 * "View on LeetCode" call-to-action.
 *
 * Opens the public LeetCode profile in a new tab with `rel="noopener noreferrer"`.
 * Uses LeetCode's official brand orange (#ffa116) for the icon to make the
 * destination obvious at a glance. The `aria-label` tells screen readers
 * that the link opens in a new tab.
 */
export function LeetCodeCta({ username }: LeetCodeCtaProps) {
  return (
    <a
      href={leetcodeProfileUrl(username)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View full profile on LeetCode (opens in a new tab)"
      className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-[#ffa116] hover:text-[#ffa116] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#ffa116] dark:hover:text-[#ffa116]"
    >
      <span
        aria-hidden="true"
        className="inline-block h-2 w-2 rounded-full bg-[#ffa116]"
      />
      View full profile on LeetCode
      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}