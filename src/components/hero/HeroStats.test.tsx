import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroStats } from './HeroStats';
import type { CvData } from '@/lib/cv-types';

const cvFixture: CvData = {
  personal_information: {
    name: 'Test',
    current_title: 'Senior Engineer',
    headline: 'Test',
    location: 'Test City',
    phone: '0000000000',
    email: 'test@example.com',
    address: 'private — must not leak',
    linkedin: 'linkedin.com/in/test',
    website: 'test.example.com',
  },
  summary: 'Test summary',
  top_skills: ['TypeScript', 'React', 'Node.js'],
  languages: [{ language: 'English', proficiency: 'Native' }],
  certifications: ['AWS', 'CKA', 'Terraform', 'NopCommerce', 'EF SET'],
  honors_awards: [],
  experience: [
    {
      company: 'Acme',
      title: 'Senior Engineer',
      start_date: 'January 2018',
      end_date: 'Present',
      duration: '8 years',
      location: 'Remote',
      responsibilities: [],
    },
    {
      company: 'Foxtrot',
      title: 'Engineer',
      start_date: 'January 2020',
      end_date: 'December 2022',
      duration: '3 years',
      location: 'Remote',
      responsibilities: [],
    },
  ],
  education: [],
};

describe('HeroStats', () => {
  it('renders an a11y-labeled region', () => {
    render(<HeroStats cv={cvFixture} />);
    expect(screen.getByRole('region', { name: /career at a glance/i })).toBeInTheDocument();
  });

  it('renders the "Career at a glance" eyebrow', () => {
    render(<HeroStats cv={cvFixture} />);
    expect(screen.getByText(/career at a glance/i)).toBeInTheDocument();
  });

  it('renders all four stat labels', () => {
    render(<HeroStats cv={cvFixture} />);
    expect(screen.getByText('Years')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
    expect(screen.getByText('Technologies')).toBeInTheDocument();
    expect(screen.getByText('Certifications')).toBeInTheDocument();
  });

  it('renders years with a "+" suffix (derived from CV)', () => {
    render(<HeroStats cv={cvFixture} />);
    expect(screen.getByText('8+')).toBeInTheDocument();
  });

  it('renders the curated companies value (4)', () => {
    render(<HeroStats cv={cvFixture} />);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders the curated technologies value (5+)', () => {
    render(<HeroStats cv={cvFixture} />);
    expect(screen.getByText('5+')).toBeInTheDocument();
  });

  it('renders the curated certifications value (6)', () => {
    render(<HeroStats cv={cvFixture} />);
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('does NOT render the home address anywhere', () => {
    const { container } = render(<HeroStats cv={cvFixture} />);
    const text = container.textContent ?? '';
    expect(text).not.toContain('private');
    expect(text).not.toContain('must not leak');
  });
});
