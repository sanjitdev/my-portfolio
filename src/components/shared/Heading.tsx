import { clsx } from 'clsx';
import type { ElementType, ReactNode } from 'react';

interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  children: ReactNode;
  className?: string;
}

const sizeClasses: Record<'h1' | 'h2' | 'h3', string> = {
  h1: 'text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight',
  h2: 'text-3xl sm:text-4xl font-bold tracking-tight',
  h3: 'text-xl sm:text-2xl font-semibold',
};

/**
 * Renders an h1/h2/h3 with consistent typography. Default is h2 (for section
 * headings). Use h1 only once per page (in the hero).
 *
 * Editorial Playfair Display is applied via global `h1, h2 { font-family }` rule
 * in globals.css, so we don't need to repeat it here.
 */
export function Heading({ as = 'h2', id, children, className }: HeadingProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      id={id}
      className={clsx('text-slate-900 dark:text-slate-100 mb-8', sizeClasses[as], className)}
    >
      {children}
    </Tag>
  );
}
