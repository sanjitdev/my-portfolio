'use client';

import { useEffect, useState } from 'react';

/**
 * Animates a numeric value from 0 to `target` over `durationMs` on mount.
 *
 * - SSR: returns `target` so the rendered HTML contains the final value
 *   (no hydration mismatch).
 * - On client mount: resets to 0 and animates up via requestAnimationFrame
 *   using an ease-out cubic curve.
 * - Honors `prefers-reduced-motion: reduce` — skips the animation and
 *   returns the target immediately.
 *
 * The hook is intentionally tiny (no dependencies) so it adds nothing to
 * the client bundle beyond its own code.
 */
export function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState<number>(target);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}
