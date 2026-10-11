'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import type { NavLink } from './navLinks';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Monogram } from '@/components/branding/Monogram';

interface TopNavProps {
  links: NavLink[];
  secondary?: NavLink[];
  /**
   * Current Next.js pathname. Passed in by the page so this client component
   * can highlight the active route link. Optional — the home page passes
   * `undefined` and the active state falls back to scroll-spy only.
   */
  currentPath?: string;
}

/**
 * Sticky top navigation with scroll-spy, mobile hamburger menu, theme
 * toggle, and a "More" dropdown that holds secondary sections.
 *
 * Modern minimal SaaS visual direction: sentence-case links with rounded
 * pill backgrounds on hover/active, soft backdrop blur, and a subtle
 * drop shadow that fades in once the user scrolls past the very top.
 *
 * The "primary" + "secondary" split keeps the desktop row from looking
 * crowded when the CV has many populated sections (Education, Honors,
 * Languages, Recommendations, …). On mobile, the full flat list is shown
 * in the hamburger panel because vertical space is plentiful.
 *
 * Links can have:
 *  - `href` only           → route link (e.g. /leetcode on other pages)
 *  - `scrollId` only       → in-page anchor with scroll-spy (e.g. Home → #top)
 *  - both `href` and `scrollId` → dual mode: anchor-scroll on home, route on
 *    other pages. This is how the LeetCode link stays consistent with the
 *    rest of the primary row, which all scroll to their sections on home.
 */
