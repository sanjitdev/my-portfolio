import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HonorsSection } from './HonorsSection';

describe('HonorsSection', () => {
  it('renders all awards', () => {
    render(<HonorsSection awards={['Best Engineer 2024', 'Open Source Award']} />);
    expect(screen.getByRole('heading', { name: /honors/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Best Engineer 2024')).toBeInTheDocument();
    expect(screen.getByText('Open Source Award')).toBeInTheDocument();
  });

  it('returns null when empty', () => {
    const { container } = render(<HonorsSection awards={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('has the correct section id', () => {
    const { container } = render(<HonorsSection awards={['X']} />);
    expect(container.querySelector('section#honors')).not.toBeNull();
  });
});
