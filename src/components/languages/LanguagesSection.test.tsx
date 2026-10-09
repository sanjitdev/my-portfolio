import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguagesSection } from './LanguagesSection';
import type { Language } from '@/lib/cv-types';

describe('LanguagesSection', () => {
  it('renders each language with its proficiency', () => {
    const languages: Language[] = [
      { language: 'English', proficiency: 'Native' },
      { language: 'Spanish', proficiency: 'B2' },
    ];
    render(<LanguagesSection languages={languages} />);
    expect(screen.getByRole('heading', { name: 'Languages', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
    expect(screen.getByText('Native')).toBeInTheDocument();
    expect(screen.getByText('B2')).toBeInTheDocument();
  });

  it('returns null when empty', () => {
    const { container } = render(<LanguagesSection languages={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('has the correct section id', () => {
    const { container } = render(
      <LanguagesSection languages={[{ language: 'X', proficiency: 'Y' }]} />,
    );
    expect(container.querySelector('section#languages')).not.toBeNull();
  });
});
