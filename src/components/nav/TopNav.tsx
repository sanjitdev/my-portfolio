'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { NavLink } from './navLinks';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Monogram } from '@/components/branding/Monogram';

interface TopNavProps {
  links: NavLink[];
}

/**
 * Sticky top navigation with scroll-spy, mobile hamburger menu, and theme
 * toggle. The list of links is passed in from the server (so empty sections
 * are skipped automatically).
 *
 * Scroll-spy uses IntersectionObserver with a biased rootMargin so the
 * "active" link matches what's near the top of the viewport.
 */
export function TopNav({ links }: TopNavProps) {
  const [activeId, setActiveId] = useState<string>(links[0]?.id ?? '');
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll-spy
  useEffect(() => {
    const sections = links
      .map(l => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        // Pick the section closest to the top of the visible viewport.
        // IntersectionObserver fires per-entry; collect all visible and pick
        // the topmost (smallest boundingClientRect.top).
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [links]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    setMenuOpen(false);
    // Update the URL hash without an additional scroll jump
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <a
          href="#top"
          onClick={e => handleLinkClick(e, 'top')}
          className="flex items-center gap-2 text-slate-900 dark:text-slate-100"
        >
          <Monogram size="sm" className="hidden sm:block" />
          <span className="text-sm font-semibold tracking-tight">Sanjit Majumdar</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={e => handleLinkClick(e, link.id)}
              aria-current={activeId === link.id ? 'page' : undefined}
              className={clsx(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                activeId === link.id
                  ? 'text-accent-700 dark:text-accent-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
              )}
            >
              {link.label}
            </a>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            {menuOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="mx-auto flex max-w-5xl flex-col px-6 py-3">
            {links.map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={e => handleLinkClick(e, link.id)}
                aria-current={activeId === link.id ? 'page' : undefined}
                className={clsx(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  activeId === link.id
                    ? 'text-accent-700 dark:text-accent-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
