import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

/** One route, and it is real. A sitemap that names a page nobody serves is
 *  worse than none: it teaches a crawler to distrust the rest of the file. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://hanzo.ventures/', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
  ]
}
