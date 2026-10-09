import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset to a known initial state: no dark class, no localStorage entry.
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders a button with an aria-label for switching themes', async () => {
    render(<ThemeToggle />);
    // Initial state is light (no dark class on html)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
    });
  });

  it('renders the moon icon in light mode and the sun icon in dark mode', async () => {
    document.documentElement.classList.add('dark');
    render(<ThemeToggle />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
    });
  });

  it('clicking adds the dark class and writes to localStorage', async () => {
    render(<ThemeToggle />);
    const button = await screen.findByRole('button', { name: /switch to dark mode/i });
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme-preference')).toBe('dark');
  });

  it('clicking again removes the dark class and writes light to localStorage', async () => {
    document.documentElement.classList.add('dark');
    render(<ThemeToggle />);
    const button = await screen.findByRole('button', { name: /switch to light mode/i });
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme-preference')).toBe('light');
  });
});
