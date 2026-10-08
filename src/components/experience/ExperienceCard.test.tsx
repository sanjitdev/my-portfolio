import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExperienceCard } from './ExperienceCard';
import type { Experience } from '@/lib/cv-types';

const baseExperience: Experience = {
  company: 'Acme Inc',
  title: 'Senior Engineer',
  start_date: 'January 2024',
  end_date: 'Present',
  duration: '2 years',
  location: 'Remote',
  responsibilities: ['Built the thing.', 'Shipped the other thing.'],
};

describe('ExperienceCard', () => {
  it('renders title, company, date range, duration, location, and responsibilities', () => {
    render(<ExperienceCard experience={baseExperience} />);
    expect(screen.getByRole('heading', { name: 'Senior Engineer', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Acme Inc')).toBeInTheDocument();
    expect(screen.getByText('January 2024 – Present')).toBeInTheDocument();
    expect(screen.getByText('2 years')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText('Built the thing.')).toBeInTheDocument();
    expect(screen.getByText('Shipped the other thing.')).toBeInTheDocument();
  });

  it('formats end date as a specific date when not "Present"', () => {
    render(<ExperienceCard experience={{ ...baseExperience, end_date: 'December 2023' }} />);
    expect(screen.getByText('January 2024 – December 2023')).toBeInTheDocument();
  });

  it('omits the responsibilities list when empty', () => {
    const { container } = render(
      <ExperienceCard experience={{ ...baseExperience, responsibilities: [] }} />,
    );
    expect(container.querySelector('ul')).toBeNull();
  });
});
