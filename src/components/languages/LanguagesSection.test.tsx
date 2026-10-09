import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { LanguagesSection } from './LanguagesSection';
import type { Language } from '@/lib/cv-types';

const fixtureLanguages: Language[] = [
  { language: 'Bengali', proficiency: 'Native or Bilingual' },
  { language: 'English', proficiency: 'Professional Working' },
  { language: 'Hindi', proficiency: 'Native or Bilingual' },
  { language: 'Japanese', proficiency: 'Elementary' },
];

describe('LanguagesSection', () => {
  it('renders each language with its proficiency', () => {
    render(<LanguagesSection languages={fixtureLanguages} />);
    expect(screen.getByRole('heading', { name: 'Languages', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Bengali', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'English', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Hindi', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Japanese', level: 3 })).toBeInTheDocument();
    // "Native or Bilingual" appears twice (Bengali + Hindi), so use getAllByText.
    expect(screen.getAllByText('Native or Bilingual').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Professional Working')).toBeInTheDocument();
    expect(screen.getByText('Elementary')).toBeInTheDocument();
  });

  it('renders a flag emoji for each known language', () => {
    const { container } = render(<LanguagesSection languages={fixtureLanguages} />);
    const flags = container.querySelectorAll('[aria-label$="flag"]');
    expect(flags.length).toBeGreaterThanOrEqual(4);
    // Emoji rendering depends on the platform font set; in jsdom + vitest the
    // emoji codepoint sequence is preserved even if no glyph is rendered, so
    // we match the codepoints explicitly.
    expect(container.textContent).toContain('🇧🇩');
    expect(container.textContent).toContain('🇬🇧');
    expect(container.textContent).toContain('🇮🇳');
    expect(container.textContent).toContain('🇯🇵');
  });

  it('renders a CEFR badge inferred from proficiency', () => {
    render(<LanguagesSection languages={fixtureLanguages} />);
    // Bengali (Native or Bilingual) → C2
    // English (Professional Working) → B2
    // Hindi (Native or Bilingual) → C2 (matches Bengali, so 2 in DOM)
    // Japanese (Elementary) → A1
    expect(screen.getAllByText('C2').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('B2')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
  });

  it('uses an explicit CEFR code when present in the proficiency string', () => {
    render(<LanguagesSection languages={[{ language: 'French', proficiency: 'C1' }]} />);
    // The proficiency text "C1" and the badge "C1" both appear in the row.
    expect(screen.getAllByText('C1').length).toBeGreaterThanOrEqual(2);
  });

  it('falls back to a globe emoji for unknown languages', () => {
    const { container } = render(
      <LanguagesSection
        languages={[{ language: 'Klingon', proficiency: 'Native or Bilingual' }]}
      />,
    );
    expect(container.textContent).toContain('🌐');
  });

  it('omits the CEFR badge when proficiency does not match any known level', () => {
    const { container } = render(
      <LanguagesSection
        languages={[{ language: 'Esperanto', proficiency: 'Conversational only' }]}
      />,
    );
    // "Conversational only" doesn't match any CEFR keyword → no badge.
    // We check that no A1/A2/B1/B2/C1/C2 text appears within the row.
    const list = screen.getByRole('list');
    const row = within(list).getByRole('listitem');
    expect(row.textContent).not.toMatch(/\b[ABC][12]\b/);
    // Sanity-check we did render the language at all.
    expect(container.textContent).toContain('Esperanto');
  });

  it('renders the 5-dot proficiency bar with an accessible label', () => {
    const { container } = render(<LanguagesSection languages={fixtureLanguages} />);
    // The proficiency bar has role="img" with aria-label "Proficiency: N of 5"
    const bars = container.querySelectorAll('[aria-label^="Proficiency:"]');
    expect(bars.length).toBe(4);
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

  it('does NOT render the home address (privacy invariant)', () => {
    // The Languages section receives `Language[]` which has no address field.
    // The address never reaches this component's props, so it can never appear
    // in the rendered output. We render the fixture and assert no address
    // substring is present anywhere in the section.
    const { container } = render(<LanguagesSection languages={fixtureLanguages} />);
    const text = container.textContent ?? '';
    expect(text).not.toContain('House 263');
    expect(text).not.toContain('Chunkhola');
  });
});
