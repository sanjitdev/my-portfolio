import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { TopNav } from './TopNav';

const links = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

describe('TopNav', () => {
  beforeEach(() => {
    // Stub IntersectionObserver so the scroll-spy setup doesn't blow up in jsdom.
    class MockIO {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn();
      root = null;
      rootMargin = '';
      thresholds = [];
    }
    (globalThis as unknown as { IntersectionObserver: typeof MockIO }).IntersectionObserver =
      MockIO;

    // jsdom does not implement matchMedia — stub it (used by handleLinkClick
    // and by the no-FOUC behavior of ThemeToggle).
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Ensure the section elements exist (jsdom needs them for querySelector).
    document.body.innerHTML = `
      <section id="top"></section>
      <section id="about"></section>
      <section id="contact"></section>
    `;

    // scrollIntoView isn't implemented in jsdom; stub it.
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders one link per entry', () => {
    render(<TopNav links={links} />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });

  it('marks the first link as active by default', () => {
    render(<TopNav links={links} />);
    const home = screen.getByRole('link', { name: 'Home' });
    expect(home.getAttribute('aria-current')).toBe('page');
  });

  it('renders a ThemeToggle button (in both desktop and mobile)', async () => {
    render(<TopNav links={links} />);
    // ThemeToggle reads its initial state from <html> in useEffect; wait for it.
    // The toggle appears once in the desktop nav and once in the mobile nav, so
    // we expect to find at least one.
    const toggles = await screen.findAllByRole('button', { name: /switch to dark mode/i });
    expect(toggles.length).toBeGreaterThanOrEqual(1);
  });

  it('clicking a link calls scrollIntoView on the target section', () => {
    render(<TopNav links={links} />);
    const aboutLink = screen.getByRole('link', { name: 'About' });
    fireEvent.click(aboutLink);
    const aboutSection = document.getElementById('about');
    expect(aboutSection).not.toBeNull();
    expect(aboutSection?.scrollIntoView).toHaveBeenCalled();
  });

  it('renders a mobile menu toggle button with aria-expanded=false initially', async () => {
    render(<TopNav links={links} />);
    const button = await screen.findByRole('button', { name: /open menu/i });
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('clicking the hamburger opens the mobile menu and updates aria-expanded', async () => {
    render(<TopNav links={links} />);
    const button = await screen.findByRole('button', { name: /open menu/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(button.getAttribute('aria-expanded')).toBe('true');
    });
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
  });

  it('Escape closes the mobile menu', async () => {
    render(<TopNav links={links} />);
    const openButton = await screen.findByRole('button', { name: /open menu/i });
    fireEvent.click(openButton);
    await waitFor(() => {
      expect(openButton.getAttribute('aria-expanded')).toBe('true');
    });
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(openButton.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
