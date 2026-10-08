import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Centered content container with a max-width and horizontal padding.
 * All content sections should wrap their content in <Container>.
 */
export function Container({ children, className }: ContainerProps) {
  return <div className={clsx('max-w-5xl mx-auto px-6', className)}>{children}</div>;
}
