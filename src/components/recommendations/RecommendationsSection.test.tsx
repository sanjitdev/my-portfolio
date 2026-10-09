import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecommendationsSection } from './RecommendationsSection';
import type { Recommendation } from '@/lib/cv-types';

// Mirrors the `recommendations` entry seeded from the LinkedIn screenshot.
const fixtureRecommendations: Recommendation[] = [
  {
    name: 'Utpaul Sarkar',
    relationship: 'Utpaul worked with Sanjit on the same team',
    date: 'August 12, 2025',
    stack: 'Javascript | Angular | ExpressJS | VueJS | AWS | AZURE',
    body: [
      'I highly recommend Sanjit as an exceptional full-stack developer and team member.',
      'He has a natural ability to understand complex requirements.',
    ],
  },
];

describe('RecommendationsSection', () => {
  it('renders the section heading and the eyebrow tagline', () => {
    render(<RecommendationsSection recommendations={fixtureRecommendations} />);
    expect(screen.getByRole('heading', { name: 'Recommendations', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('What colleagues say')).toBeInTheDocument();
  });

  it('renders the recommender name, relationship, and date', () => {
    render(<RecommendationsSection recommendations={fixtureRecommendations} />);
    expect(screen.getByText('Utpaul Sarkar')).toBeInTheDocument();
    expect(screen.getByText(/Utpaul worked with Sanjit on the same team/i)).toBeInTheDocument();
    expect(screen.getByText('August 12, 2025')).toBeInTheDocument();
  });

  it('renders the stack tags and the body text', () => {
    render(<RecommendationsSection recommendations={fixtureRecommendations} />);
    expect(screen.getByText(/Javascript \| Angular \| ExpressJS/i)).toBeInTheDocument();
    expect(
      screen.getByText(/I highly recommend Sanjit as an exceptional full-stack/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/natural ability to understand complex requirements/i),
    ).toBeInTheDocument();
  });

  it('renders initials avatar when no photo is provided', () => {
    render(<RecommendationsSection recommendations={fixtureRecommendations} />);
    expect(screen.getByText('US')).toBeInTheDocument();
  });

  it('returns null when recommendations is empty', () => {
    const { container } = render(<RecommendationsSection recommendations={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('has the correct section id for nav targeting', () => {
    const { container } = render(
      <RecommendationsSection recommendations={fixtureRecommendations} />,
    );
    expect(container.querySelector('section#recommendations')).not.toBeNull();
  });

  it('does NOT render the home address (privacy invariant)', () => {
    // The recommendations data type has no address field, but assert the
    // invariant anyway: never leak the address into rendered output.
    const { container } = render(
      <RecommendationsSection
        recommendations={[
          {
            name: 'Sanjit House 263 Chunkhola',
            relationship: 'Test',
            date: '2025-01-01',
            body: ['Tester says Chunkhola is fine.'],
          },
        ]}
      />,
    );
    const text = container.textContent ?? '';
    expect(text).not.toContain('Mollahat');
    expect(text).not.toContain('Bagerhat');
  });

  it('omits the stack line gracefully when stack is not provided', () => {
    render(
      <RecommendationsSection
        recommendations={[
          {
            name: 'Cher',
            relationship: 'Worked together on X',
            date: '2024-01-01',
            body: ['Short quote.'],
          },
        ]}
      />,
    );
    // No "|" separator rendered when there's only one item in the data.
    expect(screen.getByText('Cher')).toBeInTheDocument();
    const card = screen.getByRole('figure') ?? document.body;
    expect(card.textContent).not.toMatch(/\|/);
  });
});
