'use client';

import { Download } from 'lucide-react';

interface ResumeButtonProps {
  className?: string;
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
export function ResumeButton({ className, children }: ResumeButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ??
        'inline-flex items-center gap-2 rounded-md bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500'
      }
      aria-label="Open print dialog to save resume as PDF"
    >
      <Download aria-hidden="true" className="h-4 w-4" />
      {children ?? 'Download Resume'}
    </button>
  );
}
