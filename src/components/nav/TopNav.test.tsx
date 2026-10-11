import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { TopNav } from './TopNav';
import type { NavLink } from './navLinks';

// Primary row (always shown).
// Direction 4 (2026-10-10): Experience moved ahead of Projects so the
// nav mirrors the new page section order (Profile → Experience → Projects).
// Direction 5 (2026-10-10): Profile was promoted from the "More" dropdown
// to the primary row (between Home and Experience) so the nav matches the
// page composition (Hero → Profile → Experience → Projects → ...).
const primaryLinks: NavLink[] = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

// "More" dropdown contents.
const secondaryLinks: NavLink[] = [
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'honors', label: 'Honors' },
];

// Section elements that exist in the rendered page (scroll-spy targets).
function seedSections() {
  document.body.innerHTML = `
    <section id="top"></section>
    <section id="about"></section>
    <section id="experience"></section>
    <section id="projects"></section>
    <section id="skills"></section>
    <section id="education"></section>
    <section id="honors"></section>
    <section id="contact"></section>
  `;
}

describe('TopNav (editorial + More dropdown)', () => {
  beforeEach(() => {
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

    seedSections();
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('desktop primary row', () => {
    it('renders every primary link', () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      for (const l of primaryLinks) {
        expect(screen.getByRole('link', { name: l.label })).toBeInTheDocument();
      }
    });

    it('does NOT render secondary links as plain links (they are in the dropdown)', () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      // Closed dropdown: secondary items should not be plain links.
      // Note: "Profile" is now in primary (Direction 5) so it's allowed
      // to be a plain link — we only check Education here.
      expect(screen.queryByRole('link', { name: 'Education' })).not.toBeInTheDocument();
    });

    it('marks the first primary link (Home) as active by default', () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      const home = screen.getByRole('link', { name: 'Home' });
      expect(home.getAttribute('aria-current')).toBe('page');
    });

    it('uses modern minimal SaaS styling on the primary row (sentence-case + pill background)', () => {
      const { container } = render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      // The primary link uses sentence-case typography with a rounded
      // pill background that fills in on hover/active. No uppercase,
      // no letter-spacing — the editorial "tracking-[0.14em]" pattern
      // is gone.
      const home = screen.getByRole('link', { name: 'Home' });
      expect(home.className).toMatch(/text-sm/);
      expect(home.className).toMatch(/font-medium/);
      expect(home.className).toMatch(/rounded-full/);
      expect(home.className).not.toMatch(/uppercase/);
      expect(home.className).not.toMatch(/tracking-\[/);
    });

    it('renders a dual-mode LeetCode link as an anchor on home (scrollId) and a route on /leetcode (href)', () => {
      // On home, the LeetCode link has both href AND scrollId, so it
      // should render as an anchor targeting #leetcode-callout, NOT as
      // a Next.js <Link> that would navigate away.
      const leetcode: NavLink = {
        id: 'leetcode',
        label: 'LeetCode',
        href: '/leetcode',
        scrollId: 'leetcode-callout',
      };
      // Seed the section the link should scroll to
      document.body.insertAdjacentHTML('beforeend', '<section id="leetcode-callout"></section>');

      const { rerender } = render(
        <TopNav links={[leetcode]} secondary={[]} currentPath="/" />,
      );
      // On home: anchor with href="#leetcode-callout"
      const homeAnchor = document.querySelector('a[href="#leetcode-callout"]');
      expect(homeAnchor).not.toBeNull();
      expect(homeAnchor?.textContent).toBe('LeetCode');

      // On the /leetcode page: same link data, but with currentPath set,
      // it should render as a Next.js <Link href="/leetcode">.
      rerender(<TopNav links={[leetcode]} secondary={[]} currentPath="/leetcode" />);
      const routeLink = document.querySelector('a[href="/leetcode"]');
      expect(routeLink).not.toBeNull();
      // The anchor should no longer be present (we re-rendered, but
      // querySelector picks fresh DOM each time).
      expect(document.querySelector('a[href="#leetcode-callout"]')).toBeNull();
    });

    it('uses the heading (serif) font for the brand wordmark', () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      // The Monogram SVG also carries a <title> with the same label, so use
      // getAllByText and check the visible brand span.
      const matches = screen.getAllByText('Sanjit Majumdar');
      const visibleSpan = matches.find(el => el.tagName === 'SPAN');
      expect(visibleSpan).toBeDefined();
      expect(visibleSpan!.className).toMatch(/font-heading/);
    });

    it('clicking a primary link scrolls to that section', () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      fireEvent.click(screen.getByRole('link', { name: 'Experience' }));
      const section = document.getElementById('experience');
      expect(section?.scrollIntoView).toHaveBeenCalled();
    });

    it('does NOT mark Home as active on a non-home page (regression: initial activeId leak)', () => {
      // Regression: the initial state of `activeId` is the first link's id
      // (Home = "top"). The scroll-spy effect skips non-home pages, so
      // without an `onHome` guard, Home would render aria-current="page"
      // on every other page (including /leetcode) — highlighting the
      // wrong link.
      render(
        <TopNav links={primaryLinks} secondary={secondaryLinks} currentPath="/leetcode" />,
      );
      const home = screen.getByRole('link', { name: 'Home' });
      expect(home.getAttribute('aria-current')).not.toBe('page');
    });
  });

  describe('"More" dropdown', () => {
    it('does not render the dropdown button when secondary is empty', () => {
      render(<TopNav links={primaryLinks} secondary={[]} />);
      expect(screen.queryByRole('button', { name: /more/i })).not.toBeInTheDocument();
    });

    it('renders a "More" button with aria-haspopup=menu and aria-expanded=false', () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      const more = screen.getByRole('button', { name: /more/i });
      expect(more.getAttribute('aria-haspopup')).toBe('menu');
      expect(more.getAttribute('aria-expanded')).toBe('false');
    });

    it('clicking "More" opens the menu and toggles aria-expanded', async () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      const more = screen.getByRole('button', { name: /more/i });
      fireEvent.click(more);
      await waitFor(() => {
        expect(more.getAttribute('aria-expanded')).toBe('true');
      });
      // All secondary links now visible inside the menu.
      for (const l of secondaryLinks) {
        expect(screen.getByRole('menuitem', { name: l.label })).toBeInTheDocument();
      }
    });

    it('rotates the chevron when open', async () => {
      const { container } = render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      const more = screen.getByRole('button', { name: /more/i });
      fireEvent.click(more);
      await waitFor(() => {
        expect(more.getAttribute('aria-expanded')).toBe('true');
      });
      // ChevronDown element has rotate-180 when open.
      const chevron = container.querySelector('svg.lucide-chevron-down');
      expect(chevron?.getAttribute('class')).toMatch(/rotate-180/);
    });

    it('Escape closes the "More" dropdown', async () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      const more = screen.getByRole('button', { name: /more/i });
      fireEvent.click(more);
      await waitFor(() => {
        expect(more.getAttribute('aria-expanded')).toBe('true');
      });
      fireEvent.keyDown(window, { key: 'Escape' });
      await waitFor(() => {
        expect(more.getAttribute('aria-expanded')).toBe('false');
      });
    });

    it('clicking a dropdown link closes the menu and scrolls to the section', async () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      const more = screen.getByRole('button', { name: /more/i });
      fireEvent.click(more);
      await waitFor(() => {
        expect(more.getAttribute('aria-expanded')).toBe('true');
      });
      fireEvent.click(screen.getByRole('menuitem', { name: 'Education' }));
      const section = document.getElementById('education');
      expect(section?.scrollIntoView).toHaveBeenCalled();
      await waitFor(() => {
        expect(more.getAttribute('aria-expanded')).toBe('false');
      });
    });

    it('clicking outside the dropdown closes it', async () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      const more = screen.getByRole('button', { name: /more/i });
      fireEvent.click(more);
      await waitFor(() => {
        expect(more.getAttribute('aria-expanded')).toBe('true');
      });
      // mousedown on document body, outside the dropdown
      fireEvent.mouseDown(document.body);
      await waitFor(() => {
        expect(more.getAttribute('aria-expanded')).toBe('false');
      });
    });
  });

  describe('theme toggle', () => {
    it('renders a ThemeToggle button', async () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      const toggles = await screen.findAllByRole('button', { name: /switch to dark mode/i });
      expect(toggles.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('mobile menu', () => {
    it('renders a mobile menu toggle with aria-expanded=false initially', async () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      const button = await screen.findByRole('button', { name: /open menu/i });
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('clicking the hamburger opens the mobile menu and updates aria-expanded', async () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      const button = await screen.findByRole('button', { name: /open menu/i });
      fireEvent.click(button);
      await waitFor(() => {
        expect(button.getAttribute('aria-expanded')).toBe('true');
      });
      expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
    });

    it('mobile menu shows the full flat list (primary + secondary)', async () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
      const openButton = await screen.findByRole('button', { name: /open menu/i });
      fireEvent.click(openButton);
      await waitFor(() => {
        expect(openButton.getAttribute('aria-expanded')).toBe('true');
      });
      // In the mobile panel, "Education" still appears as a flat link
      // (it's in secondary). "Profile" now appears because it's primary
      // (Direction 5) — primary items are also rendered as flat links in
      // the mobile panel.
      // (Both desktop and mobile panels are in the DOM at this point — at
      // least one of each must be present.)
      const profileLinks = screen.getAllByRole('link', { name: 'Profile' });
      expect(profileLinks.length).toBeGreaterThanOrEqual(1);
      const educationLinks = screen.getAllByRole('link', { name: 'Education' });
      expect(educationLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('Escape closes the mobile menu', async () => {
      render(<TopNav links={primaryLinks} secondary={secondaryLinks} />);
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
});
