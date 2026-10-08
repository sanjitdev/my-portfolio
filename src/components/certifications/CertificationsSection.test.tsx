import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CertificationsSection } from './CertificationsSection';

describe('CertificationsSection', () => {
  it('renders all certifications', () => {
    render(<CertificationsSection certifications={['Cert A', 'Cert B']} />);
    expect(screen.getByRole('heading', { name: 'Certifications', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Cert A')).toBeInTheDocument();
    expect(screen.getByText('Cert B')).toBeInTheDocument();
  });

  it('returns null when empty', () => {
    const { container } = render(<CertificationsSection certifications={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('has the correct section id', () => {
    const { container } = render(<CertificationsSection certifications={['X']} />);
    expect(container.querySelector('section#certifications')).not.toBeNull();
  });
});
