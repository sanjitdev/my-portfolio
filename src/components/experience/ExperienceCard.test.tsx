import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
  it('renders title, company, location, and date range', () => {
    render(<ExperienceCard experience={baseExperience} />);
    expect(screen.getByRole('heading', { name: 'Senior Engineer', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Acme Inc')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText('January 2024 – Present')).toBeInTheDocument();
  });

  it('collapses responsibilities by default and shows count', () => {
    render(<ExperienceCard experience={baseExperience} />);
    // Responsibilities are inside a grid-rows-[0fr] container (collapsed).
    const trigger = screen.getByRole('button', { name: /2 responsibilities/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands responsibilities when the toggle is clicked', () => {
    render(<ExperienceCard experience={baseExperience} />);
    const trigger = screen.getByRole('button', { name: /2 responsibilities/i });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Built the thing.')).toBeInTheDocument();
    expect(screen.getByText('Shipped the other thing.')).toBeInTheDocument();
  });

  it('opens by default when defaultExpanded is true', () => {
    render(<ExperienceCard experience={baseExperience} defaultExpanded />);
    const trigger = screen.getByRole('button', { name: /hide details/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Built the thing.')).toBeVisible();
  });

  it('formats end date as a specific date when not "Present"', () => {
    render(<ExperienceCard experience={{ ...baseExperience, end_date: 'December 2023' }} />);
    expect(screen.getByText('January 2024 – December 2023')).toBeInTheDocument();
  });

  it('omits the responsibilities toggle when empty', () => {
    render(<ExperienceCard experience={{ ...baseExperience, responsibilities: [] }} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('list')).toBeNull();
  });
});
