import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the name', () => {
    render(<Footer name="Sanjit Majumdar" lastUpdated="2026-10-08T15:30:00.000Z" />);
    expect(screen.getByText(/Sanjit Majumdar/)).toBeInTheDocument();
  });

  it('formats the ISO date as a human-readable date', () => {
    render(<Footer name="X" lastUpdated="2026-10-08T15:30:00.000Z" />);
    expect(screen.getByText(/October 8, 2026/)).toBeInTheDocument();
  });

  it('renders the current year in the copyright', () => {
    render(<Footer name="X" lastUpdated="2026-10-08T15:30:00.000Z" />);
    expect(screen.getByText(/© 2026/)).toBeInTheDocument();
  });

  it('uses <footer> element', () => {
    const { container } = render(<Footer name="X" lastUpdated="2026-10-08T15:30:00.000Z" />);
    expect(container.querySelector('footer')).not.toBeNull();
  });
});
