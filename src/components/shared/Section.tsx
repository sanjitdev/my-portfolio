import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  ariaLabelledBy?: string;
  children: ReactNode;
  className?: string;
}

/**
 * A semantic <section> with vertical rhythm and a scroll-margin offset so
 * anchored sections aren't hidden under the sticky nav.
 *
 * Every content section MUST have an `id` so the TopNav can scroll-spy to it.
 * Pass `ariaLabelledBy` to link to the heading's id for screen readers.
 */
export function Section({ id, ariaLabelledBy, children, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={clsx('py-16 sm:py-20 scroll-mt-20', className)}
    >
      {children}
    </section>
  );
}
