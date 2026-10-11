'use client';

import { CheckCircle2, Target, Trophy, Sparkles } from 'lucide-react';
import { formatNumber } from '@/lib/leetcode/format';
import { useCountUp } from './useCountUp';
import type { LeetCodeProfile } from '@/lib/leetcode/types';

interface KpiCardsProps {
  profile: LeetCodeProfile;
}

/**
 * Four headline KPI tiles for the `/leetcode` page.
 *
 * Layout: 2x2 on mobile, 4x1 on `md:`. The first three tiles animate a
 * count-up from 0; the Contribution Points tile animates too. All tiles
 * gracefully show "—" for the Global Ranking when the user has opted out
 * of public rankings.
 *
 * Pure server-rendered except for the count-up, which lives in a small
 * client hook (`useCountUp`). The SSR HTML contains the final value, so
 * the count-up is a progressive enhancement — visitors with JS disabled
 * or `prefers-reduced-motion: reduce` see the final numbers instantly.
 */
export function KpiCards({ profile }: KpiCardsProps) {
  return (
    <div
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
      role="region"
      aria-label="LeetCode headline statistics"
    >
      <TotalSolvedTile value={profile.totalSolved} />
      <AcceptanceRateTile value={profile.acceptanceRate} />
      <GlobalRankingTile value={profile.ranking} />
      <ContributionPointsTile value={profile.contributionPoints} />
    </div>
  );
}

interface TileProps {
  label: string;
  icon: React.ReactNode;
  ariaLabel: string;
  children: React.ReactNode;
}

function Tile({ label, icon, ariaLabel, children }: TileProps) {
  return (
    <div
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      role="group"
      aria-label={ariaLabel}
    >
      <div className="mb-2 flex items-center gap-2 text-slate-400 dark:text-slate-500">
        {icon}
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}

function TotalSolvedTile({ value }: { value: number }) {
  const animated = useCountUp(value);
  return (
    <Tile
      label="Total Solved"
      icon={<CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
      ariaLabel={`Total Solved: ${formatNumber(value)} problems`}
    >
      <p
        className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100"
        data-testid="kpi-total-solved"
      >
        {formatNumber(animated)}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">problems solved</p>
    </Tile>
  );
}

function AcceptanceRateTile({ value }: { value: number }) {
  const animated = useCountUp(value * 10); // count up in tenths of a percent
  const display = (animated / 10).toFixed(1);
  return (
    <Tile
      label="Acceptance Rate"
      icon={<Target aria-hidden="true" className="h-4 w-4" />}
      ariaLabel={`Acceptance Rate: ${value.toFixed(1)} percent`}
    >
      <p
        className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100"
        data-testid="kpi-acceptance-rate"
      >
        {value > 0 ? `${display}%` : '—'}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">across all submissions</p>
    </Tile>
  );
}

function GlobalRankingTile({ value }: { value: number | null }) {
  // Hooks must run unconditionally — call useCountUp with a 0 fallback
  // when the user has opted out of public rankings, then branch on `value`
  // in the rendered output. The `animated` value is unused in the null case.
  const animated = useCountUp(value ?? 0);
  if (value === null) {
    return (
      <Tile
        label="Global Ranking"
        icon={<Trophy aria-hidden="true" className="h-4 w-4" />}
        ariaLabel="Global Ranking: not available"
      >
        <p
          className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100"
          title="Ranking is hidden by the user on LeetCode"
          data-testid="kpi-global-ranking"
        >
          —
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">not available</p>
      </Tile>
    );
  }
  return (
    <Tile
      label="Global Ranking"
      icon={<Trophy aria-hidden="true" className="h-4 w-4" />}
      ariaLabel={`Global Ranking: number ${formatNumber(value)}`}
    >
      <p
        className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100"
        data-testid="kpi-global-ranking"
      >
        #{formatNumber(animated)}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">worldwide</p>
    </Tile>
  );
}

function ContributionPointsTile({ value }: { value: number }) {
  const animated = useCountUp(value);
  return (
    <Tile
      label="Contribution Points"
      icon={<Sparkles aria-hidden="true" className="h-4 w-4" />}
      ariaLabel={`Contribution Points: ${formatNumber(value)}`}
    >
      <p
        className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100"
        data-testid="kpi-contribution-points"
      >
        {formatNumber(animated)}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">community score</p>
    </Tile>
  );
}
