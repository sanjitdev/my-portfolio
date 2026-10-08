import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Bordered card surface with subtle shadow. Used for experience entries,
 * education entries, and any grouped content.
 */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg border p-6 shadow-sm transition-shadow',
        'border-slate-200 bg-white',
        'dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      {children}
    </div>
  );
}
