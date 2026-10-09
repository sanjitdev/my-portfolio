import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import type { CvData, PublicContact } from '@/lib/cv-types';

const contact: PublicContact = {
  name: 'Sanjit Majumdar',
  current_title: 'Senior Software Engineer II',
  headline: 'Building scalable systems',
  location: 'Dhaka, Bangladesh',
  phone: '01927025242',
  email: 'sanjit@example.com',
  linkedin: 'www.linkedin.com/in/sanjitmajumdar',
  website: 'sanjit-majumdar.xyz',
};

const cv: CvData = {
  personal_information: {
    ...contact,
    address: 'House 263, Chunkhola, Dhaka',
  },
  summary: 'Test summary',
  top_skills: ['TypeScript', 'React', 'Node.js'],
  languages: [{ language: 'English', proficiency: 'Native' }],
  certifications: ['AWS Solutions Architect'],
  honors_awards: ['Best Engineer 2024'],
  experience: [
    {
      company: 'Acme',
      title: 'Senior Engineer',
      start_date: '2020-01',
      end_date: 'present',
      duration: '5+ years',
      location: 'Remote',
      responsibilities: ['Did things'],
    },
  ],
  education: [{ institution: 'Test University', degree: 'BSc' }],
};

describe('HeroSection', () => {
  it('renders the name as h1, title as h2, and the headline', () => {
    render(<HeroSection contact={contact} cv={cv} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Sanjit Majumdar' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Senior Software Engineer II' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Building scalable systems')).toBeInTheDocument();
  });

  it('renders email and LinkedIn as clickable links', () => {
    render(<HeroSection contact={contact} cv={cv} />);
    expect(screen.getByRole('link', { name: /email/i }).getAttribute('href')).toBe(
      'mailto:sanjit@example.com',
    );
    expect(screen.getByRole('link', { name: /linkedin/i }).getAttribute('href')).toBe(
      'https://www.linkedin.com/in/sanjitmajumdar',
    );
  });

  it('renders a "Get in touch" CTA that anchors to the contact section', () => {
    render(<HeroSection contact={contact} cv={cv} />);
    const cta = screen.getByRole('link', { name: /get in touch/i });
    expect(cta.getAttribute('href')).toBe('#contact');
  });

  it('does NOT render a phone link (privacy decision per 004-hero)', () => {
    render(<HeroSection contact={contact} cv={cv} />);
    expect(screen.queryByRole('link', { name: /phone/i })).toBeNull();
  });

  it('does NOT render the home address', () => {
    const { container } = render(<HeroSection contact={contact} cv={cv} />);
    const text = container.textContent ?? '';
    expect(text).not.toContain('Chunkhola');
    expect(text).not.toContain('House 263');
  });

  it('has the correct top section id', () => {
    const { container } = render(<HeroSection contact={contact} cv={cv} />);
    expect(container.querySelector('section#top')).not.toBeNull();
  });
});
