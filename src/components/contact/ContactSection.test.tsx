import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactSection } from './ContactSection';
import type { PublicContact } from '@/lib/cv-types';

const contact: PublicContact = {
  name: 'Sanjit Majumdar',
  current_title: 'Senior Engineer',
  headline: 'Building cool things',
  location: 'Dhaka, Bangladesh',
  phone: '01927025242',
  email: 'sanjit@example.com',
  linkedin: 'www.linkedin.com/in/sanjitmajumdar',
  website: 'sanjit-majumdar.xyz',
};

describe('ContactSection', () => {
  it('renders the section heading and intro copy', () => {
    render(<ContactSection contact={contact} />);
    expect(screen.getByRole('heading', { name: 'Contact', level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/open to new opportunities/i)).toBeInTheDocument();
  });

  it('renders the four linkable channels with correct hrefs and external-link attributes', () => {
    render(<ContactSection contact={contact} />);

    const email = screen.getByRole('link', { name: /email/i });
    expect(email.getAttribute('href')).toBe('mailto:sanjit@example.com');
    expect(email.getAttribute('target')).toBeNull();

    const phone = screen.getByRole('link', { name: /phone/i });
    expect(phone.getAttribute('href')).toBe('tel:01927025242');
    expect(phone.getAttribute('target')).toBeNull();

    const linkedin = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedin.getAttribute('href')).toBe('https://www.linkedin.com/in/sanjitmajumdar');
    expect(linkedin.getAttribute('target')).toBe('_blank');
    expect(linkedin.getAttribute('rel')).toBe('noopener noreferrer');

    const website = screen.getByRole('link', { name: /website/i });
    expect(website.getAttribute('href')).toBe('https://sanjit-majumdar.xyz');
    expect(website.getAttribute('target')).toBe('_blank');
    expect(website.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('does NOT render a Location row (it was removed in this revision)', () => {
    const { container } = render(<ContactSection contact={contact} />);
    // No data-channel attribute for "location".
    expect(container.querySelector('[data-contact-channel="location"]')).toBeNull();
    // And no link for it either.
    expect(screen.queryByRole('link', { name: /location/i })).toBeNull();
  });

  it('shows an accent kind tag for each channel (EMAIL, PHONE, LINKEDIN, WEBSITE)', () => {
    const { container } = render(<ContactSection contact={contact} />);
    const text = container.textContent ?? '';
    expect(text).toContain('EMAIL');
    expect(text).toContain('PHONE');
    expect(text).toContain('LINKEDIN');
    expect(text).toContain('WEBSITE');
  });

  it('renders the resume callout as the final row, with a print-PDF button', () => {
    render(<ContactSection contact={contact} />);
    expect(screen.getByText(/print or save the page as pdf/i)).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /save resume as pdf/i });
    expect(button).toBeInTheDocument();
  });

  it('does NOT render an address (privacy guarantee)', () => {
    const { container } = render(<ContactSection contact={contact} />);
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
