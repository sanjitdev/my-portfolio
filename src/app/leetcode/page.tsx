import type { Metadata } from 'next';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { TopNav } from '@/components/nav/TopNav';
import { Footer } from '@/components/layout/Footer';
import { getNavLinks } from '@/components/nav/navLinks';
import { loadCvData } from '@/lib/cv-data';
import { loadProjectsFromMd } from '@/lib/projects-md';
import { getDisplayContact, computeBuildTimestamp } from '@/lib/cv-data';
import { getLeetCodePageData } from '@/lib/leetcode/fetcher';
import { LeetCodeCta } from '@/components/leetcode/LeetCodeCta';
import { StaleDataBanner } from '@/components/leetcode/StaleDataBanner';
import { KpiCards } from '@/components/leetcode/KpiCards';
import { DifficultyChart } from '@/components/leetcode/DifficultyChart';
import { TopicChart } from '@/components/leetcode/TopicChart';
import { ActivityHeatmap } from '@/components/leetcode/ActivityHeatmap';
import { ContestTimeline } from '@/components/leetcode/ContestTimeline';
import { LEETCODE_USERNAME_DEFAULT } from '@/components/leetcode/constants';

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sanjit-dev.vercel.app';
const leetcodeUsername = process.env['LEETCODE_USERNAME'] ?? LEETCODE_USERNAME_DEFAULT;

export const metadata: Metadata = {
  title: `LeetCode Stats – Sanjit Majumdar`,
  description: `Live LeetCode problem-solving statistics for ${leetcodeUsername} — solved count, difficulty distribution, topic strengths, contest rating, and recent activity.`,
  openGraph: {
    type: 'website',
    title: `LeetCode Stats – Sanjit Majumdar`,
    description: `Live LeetCode problem-solving statistics for ${leetcodeUsername}.`,
    url: `${SITE_URL}/leetcode`,
    siteName: `Sanjit Majumdar – Portfolio`,
  },
  twitter: {
    card: 'summary',
    title: `LeetCode Stats – Sanjit Majumdar`,
    description: `Live LeetCode problem-solving statistics for ${leetcodeUsername}.`,
  },
  alternates: { canonical: `${SITE_URL}/leetcode` },
};

export default async function LeetCodePage() {
  const cv = loadCvData();
  const contact = getDisplayContact(cv);
  const projects = loadProjectsFromMd();
  const { primary: navLinks, secondary: navSecondary } = getNavLinks(projects, cv);

  const data = await getLeetCodePageData();

  return (
    <>
      <TopNav links={navLinks} secondary={navSecondary} currentPath="/leetcode" />
      <main>
        <Section
          id="leetcode-top"
          ariaLabelledBy="leetcode-heading"
          divided
          className="relative overflow-hidden"
        >
          <Container className="relative max-w-[1100px]">
            <p className="mb-4 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent-600 before:h-px before:w-8 before:bg-accent-400 before:content-[''] dark:text-accent-400 dark:before:bg-accent-600">
              Problem solving
            </p>
            <h1
              id="leetcode-heading"
              className="mb-4 font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-100"
            >
              LeetCode Stats
            </h1>
            <p className="mb-8 max-w-2xl text-[1.0625rem] leading-relaxed text-slate-600 dark:text-slate-400">
              Live statistics from my LeetCode profile (<span className="font-mono">{leetcodeUsername}</span>) — refreshed every hour.
            </p>

            {data.isStale && <StaleDataBanner error={data.error} fetchedAt={data.fetchedAt} />}

            <div data-testid="leetcode-visualizations" className="space-y-8">
              <KpiCards profile={data.profile} />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <DifficultyChart profile={data.profile} />
                <TopicChart topics={data.topicStats} />
              </div>
              <ContestTimeline
                contests={data.contests}
                summary={data.contestSummary}
              />
              <ActivityHeatmap
                days={data.activity.days}
                totalSubmissions={data.activity.totalSubmissions}
              />
            </div>

            <div className="mt-10">
              <LeetCodeCta username={leetcodeUsername} />
            </div>
          </Container>
        </Section>
      </main>
      <Footer name={contact.name} lastUpdated={computeBuildTimestamp()} />
    </>
  );
}