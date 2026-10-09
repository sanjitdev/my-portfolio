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

  it('renders the email as a primary CTA card with a mailto href and "Send email" affordance', () => {
    render(<ContactSection contact={contact} />);
    const email = screen.getByRole('link', { name: /sanjit@example\.com/i });
    expect(email.getAttribute('href')).toBe('mailto:sanjit@example.com');
    // The CTA button-style label is inside the same anchor.
    expect(screen.getByText(/send email/i)).toBeInTheDocument();
    // And the email text itself is fully visible (no truncate).
    const emailText = screen.getByText(contact.email);
    expect(emailText).toBeVisible();
    expect(emailText.textContent).toBe(contact.email);
  });

  it('renders the three secondary channels with correct hrefs and external-link attributes', () => {
    render(<ContactSection contact={contact} />);

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

  it('renders the resume callout as a separate row with a print-PDF button', () => {
    const { container } = render(<ContactSection contact={contact} />);
    expect(screen.getByText(/print or save the page as pdf/i)).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /save resume as pdf/i });
    expect(button).toBeInTheDocument();
    // Exactly ONE download icon in the rendered output — ResumeButton already
    // renders its own; the section must not add a second one.
    const svgs = container.querySelectorAll('svg');
    const downloadIconCount = Array.from(svgs).filter(svg => {
      // Lucide download icons render a path containing "M21 15v4" (the box)
      // or a polyline ("7 10 12 15 17 10"). Match either to avoid coupling
      // to the exact path data.
      const inner = svg.innerHTML;
      return /M21 15v4/.test(inner) || /7 10 12 15 17 10/.test(inner);
    }).length;
    expect(downloadIconCount).toBe(1);
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
