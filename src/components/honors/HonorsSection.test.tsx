import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { HonorsSection } from './HonorsSection';

// Mirrors the current `docs/LinkedIn_CV.json` `honors_awards[]` array.
const fixtureAwards: string[] = [
  'Best Desktop Application',
  'Best Performer 2022 — Brain Station 23',
  'Spot Award — Client Delivery Excellence',
  'Innovation Award — NopCommerce Migration',
];

describe('HonorsSection', () => {
  it('renders the section heading', () => {
    render(<HonorsSection awards={fixtureAwards} />);
    expect(screen.getByRole('heading', { name: /honors/i, level: 2 })).toBeInTheDocument();
  });

  it('renders each award as an h3 with the cleaned award name', () => {
    render(<HonorsSection awards={fixtureAwards} />);
    expect(
      screen.getByRole('heading', { name: 'Best Desktop Application', level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Best Performer', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Spot Award', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Innovation Award', level: 3 })).toBeInTheDocument();
  });

  it('parses and renders the year for awards that include one', () => {
    render(<HonorsSection awards={fixtureAwards} />);
    // Only "Best Performer 2022 — Brain Station 23" has a year.
    expect(screen.getByText('2022')).toBeInTheDocument();
  });

  it('parses and renders the issuer as a caption', () => {
    render(<HonorsSection awards={fixtureAwards} />);
    expect(screen.getByText('Brain Station 23')).toBeInTheDocument();
    expect(screen.getByText('Client Delivery Excellence')).toBeInTheDocument();
    expect(screen.getByText('NopCommerce Migration')).toBeInTheDocument();
  });

  it('falls back to "Internal recognition" for awards with no issuer', () => {
    render(<HonorsSection awards={['Best Desktop Application']} />);
    expect(screen.getByText('Internal recognition')).toBeInTheDocument();
  });

  it('does not render a year tag for awards with no parseable year', () => {
    render(<HonorsSection awards={['Best Desktop Application']} />);
    // No 4-digit year in the string → no year tag.
    expect(screen.queryByText(/^(19|20)\d{2}$/)).toBeNull();
  });

  it('renders one list item per award', () => {
    render(<HonorsSection awards={fixtureAwards} />);
    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(fixtureAwards.length);
  });

  it('returns null when empty', () => {
    const { container } = render(<HonorsSection awards={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('has the correct section id', () => {
    const { container } = render(<HonorsSection awards={['X']} />);
    expect(container.querySelector('section#honors')).not.toBeNull();
  });

  it('does NOT render the home address (privacy invariant)', () => {
    const { container } = render(<HonorsSection awards={fixtureAwards} />);
    const text = container.textContent ?? '';
    expect(text).not.toContain('House 263');
    expect(text).not.toContain('Chunkhola');
  });
});
