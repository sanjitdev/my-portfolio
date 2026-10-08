import { loadCvData, getDisplayContact } from '@/lib/cv-data';
import { HeroSection } from '@/components/hero/HeroSection';
import { AboutSection } from '@/components/about/AboutSection';
import { ExperienceSection } from '@/components/experience/ExperienceSection';
import { SkillsSection } from '@/components/skills/SkillsSection';
import { EducationSection } from '@/components/education/EducationSection';
import { CertificationsSection } from '@/components/certifications/CertificationsSection';
import { LanguagesSection } from '@/components/languages/LanguagesSection';
import { HonorsSection } from '@/components/honors/HonorsSection';
import { ContactSection } from '@/components/contact/ContactSection';

export default function Home() {
  const cv = loadCvData();
  const contact = getDisplayContact(cv);

  return (
    <main>
      <HeroSection contact={contact} />
      <AboutSection summary={cv.summary} />
      <ExperienceSection experiences={cv.experience} />
      <SkillsSection skills={cv.top_skills} />
      <EducationSection education={cv.education} />
      <CertificationsSection certifications={cv.certifications} />
      <LanguagesSection languages={cv.languages} />
      <HonorsSection awards={cv.honors_awards} />
      <ContactSection contact={contact} />
    </main>
  );
}
