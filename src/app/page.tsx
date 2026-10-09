import { loadCvData, getDisplayContact, computeBuildTimestamp } from '@/lib/cv-data';
import { TopNav } from '@/components/nav/TopNav';
import { getNavLinks } from '@/components/nav/navLinks';
import { HeroSection } from '@/components/hero/HeroSection';
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

export default function Home() {
  const cv = loadCvData();
  const contact = getDisplayContact(cv);
  const navLinks = getNavLinks(cv);

  return (
    <>
      <TopNav links={navLinks} />
      <main>
        <HeroSection contact={contact} cv={cv} />
        <AboutSection summary={cv.summary} />
        <ExperienceSection experiences={cv.experience} />
        <SkillsSection cv={cv} />
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
