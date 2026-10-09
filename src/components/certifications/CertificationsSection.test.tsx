import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { CertificationsSection } from './CertificationsSection';
import {
  CERTIFICATION_PROFILE,
  groupCertifications,
  type CertificationCategory,
} from '@/lib/certification-profile';

const fullCertList = CERTIFICATION_PROFILE.map(e => e.name);

describe('CertificationsSection', () => {
  it('renders all certifications', () => {
    render(<CertificationsSection certifications={fullCertList} />);
    expect(screen.getByRole('heading', { name: 'Certifications', level: 2 })).toBeInTheDocument();
    for (const entry of CERTIFICATION_PROFILE) {
      expect(screen.getByText(entry.name)).toBeInTheDocument();
    }
  });

  it('groups certifications by category (Technical / Language / Leadership / Training)', () => {
    render(<CertificationsSection certifications={fullCertList} />);
    // Each category that has at least one entry renders an h3 with the category name.
    for (const cat of [
      'Technical',
      'Language',
      'Leadership',
      'Training',
    ] as CertificationCategory[]) {
      expect(
        screen.getByRole('heading', { name: new RegExp(`^${cat}\\b`, 'i'), level: 3 }),
      ).toBeInTheDocument();
    }
  });

  it('shows a "Stack-relevant" pill on the NopCommerce cert', () => {
    render(<CertificationsSection certifications={fullCertList} />);
    expect(screen.getByText(/stack-relevant/i)).toBeInTheDocument();
  });

  it('shows the EF SET score as a signal under the cert name', () => {
    render(<CertificationsSection certifications={fullCertList} />);
    // The signal text "78/100 · C2 Proficient" is set on the EF SET entry.
    // The same score also appears inside the cert name itself, so use
    // getAllByText and assert at least one match.
    expect(screen.getAllByText(/78\/100/i).length).toBeGreaterThanOrEqual(1);
    // The dedicated signal phrase must be present (it isn't in the cert name).
    expect(screen.getByText(/78\/100 · C2 Proficient/i)).toBeInTheDocument();
  });

  it('renders the category count next to each category eyebrow', () => {
    render(<CertificationsSection certifications={fullCertList} />);
    // Technical: 1 (NopCommerce), Language: 1 (EF SET),
    // Leadership: 2 (Leadership Excellence, ACMP 4.0), Training: 1 (LICT).
    expect(screen.getByText('Technical').textContent).toMatch(/1/);
    expect(screen.getByText('Language').textContent).toMatch(/1/);
    expect(screen.getByText('Leadership').textContent).toMatch(/2/);
    expect(screen.getByText('Training').textContent).toMatch(/1/);
  });

  it('returns null when empty', () => {
    const { container } = render(<CertificationsSection certifications={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when no certifications are recognized in the manifest', () => {
    const { container } = render(<CertificationsSection certifications={['Unrecognized Cert']} />);
    expect(container.firstChild).toBeNull();
  });

  it('has the correct section id', () => {
    const { container } = render(<CertificationsSection certifications={fullCertList} />);
    expect(container.querySelector('section#certifications')).not.toBeNull();
  });

  it('renders each cert inside a list item', () => {
    render(<CertificationsSection certifications={fullCertList} />);
    const items = screen.getAllByRole('listitem');
    // At least one <li> per cert, possibly more for category groups
    // (we use multiple <ul>s, so we get the items collectively).
    expect(items.length).toBeGreaterThanOrEqual(CERTIFICATION_PROFILE.length);
  });

  it('renders the NopCommerce cert in the Technical category group', () => {
    render(<CertificationsSection certifications={fullCertList} />);
    // The Technical category h3 is the ancestor of the NopCommerce card.
    const technicalHeading = screen.getByRole('heading', { name: /^Technical\b/, level: 3 });
    const technicalGroup = technicalHeading.parentElement!;
    expect(within(technicalGroup).getByText('NopCommerce Certified Developer')).toBeInTheDocument();
  });
});

describe('groupCertifications', () => {
  it('drops entries that are not in the CV list', () => {
    const result = groupCertifications(['NopCommerce Certified Developer']);
    const totalEntries = result.reduce((n, g) => n + g.entries.length, 0);
    expect(totalEntries).toBe(1);
    expect(result[0]!.category).toBe('Technical');
  });

  it('returns groups in the canonical display order', () => {
    const result = groupCertifications(fullCertList);
    const order = result.map(g => g.category);
    // Technical → Language → Leadership → Training is the manifest order
    expect(order).toEqual(['Technical', 'Language', 'Leadership', 'Training']);
  });

  it('returns an empty array for an empty CV list', () => {
    expect(groupCertifications([])).toEqual([]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(groupCertifications(['Made Up Cert'])).toEqual([]);
  });
});
