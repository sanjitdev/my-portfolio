import { clsx } from 'clsx';

interface SectionEyebrowProps {
  /** The label (e.g., "01 — About"). */
  children: React.ReactNode;
  className?: string;
}

/**
 * Editorial eyebrow text shown above section headings. Renders a short
 * horizontal accent rule + monospaced uppercase label — a magazine-style
 * anchor that frames the section.
 */
export function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  return (
    <p
      className={clsx(
        'mb-4 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent-600 dark:text-accent-400',
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-accent-400/60 dark:bg-accent-600/60" />
      {children}
    </p>
  );
}
