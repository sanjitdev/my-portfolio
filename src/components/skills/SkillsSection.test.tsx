import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillsSection } from './SkillsSection';

describe('SkillsSection', () => {
  it('renders all skills as tags', () => {
    render(<SkillsSection skills={['TypeScript', 'React', 'C#']} />);
    expect(screen.getByRole('heading', { name: 'Skills', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('C#')).toBeInTheDocument();
  });

  it('renders placeholder when no skills', () => {
    render(<SkillsSection skills={[]} />);
    expect(screen.getByRole('heading', { name: 'Skills', level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/no skills listed/i)).toBeInTheDocument();
  });

  it('has the correct section id', () => {
    const { container } = render(<SkillsSection skills={['X']} />);
    expect(container.querySelector('section#skills')).not.toBeNull();
  });
});
