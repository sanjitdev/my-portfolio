import type { MetadataRoute } from 'next';
import { computeBuildTimestamp } from '@/lib/cv-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sanjit-dev.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(computeBuildTimestamp());
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      // 002-leetcode-stats (Bolt 004): live LeetCode stats page.
      // Re-validated hourly via ISR, so a weekly sitemap ping is plenty.
      url: `${SITE_URL}/leetcode`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}