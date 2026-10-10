'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import type { NavLink } from './navLinks';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Monogram } from '@/components/branding/Monogram';

interface TopNavProps {
  links: NavLink[];
  secondary?: NavLink[];
}

/**
 * Sticky top navigation with scroll-spy, mobile hamburger menu, theme
 * toggle, and a "More" dropdown that holds secondary sections.
 *
 * Editorial visual direction (per ADR-005): uppercase letterspaced primary
 * links, refined hover, monogram on the left, theme toggle on the right.
 *
 * The "primary" + "secondary" split keeps the desktop row from looking
 * crowded when the CV has many populated sections (Education, Honors,
 * Languages, Recommendations, …). On mobile, the full flat list is shown
 * in the hamburger panel because vertical space is plentiful.
 *
 * Scroll-spy uses IntersectionObserver with a biased rootMargin so the
 * "active" link matches what's near the top of the viewport.
 */
export function TopNav({ links, secondary = [] }: TopNavProps) {
  // Flat list — used for scroll-spy targets and the mobile menu.
  const allLinks: NavLink[] = [...links, ...secondary];

  const [activeId, setActiveId] = useState<string>(allLinks[0]?.id ?? '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  // Scroll-spy
  useEffect(() => {
    const sections = allLinks
      .map(l => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        // Pick the section closest to the top of the visible viewport.
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
  }, [allLinks]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Close "More" dropdown on Escape or outside click
  useEffect(() => {
    if (!moreOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!moreRef.current) return;
      if (!moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    // mousedown so we beat the link click; harmless if the click is inside.
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [moreOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    setMenuOpen(false);
    setMoreOpen(false);
    // Update the URL hash without an additional scroll jump
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-3">
        <a
          href="#top"
          onClick={e => handleLinkClick(e, 'top')}
          className="flex items-center gap-2 text-slate-900 dark:text-slate-100"
        >
          <Monogram size="sm" className="hidden sm:block" />
          <span className="font-heading text-base font-semibold tracking-tight">
            Sanjit Majumdar
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map(link => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={e => handleLinkClick(e, link.id)}
                aria-current={isActive ? 'page' : undefined}
                className={clsx(
                  'group relative rounded-sm px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-colors',
                  isActive
                    ? 'text-accent-700 dark:text-accent-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
                )}
              >
                {link.label}
                <span
                  className={clsx(
                    'pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-200 ease-out',
                    isActive && 'scale-x-100',
                    !isActive && 'group-hover:scale-x-100',
                  )}
                />
              </a>
            );
          })}

          {/* "More" dropdown — only when there are secondary links */}
          {secondary.length > 0 && (
            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen(o => !o)}
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                aria-controls="more-menu"
                className={clsx(
                  'inline-flex items-center gap-1 rounded-sm px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-colors',
                  moreOpen || secondary.some(l => l.id === activeId)
                    ? 'text-accent-700 dark:text-accent-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
                )}
              >
                More
                <ChevronDown
                  aria-hidden="true"
                  className={clsx(
                    'h-3.5 w-3.5 transition-transform duration-200',
                    moreOpen && 'rotate-180',
                  )}
                />
              </button>

              {moreOpen && (
                <div
                  id="more-menu"
                  role="menu"
                  aria-label="More sections"
                  className="absolute right-0 top-full mt-2 min-w-[14rem] origin-top-right rounded-md border border-slate-200 bg-white/95 p-1 shadow-lg shadow-slate-900/5 backdrop-blur-md transition-opacity duration-150 motion-reduce:duration-0 dark:border-slate-800 dark:bg-slate-950/95"
                >
                  {secondary.map(link => {
                    const isActive = activeId === link.id;
                    return (
                      <a
                        key={link.id}
                        role="menuitem"
                        href={`#${link.id}`}
                        onClick={e => handleLinkClick(e, link.id)}
                        aria-current={isActive ? 'page' : undefined}
                        className={clsx(
                          'block rounded-sm px-3 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100',
                        )}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="ml-2 border-l border-slate-200 pl-3 dark:border-slate-800">
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

      {/* Mobile menu panel — flat list (all primary + secondary) */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="mx-auto flex max-w-5xl flex-col px-6 py-3">
            {allLinks.map(link => {
              const isActive = activeId === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={e => handleLinkClick(e, link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={clsx(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-accent-700 dark:text-accent-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
