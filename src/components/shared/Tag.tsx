import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  className?: string;
}

/**
 * Inline pill / tag — used for skills, certifications, language labels, etc.
 */
export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
        'bg-slate-100 text-slate-700',
        'dark:bg-slate-800 dark:text-slate-300',
        className,
      )}
    >
      {children}
    </span>
  );
}
