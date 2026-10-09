import { clsx } from 'clsx';

interface SectionEyebrowProps {
  /** The label (e.g., "01 — About"). */
  children: React.ReactNode;
  className?: string;
}

/**
 * Editorial eyebrow text shown above section headings. Renders in monospaced
 * font with uppercase tracking for a refined, magazine-style look.
 */
export function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  return (
    <p
      className={clsx(
        'mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-600 dark:text-accent-400',
        className,
      )}
    >
      {children}
    </p>
  );
}
