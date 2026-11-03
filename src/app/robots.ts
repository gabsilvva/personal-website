import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site'

/**
 * Every crawler, AI ones included, may read the public site; the admin, the API (except media
 * files, so images can be indexed) and the preview routes stay out. Preview deploys are closed.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === 'preview') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/media/file/'],
      disallow: ['/admin', '/api/', '/next/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
