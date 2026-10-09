import type { MetadataRoute } from 'next';
import { computeBuildTimestamp } from '@/lib/cv-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sanjit-majumdar.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(computeBuildTimestamp()),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
  ];
}
