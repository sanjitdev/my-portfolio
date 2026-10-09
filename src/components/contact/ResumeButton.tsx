'use client';

import { clsx } from 'clsx';
import { ScrollText } from 'lucide-react';

interface ResumeButtonProps {
  /**
   * Visual treatment. `'primary'` is the eye-catching CTA used in the hero
   * — large, accent-coloured, with a left icon tile and a hover lift.
   * `'secondary'` is the low-key action used in the contact section —
   * bordered, neutral, sits in line with other rows.
   */
  variant?: 'primary' | 'secondary';
  /** Optional override for the button's outer class. */
  className?: string;
  /** Optional override for the label text (e.g. "Download Resume"). */
  children?: React.ReactNode;
}

/**
 * Renders a button that triggers the browser's native print dialog. The
 * accompanying @media print block in globals.css hides nav/footer and
 * reflows the page into a clean A4 resume layout. Users then choose
 * "Save as PDF" in the print dialog.
 *
 * No new dependencies — uses window.print().
 */
export function ResumeButton({ variant = 'primary', className, children }: ResumeButtonProps) {
  const isPrimary = variant === 'primary';

  // Shared structure: [icon tile | label + sublabel]. The sublabel makes the
  // primary variant read as "a real resume card" rather than a flat button.
  const label = children ?? (isPrimary ? 'Resume' : 'Download Resume');
  const sublabel = isPrimary ? 'PDF' : null;

  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label="Open print dialog to save resume as PDF"
      className={clsx(
        'group inline-flex cursor-pointer items-stretch overflow-hidden rounded-lg font-semibold shadow-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 print-hidden',
        isPrimary
          ? // Primary: solid accent surface, lifts and brightens on hover,
            //   grows a subtle accent ring. The icon tile has its own
            //   inset background so the icon reads even at small sizes.
            'border border-accent-700 bg-accent-600 text-white hover:-translate-y-0.5 hover:bg-accent-700 hover:shadow-md active:translate-y-0'
          : // Secondary: neutral, sits quietly in a row of other actions.
            'border border-slate-300 bg-white text-slate-800 hover:border-accent-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700',
        isPrimary ? 'text-sm' : 'text-sm',
        className,
      )}
    >
      {/* Icon tile — square, slightly darker than the rest of the button so
          the icon reads as a separate UI element. */}
      <span
        aria-hidden="true"
        className={clsx(
          'flex shrink-0 items-center justify-center',
          isPrimary
            ? 'bg-accent-700/60 px-3 py-2.5 group-hover:bg-accent-800/60'
            : 'border-r border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/60',
        )}
      >
        <ScrollText className="h-4 w-4" />
      </span>

      {/* Label + optional sublabel stack. */}
      <span
        className={clsx(
          'flex flex-col items-start justify-center px-4',
          isPrimary ? 'py-2.5' : 'py-2',
        )}
      >
        <span className="leading-none">{label}</span>
        {sublabel ? (
          <span className="mt-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-accent-100">
            {sublabel}
          </span>
        ) : null}
      </span>
    </button>
  );
}
