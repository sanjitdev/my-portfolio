import { clsx } from 'clsx';

interface MonogramProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Optional accessible label override. Default: "Sanjit Majumdar" */
  label?: string;
}

const sizeMap = {
  sm: { box: 32, font: 13, stroke: 1.5 },
  md: { box: 48, font: 18, stroke: 2 },
  lg: { box: 96, font: 36, stroke: 3 },
} as const;

/**
 * SM monogram — a circle with two overlapping initials, rendered as pure SVG.
 * Uses `currentColor` so it inherits text color (works with light/dark themes
 * automatically) and an accent-colored highlight on the second letter.
 *
 * Used in:
 *  - Hero (lg)
 *  - TopNav (sm)
 *  - Footer (sm)
 *  - favicon (public/icon.svg mirrors these paths)
 */
export function Monogram({ size = 'md', className, label = 'Sanjit Majumdar' }: MonogramProps) {
  const { box, font, stroke } = sizeMap[size];

  return (
    <svg
      role="img"
      aria-label={label}
      width={box}
      height={box}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('flex-shrink-0', className)}
    >
      <title>{label}</title>
      <defs>
        <linearGradient id="monogram-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="url(#monogram-bg)"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth={stroke}
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-heading), Georgia, serif"
        fontWeight="700"
        fontSize={font * 1.8}
        fill="currentColor"
        letterSpacing="-1"
      >
        SM
      </text>
      <circle cx="78" cy="78" r="6" fill="var(--color-accent-500, currentColor)" opacity="0.9" />
    </svg>
  );
}
