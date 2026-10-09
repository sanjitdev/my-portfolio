'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'theme-preference';
type Theme = 'light' | 'dark';

/**
 * Light/dark theme toggle. The initial theme is set by the no-FOUC script in
 * `app/layout.tsx` before React hydrates; this component reads the post-mount
 * state of `<html>` to know the current theme.
 *
 * The icon shown represents the *destination* theme: a moon icon in light
 * mode (clicking will switch to dark), a sun icon in dark mode.
 */
export function ThemeToggle() {
  // Start as undefined so the server-rendered HTML matches the first client
  // render; the real value is filled in after mount.
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage may be unavailable (private mode); ignore.
    }
    setTheme(next);
  };

  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {isDark ? (
        <Sun aria-hidden="true" className="h-5 w-5" />
      ) : (
        <Moon aria-hidden="true" className="h-5 w-5" />
      )}
    </button>
  );
}
