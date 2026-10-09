import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { loadCvData } from '@/lib/cv-data';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sanjit-dev.vercel.app';

// loadCvData() runs at build time, baking the metadata into the static HTML.
const cv = loadCvData();
const { name, current_title } = cv.personal_information;
const description = cv.summary.slice(0, 155);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${name} – ${current_title}`,
  description,
  openGraph: {
    type: 'website',
    title: `${name} – ${current_title}`,
    description,
    url: SITE_URL,
    siteName: `${name} – ${current_title}`,
  },
  twitter: {
    card: 'summary',
    title: `${name} – ${current_title}`,
    description,
  },
  robots: { index: true, follow: true },
  icons: { icon: '/icon.svg' },
};

// No-FOUC theme bootstrap script. Reads localStorage (if available) and falls
// back to system preference. Runs synchronously in <head> before any rendering.
const themeBootstrapScript = `(function(){try{var t=localStorage.getItem('theme-preference');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if((t==='dark')||(!t&&d)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="description" content={description} />
        <meta property="og:title" content={`${name} – ${current_title}`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${name} – ${current_title}`} />
        <meta name="twitter:description" content={description} />
      </head>
      <body className="bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
