'use client';

// Root error boundary. Catches any uncaught error in the app and renders a
// graceful fallback. Vercel Analytics will report the pageview so we can
// monitor error occurrences over time.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-3xl font-semibold">Something went wrong</h1>
          <p className="mb-8 text-slate-600 dark:text-slate-400">
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