export function TopNav({ links, secondary = [], currentPath }: TopNavProps) {
  // Flat list — used for scroll-spy targets and the mobile menu.
  const allLinks: NavLink[] = [...links, ...secondary];

  const pathname = usePathname();
  const activePath = currentPath ?? pathname ?? '';

  // True when the user has scrolled past the very top of the page — toggles
  // a soft drop shadow on the nav. Avoids the bar feeling weightless on
  // long pages while still being invisible at the very top.
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>(allLinks[0]?.id ?? '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  // Scroll-driven shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy (skipped on non-home pages, where there are no anchor targets)
  useEffect(() => {
    if (activePath && activePath !== '/' && activePath !== '') return;
    const sections = allLinks
      .map(l => document.getElementById(l.scrollId ?? l.id))
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
  }, [allLinks, activePath]);

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
    // Route links navigate normally — no smooth-scroll hijack.
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    setMenuOpen(false);
    setMoreOpen(false);
    // Update the URL hash without an additional scroll jump
    history.replaceState(null, '', `#${id}`);
  };

  /**
   * Returns the active state for a link:
   *  - route link (has `href` and no `scrollId`): active if `activePath`
   *    matches its `href`
   *  - anchor link (has `scrollId` only): active if scroll-spy set its id
   *    as activeId — but only on home, where the section exists
   *  - anchor link (no `href`, no `scrollId` — uses `id` as the section
   *    id directly): active if scroll-spy set its `id` as activeId — but
   *    only on home, where the section exists
   *  - dual link (has both `href` and `scrollId`): active on home when
   *    scroll-spy matches, and on other pages when pathname matches
   *
   * Anchor-only links are never active on non-home pages: their target
   * sections don't exist there, and the scroll-spy doesn't run, so the
   * initial `activeId` would otherwise leak through and incorrectly
   * highlight Home (the first link) on every other page.
   */
  const isLinkActive = (link: NavLink): boolean => {
    if (link.href && !link.scrollId) {
      return activePath === link.href || activePath.startsWith(`${link.href}/`);
    }
    if (link.href && link.scrollId) {
      // On home, scroll-spy wins; on other pages, the route wins.
      if (onHome) {
        return activeId === link.scrollId;
      }
      return activePath === link.href || activePath.startsWith(`${link.href}/`);
    }
    // Anchor-only link (scrollId or id-as-section). Only active on home
    // where the section actually exists and the scroll-spy can match.
    if (!onHome) return false;
    return activeId === (link.scrollId ?? link.id);
  };

  // True on the home page (where anchor-scroll should win over route nav).
  const onHome = activePath === '' || activePath === '/';

  /**
   * Render a primary or mobile link. Picks anchor or route based on the
   * link's shape and whether we're on home.
   */
  const renderDesktopLink = (link: NavLink) => {
    const isActive = isLinkActive(link);
    const className = clsx(
      'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
      isActive
        ? 'bg-slate-100 text-slate-900 dark:bg-slate-800/60 dark:text-slate-100'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-100',
    );

    // Dual-mode: anchor on home, route on other pages
    if (link.href && link.scrollId && onHome) {
      return (
        <a
          key={link.id}
          href={`#${link.scrollId}`}
          onClick={e => handleLinkClick(e, link.scrollId!)}
          aria-current={isActive ? 'page' : undefined}
          className={className}
        >
          {link.label}
        </a>
      );
    }
    if (link.href && link.scrollId) {
      return (
        <Link
          key={link.id}
          href={link.href}
          aria-current={isActive ? 'page' : undefined}
          className={className}
        >
          {link.label}
        </Link>
      );
    }
    // Route-only link
    if (link.href) {
      return (
        <Link
          key={link.id}
          href={link.href}
          aria-current={isActive ? 'page' : undefined}
          className={className}
        >
          {link.label}
        </Link>
      );
    }
    // Anchor-only link. On home, the hash points at the section in this
    // document; on other pages (e.g. /leetcode), the sections don't exist
    // here, so the href becomes /#id so the browser navigates to home and
    // scrolls to the section. handleLinkClick's "section not found" early
    // return lets the browser follow the href naturally in that case.
    return (
      <a
        key={link.id}
        href={onHome ? `#${link.id}` : `/#${link.id}`}
        onClick={e => handleLinkClick(e, link.id)}
        aria-current={isActive ? 'page' : undefined}
        className={className}
      >
        {link.label}
      </a>
    );
  };

  return (
    <nav
      aria-label="Primary"
      className={clsx(
        'sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md transition-shadow duration-200 dark:bg-slate-950/80',
        scrolled
          ? 'border-slate-200/70 shadow-[0_1px_8px_-2px_rgba(15,23,42,0.08)] dark:border-slate-800/70 dark:shadow-[0_1px_8px_-2px_rgba(0,0,0,0.5)]'
          : 'border-transparent',
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-900 dark:text-slate-100"
        >
          <Monogram size="sm" className="hidden sm:block" />
          <span className="font-heading text-base font-semibold tracking-tight">
            Sanjit Majumdar
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map(renderDesktopLink)}

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
                  'inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  moreOpen || secondary.some(l => isLinkActive(l))
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800/60 dark:text-slate-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-100',
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
                  className="absolute right-0 top-full mt-3 min-w-[16rem] origin-top-right rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-md transition-opacity duration-150 motion-reduce:duration-0 dark:border-slate-800 dark:bg-slate-950/95"
                >
                  {secondary.map(link => {
                    const isActive = isLinkActive(link);
                    return (
                      <a
                        key={link.id}
                        role="menuitem"
                        href={onHome ? `#${link.id}` : `/#${link.id}`}
                        onClick={e => handleLinkClick(e, link.id)}
                        aria-current={isActive ? 'page' : undefined}
                        className={clsx(
                          'block rounded-lg px-3 py-2 text-sm transition-colors',
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
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
          <div className="mx-auto flex max-w-5xl flex-col gap-0.5 px-6 py-3">
            {allLinks.map(link => {
              const isActive = isLinkActive(link);
              const className = clsx(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800/60 dark:text-slate-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-100',
              );

              // Dual-mode: anchor on home, route on other pages
              if (link.href && link.scrollId && onHome) {
                return (
                  <a
                    key={link.id}
                    href={`#${link.scrollId}`}
                    onClick={e => handleLinkClick(e, link.scrollId!)}
                    aria-current={isActive ? 'page' : undefined}
                    className={className}
                  >
                    {link.label}
                  </a>
                );
              }
              if (link.href) {
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={className}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <a
                  key={link.id}
                  href={onHome ? `#${link.id}` : `/#${link.id}`}
                  onClick={e => handleLinkClick(e, link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={className}
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
