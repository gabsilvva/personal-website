import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { htmlLang, locales, type Locale } from '@/i18n/config'
import { pagePath, projectPath, routePath, type RouteKey } from '@/i18n/routes'
import { absoluteUrl } from '@/lib/seo'

export const revalidate = 3600

type Entry = { paths: Record<Locale, string>; lastModified: Date; priority: number }

// One entry per locale, each listing the other languages as alternates
const expand = ({ paths, lastModified, priority }: Entry): MetadataRoute.Sitemap =>
  locales.map((locale) => ({
    url: absoluteUrl(paths[locale]),
    lastModified,
    priority,
    alternates: {
      languages: Object.fromEntries(locales.map((other) => [htmlLang[other], absoluteUrl(paths[other])])),
    },
  }))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })

  const [pages, projects] = await Promise.all([
    payload.find({
      collection: 'pages',
      overrideAccess: false,
      pagination: false,
      limit: 1000,
      locale: 'all',
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'projects',
      overrideAccess: false,
      pagination: false,
      limit: 1000,
      select: { slug: true, updatedAt: true },
    }),
  ])

  // The main pages have fixed routes
  const fixed: Array<[RouteKey, number]> = [
    ['home', 1],
    ['projects', 0.9],
    ['about', 0.8],
    ['uses', 0.6],
  ]

  // With `locale: 'all'`, localized fields come back as `{ pt, en }`
  const slugs = (slug: unknown) => slug as unknown as Partial<Record<Locale, string>>

  const entries: Entry[] = [
    ...fixed.map(([key, priority]) => ({
      paths: { pt: routePath('pt', key), en: routePath('en', key) },
      lastModified: new Date(),
      priority,
    })),
    ...pages.docs.map((page) => {
      const { pt, en } = slugs(page.slug)
      return {
        paths: { pt: pagePath('pt', pt), en: pagePath('en', en ?? pt) },
        lastModified: new Date(page.updatedAt),
        priority: 0.3,
      }
    }),
    ...projects.docs.map((project) => ({
      paths: { pt: projectPath('pt', project.slug), en: projectPath('en', project.slug) },
      lastModified: new Date(project.updatedAt),
      priority: 0.8,
    })),
  ]

  return entries.flatMap(expand)
}
