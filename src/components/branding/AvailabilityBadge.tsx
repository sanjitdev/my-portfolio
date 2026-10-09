import { clsx } from 'clsx';

interface AvailabilityBadgeProps {
  /** Override the badge text. Default: "Open to opportunities" */
  text?: string;
  className?: string;
}

/**
 * Pill badge with a pulsing green dot — signals current availability
 * (open to opportunities / freelance / contract). Decorative pulse is
 * suppressed under `prefers-reduced-motion` via globals.css media query.
 */
export function AvailabilityBadge({
  text = 'Open to opportunities',
  className,
}: AvailabilityBadgeProps) {
  return (
    <span
      role="status"
      aria-label={text}
      className={clsx(
        'inline-flex items-center gap-2 rounded-full border border-success-200 bg-success-50 px-3 py-1 text-xs font-medium text-success-700',
        'dark:border-success-700/40 dark:bg-success-700/15 dark:text-success-400',
        className,
      )}
    >
      <span aria-hidden="true" className="availability-dot relative inline-flex h-2 w-2">
        <span className="absolute inset-0 inline-flex h-2 w-2 rounded-full bg-success-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success-500" />
      </span>
      {text}
    </span>
  );
}
