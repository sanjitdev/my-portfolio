import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EducationSection } from './EducationSection';
import type { Education } from '@/lib/cv-types';

describe('EducationSection', () => {
  it('renders entries with degree and date range', () => {
    const education: Education[] = [
      {
        institution: 'State University',
        degree: 'B.Sc.',
        field_of_study: 'Computer Science',
        start_date: '2014',
        end_date: '2018',
      },
    ];
    render(<EducationSection education={education} />);
    expect(screen.getByRole('heading', { name: 'Education', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'State University', level: 3 })).toBeInTheDocument();
    expect(screen.getByText(/B\.Sc\./)).toBeInTheDocument();
  });

  it('uses "program" as a fallback label when "degree" is absent', () => {
    const education: Education[] = [
      { institution: 'Online Academy', program: 'ACMP 4.0', field_of_study: 'Business' },
    ];
    render(<EducationSection education={education} />);
    expect(screen.getByText(/ACMP 4\.0/)).toBeInTheDocument();
  });

  it('returns null when the array is empty', () => {
    const { container } = render(<EducationSection education={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('has the correct section id', () => {
    const { container } = render(
      <EducationSection education={[{ institution: 'X', degree: 'B.Sc.' }]} />,
    );
    expect(container.querySelector('section#education')).not.toBeNull();
  });
});
