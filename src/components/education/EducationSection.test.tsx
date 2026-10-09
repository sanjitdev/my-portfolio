import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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
    expect(screen.getByRole('heading', { name: 'B.Sc.', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('State University')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
  });

  it('classifies a "degree" entry with the Bachelor\'s eyebrow', () => {
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
    expect(screen.getByText(/bachelor'?s degree/i)).toBeInTheDocument();
  });

  it('classifies a "program" entry with the Certificate eyebrow', () => {
    const education: Education[] = [
      { institution: 'Online Academy', program: 'ACMP 4.0', field_of_study: 'Business' },
    ];
    render(<EducationSection education={education} />);
    expect(screen.getByText(/certificate program/i)).toBeInTheDocument();
    expect(screen.getByText('ACMP 4.0')).toBeInTheDocument();
  });

  it('renders the timeline rail (decorative)', () => {
    const education: Education[] = [
      {
        institution: 'X',
        degree: 'B.Sc.',
        start_date: '2014',
        end_date: '2018',
      },
    ];
    const { container } = render(<EducationSection education={education} />);
    const rail = container.querySelector('[aria-hidden="true"]');
    expect(rail).not.toBeNull();
  });

  it('renders the date column on desktop (year + year)', () => {
    const education: Education[] = [
      {
        institution: 'X',
        degree: 'B.Sc.',
        start_date: '2014',
        end_date: '2018',
      },
    ];
    render(<EducationSection education={education} />);
    // The date rail uses two stacked year labels (desktop-only block).
    const dates = screen.getAllByText(/^201[48]$/);
    expect(dates.length).toBeGreaterThanOrEqual(2);
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

  it('renders multiple entries in the order provided', () => {
    const education: Education[] = [
      {
        institution: 'A University',
        degree: 'B.Sc.',
        field_of_study: 'CS',
        start_date: '2014',
        end_date: '2018',
      },
      {
        institution: 'B Academy',
        program: 'ACMP 4.0',
        field_of_study: 'Biz',
        start_date: '2023',
        end_date: '2023',
      },
    ];
    render(<EducationSection education={education} />);
    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    // First entry's institution appears before the second's in DOM order.
    expect(within(items[0]!).getByText('A University')).toBeInTheDocument();
    expect(within(items[1]!).getByText('B Academy')).toBeInTheDocument();
  });
});
