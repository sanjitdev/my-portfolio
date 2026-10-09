import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /**
   * Narrow the max-width to max-w-3xl (~768px). Useful for long-form text
   * (about section) where you want a comfortable reading measure.
   * Default is max-w-5xl (~1024px).
   */
  narrow?: boolean;
}

/**
 * Centered content container with a max-width and horizontal padding.
 * All content sections should wrap their content in <Container>.
 */
export function Container({ children, className, narrow = false }: ContainerProps) {
  return (
    <div className={clsx('mx-auto px-6', narrow ? 'max-w-3xl' : 'max-w-5xl', className)}>
      {children}
    </div>
  );
}
