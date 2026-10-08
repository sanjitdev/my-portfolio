import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactSection } from './ContactSection';
import type { PublicContact } from '@/lib/cv-types';

const contact: PublicContact = {
  name: 'Sanjit Majumdar',
  current_title: 'Senior Engineer',
  headline: 'Building cool things',
  location: 'Dhaka',
  phone: '01927025242',
  email: 'sanjit@example.com',
  linkedin: 'www.linkedin.com/in/sanjitmajumdar',
  website: 'sanjit-majumdar.xyz',
};

describe('ContactSection', () => {
  it('renders all 4 contact channels with correct hrefs', () => {
    render(<ContactSection contact={contact} />);
    expect(screen.getByRole('heading', { name: 'Contact', level: 2 })).toBeInTheDocument();

    const mailto = screen.getByRole('link', { name: /email/i });
    expect(mailto.getAttribute('href')).toBe('mailto:sanjit@example.com');

    const tel = screen.getByRole('link', { name: /phone/i });
    expect(tel.getAttribute('href')).toBe('tel:01927025242');

    const linkedin = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedin.getAttribute('href')).toBe('https://www.linkedin.com/in/sanjitmajumdar');
    expect(linkedin.getAttribute('target')).toBe('_blank');
    expect(linkedin.getAttribute('rel')).toBe('noopener noreferrer');

    const website = screen.getByRole('link', { name: /website/i });
    expect(website.getAttribute('href')).toBe('https://sanjit-majumdar.xyz');
    expect(website.getAttribute('target')).toBe('_blank');
    expect(website.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('does NOT render an address (privacy guarantee)', () => {
    const { container } = render(<ContactSection contact={contact} />);
    // The home address string from the source JSON (and any fragments of it)
    // must never appear in the contact section.
    const fullText = container.textContent ?? '';
    expect(fullText).not.toContain('Chunkhola');
    expect(fullText).not.toContain('Mollahat');
    expect(fullText).not.toContain('Bagerhat');
    expect(fullText).not.toMatch(/\d{3}.*House/);
  });

  it('has the correct section id', () => {
    const { container } = render(<ContactSection contact={contact} />);
    expect(container.querySelector('section#contact')).not.toBeNull();
  });
});
