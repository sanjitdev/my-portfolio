import { loadCvData, getDisplayContact, computeBuildTimestamp } from '@/lib/cv-data';
import { loadProjectsFromMd } from '@/lib/projects-md';
import { TopNav } from '@/components/nav/TopNav';
import { getNavLinks } from '@/components/nav/navLinks';
import { HeroSection } from '@/components/hero/HeroSection';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { AboutSection } from '@/components/about/AboutSection';
import { ExperienceSection } from '@/components/experience/ExperienceSection';
import { SkillsSection } from '@/components/skills/SkillsSection';
import { EducationSection } from '@/components/education/EducationSection';
import { CertificationsSection } from '@/components/certifications/CertificationsSection';
import { LanguagesSection } from '@/components/languages/LanguagesSection';
import { HonorsSection } from '@/components/honors/HonorsSection';
import { RecommendationsSection } from '@/components/recommendations/RecommendationsSection';
import { ContactSection } from '@/components/contact/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { LeetCodeCallout } from '@/components/home/leetcode-callout';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { getLeetCodePageData } from '@/lib/leetcode/fetcher';

export default async function Home() {
  const cv = loadCvData();
  const contact = getDisplayContact(cv);
  const projects = loadProjectsFromMd();
  const { primary: navLinks, secondary: navSecondary } = getNavLinks(projects, cv);
  const leetcodeData = await getLeetCodePageData();

  return (
    <>
      <TopNav links={navLinks} secondary={navSecondary} />
      <main>
        <HeroSection contact={contact} cv={cv} />
        <AboutSection summary={cv.summary} />
        <ExperienceSection experiences={cv.experience} />
        <ProjectsSection projects={projects} />
        <SkillsSection cv={cv} />
        <Section id="leetcode-callout" ariaLabelledBy="leetcode-callout-heading" divided>
          <Container className="max-w-[1100px]">
            <h2 id="leetcode-callout-heading" className="sr-only">
              LeetCode stats preview
            </h2>
            <LeetCodeCallout data={leetcodeData} />
          </Container>
        </Section>
        <EducationSection education={cv.education} />
        <CertificationsSection certifications={cv.certifications} />
        <LanguagesSection languages={cv.languages} />
        <HonorsSection awards={cv.honors_awards} />
        <RecommendationsSection recommendations={cv.recommendations} />
        <ContactSection contact={contact} />
      </main>
      <Footer name={contact.name} lastUpdated={computeBuildTimestamp()} />
    </>
  );
}
