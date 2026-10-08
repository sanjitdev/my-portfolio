import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExperienceSection } from './ExperienceSection';
import type { Experience } from '@/lib/cv-types';

const experiences: Experience[] = [
  {
    company: 'Current Co',
    title: 'Staff Engineer',
    start_date: 'January 2025',
    end_date: 'Present',
    duration: '1 year',
    location: 'Remote',
    responsibilities: ['Latest work.'],
  },
  {
    company: 'Previous Co',
    title: 'Senior Engineer',
    start_date: 'January 2020',
    end_date: 'December 2024',
    duration: '5 years',
    location: 'NY',
    responsibilities: ['Past work.'],
  },
];

describe('ExperienceSection', () => {
  it('renders all entries in the order provided', () => {
    render(<ExperienceSection experiences={experiences} />);
    expect(screen.getByRole('heading', { name: 'Staff Engineer', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Senior Engineer', level: 3 })).toBeInTheDocument();
  });

  it('shows "Present" for ongoing roles', () => {
    render(<ExperienceSection experiences={experiences} />);
    expect(screen.getByText('January 2025 – Present')).toBeInTheDocument();
  });

  it('renders placeholder when empty', () => {
    render(<ExperienceSection experiences={[]} />);
    expect(screen.getByText(/no experience listed/i)).toBeInTheDocument();
  });

  it('has the correct section id', () => {
    const { container } = render(<ExperienceSection experiences={experiences} />);
    expect(container.querySelector('section#experience')).not.toBeNull();
  });
});
