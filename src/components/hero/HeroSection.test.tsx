import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import type { PublicContact } from '@/lib/cv-types';

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

describe('HeroSection', () => {
  it('renders the name as h1, title as h2, and the headline', () => {
    render(<HeroSection contact={contact} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Sanjit Majumdar' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Senior Software Engineer II' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Building scalable systems')).toBeInTheDocument();
  });

  it('renders email, LinkedIn, and website as clickable links', () => {
    render(<HeroSection contact={contact} />);
    expect(screen.getByRole('link', { name: /email/i }).getAttribute('href')).toBe(
      'mailto:sanjit@example.com',
    );
    expect(screen.getByRole('link', { name: /linkedin/i }).getAttribute('href')).toBe(
      'https://www.linkedin.com/in/sanjitmajumdar',
    );
    expect(screen.getByRole('link', { name: /website/i }).getAttribute('href')).toBe(
      'https://sanjit-majumdar.xyz',
    );
  });

  it('renders a "Get in touch" CTA that anchors to the contact section', () => {
    render(<HeroSection contact={contact} />);
    const cta = screen.getByRole('link', { name: /get in touch/i });
    expect(cta.getAttribute('href')).toBe('#contact');
  });

  it('does NOT render a phone link (privacy decision per 004-hero)', () => {
    render(<HeroSection contact={contact} />);
    expect(screen.queryByRole('link', { name: /phone/i })).toBeNull();
  });

  it('does NOT render the home address', () => {
    const { container } = render(<HeroSection contact={contact} />);
    const text = container.textContent ?? '';
    expect(text).not.toContain('Chunkhola');
    expect(text).not.toContain('House 263');
  });

  it('has the correct top section id', () => {
    const { container } = render(<HeroSection contact={contact} />);
    expect(container.querySelector('section#top')).not.toBeNull();
  });
});
