import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResumeButton } from './ResumeButton';

describe('ResumeButton', () => {
  it('renders a button with a print-PDF aria label', () => {
    render(<ResumeButton />);
    expect(screen.getByRole('button', { name: /save resume as pdf/i })).toBeInTheDocument();
  });

  it('renders exactly one icon (no double-icon regression)', () => {
    const { container } = render(<ResumeButton />);
    const button = screen.getByRole('button', { name: /save resume as pdf/i });
    expect(button.querySelectorAll('svg')).toHaveLength(1);
  });

  it('primary variant shows the "Resume" label and a "PDF" sublabel', () => {
    render(<ResumeButton variant="primary" />);
    // The button's accessible name is the aria-label, so we read the text
    // content directly to assert both lines render.
    const button = screen.getByRole('button', { name: /save resume as pdf/i });
    expect(button.textContent).toContain('Resume');
    expect(button.textContent).toContain('PDF');
  });

  it('secondary variant shows the full "Download Resume" label and no sublabel', () => {
    render(<ResumeButton variant="secondary">Download Resume</ResumeButton>);
    const button = screen.getByRole('button', { name: /save resume as pdf/i });
    expect(button.textContent).toContain('Download Resume');
    expect(button.textContent).not.toContain('PDF');
  });

  it('has cursor-pointer on the primary variant (per design system rule)', () => {
    render(<ResumeButton variant="primary" />);
    const button = screen.getByRole('button', { name: /save resume as pdf/i });
    expect(button.className).toContain('cursor-pointer');
  });

  it('has cursor-pointer on the secondary variant (per design system rule)', () => {
    render(<ResumeButton variant="secondary" />);
    const button = screen.getByRole('button', { name: /save resume as pdf/i });
    expect(button.className).toContain('cursor-pointer');
  });

  it('is hidden from the printed PDF via the print-hidden class', () => {
    render(<ResumeButton variant="primary" />);
    const button = screen.getByRole('button', { name: /save resume as pdf/i });
    expect(button.className).toContain('print-hidden');
  });

  it('triggers window.print when clicked', () => {
    const original = window.print;
    let called = 0;
    // jsdom doesn't implement window.print by default.
    Object.defineProperty(window, 'print', {
      configurable: true,
      value: () => {
        called += 1;
      },
    });
    try {
      render(<ResumeButton />);
      const button = screen.getByRole('button', { name: /save resume as pdf/i });
      button.click();
      expect(called).toBe(1);
    } finally {
      Object.defineProperty(window, 'print', { configurable: true, value: original });
    }
  });
});
