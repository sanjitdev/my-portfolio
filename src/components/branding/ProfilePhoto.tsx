import Image from 'next/image';
import { clsx } from 'clsx';

interface ProfilePhotoProps {
  className?: string;
  /** When true, uses priority loading (e.g., hero above the fold). */
  priority?: boolean;
}

/**
 * Profile photo of the candidate, presented as an editorial portrait with
 * a soft accent-tinted backdrop. Replaces the monogram in the hero; the
 * monogram is still used in the TopNav and Footer.
 *
 * Design:
 *  - Soft accent backdrop ring (gradient + 1px accent border) for visual lift
 *  - 1px slate border on the photo itself, subtle shadow, rounded corners
 *  - Responsive via `next/image` (sizes=200px for the hero context)
 *
 * Privacy: this image is the candidate's public profile photo. It does not
 * contain any address or contact details.
 */
export function ProfilePhoto({ className, priority = false }: ProfilePhotoProps) {
  return (
    <div className={clsx('relative inline-block', className)}>
      <div className="relative">
        {/* Soft accent backdrop ring */}
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-accent-200/70 via-accent-100/30 to-transparent blur-md dark:from-accent-800/40 dark:via-accent-900/20"
        />
        <div
          aria-hidden="true"
          className="absolute -inset-1 rounded-2xl border border-accent-300/60 dark:border-accent-700/50"
        />

        <Image
          src="/sanjit_photo-640w.webp"
          alt="Portrait of Sanjit Majumdar"
          width={400}
          height={500}
          sizes="(max-width: 640px) 160px, 200px"
          priority={priority}
          className={clsx(
            'relative h-44 w-36 sm:h-52 sm:w-40 md:h-64 md:w-52',
            'rounded-2xl border border-slate-200 object-cover shadow-lg',
            'dark:border-slate-700',
          )}
        />
      </div>
    </div>
  );
}

