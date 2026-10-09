import { MapPin } from 'lucide-react';
import type { CvData, PublicContact } from '@/lib/cv-types';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Monogram } from '@/components/branding/Monogram';
import { AvailabilityBadge } from '@/components/branding/AvailabilityBadge';
import { HeroQuickActions } from './HeroQuickActions';
import { HeroStats } from './HeroStats';
import { ResumeButton } from '@/components/contact/ResumeButton';

interface HeroSectionProps {
  contact: PublicContact;
  cv: CvData;
}

/**
 * Hero section — the first thing visitors see. Editorial spread:
 *   - Large monogram (left on desktop, top on mobile)
 *   - Location eyebrow, name (h1, Playfair), title (h2), headline
 *   - "Open to opportunities" availability badge
 *   - Quick action row (Resume / Email / LinkedIn / Contact)
 *   - Stats bar (years, companies, technologies, certs)
 *
 * Privacy: receives `PublicContact` (address is unreachable at compile time).
 */
export function HeroSection({ contact, cv }: HeroSectionProps) {
  return (
    <Section id="top" ariaLabelledBy="hero-name" className="hero-backdrop pt-20 sm:pt-24">
      <Container>
        <div className="grid items-start gap-10 sm:grid-cols-[auto_1fr] sm:gap-12">
          {/* Monogram */}
          <div className="flex justify-center sm:justify-start">
            <Monogram size="lg" />
          </div>

          {/* Copy column */}
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-accent-600 dark:text-accent-400">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              {contact.location}
            </p>
            <h1
              id="hero-name"
              className="font-heading text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-100"
            >
              {contact.name}
            </h1>
            <h2 className="mt-3 text-xl font-semibold text-slate-700 sm:text-2xl dark:text-slate-300">
              {contact.current_title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              {contact.headline}
            </p>

            <div className="mt-5">
              <AvailabilityBadge />
            </div>

            <HeroQuickActions contact={contact} resumeButton={<ResumeButton />} />
          </div>
        </div>

        <HeroStats cv={cv} />
      </Container>
    </Section>
  );
}
