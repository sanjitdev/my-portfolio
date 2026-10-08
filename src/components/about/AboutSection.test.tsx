import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutSection } from './AboutSection';

describe('AboutSection', () => {
  it('renders the summary as a paragraph', () => {
    render(<AboutSection summary="I design scalable software." />);
    expect(screen.getByRole('heading', { name: 'About', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('I design scalable software.')).toBeInTheDocument();
  });

  it('renders a placeholder when summary is empty', () => {
    render(<AboutSection summary="" />);
    expect(screen.getByText(/summary not provided/i)).toBeInTheDocument();
  });

  it('has the correct section id for nav targeting', () => {
    const { container } = render(<AboutSection summary="x" />);
    const section = container.querySelector('section#about');
    expect(section).not.toBeNull();
  });
});
