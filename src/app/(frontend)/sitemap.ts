import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { defaultLocale, htmlLang, locales, type Locale } from '@/i18n/config'
import { pagePath, projectPath, routePath, type RouteKey } from '@/i18n/routes'
import type { Media } from '@/payload-types'
import { absoluteUrl } from '@/lib/seo'

export const revalidate = 3600

type Entry = {
  paths: Record<Locale, string>
  lastModified?: Date
  priority: number
  images?: string[]
}

// One entry per locale, each listing every language (and x-default) as alternates
const expand = ({ paths, lastModified, priority, images }: Entry): MetadataRoute.Sitemap =>
  locales.map((locale) => ({
    url: absoluteUrl(paths[locale]),
    lastModified,
    priority,
    images,
    alternates: {
      languages: {
        ...Object.fromEntries(locales.map((other) => [htmlLang[other], absoluteUrl(paths[other])])),
        'x-default': absoluteUrl(paths[defaultLocale]),
      },
    },
  }))

const date = (value?: string | null) => (value ? new Date(value) : undefined)

const imageUrl = (media?: number | Media | null) =>
  media && typeof media === 'object' && media.url
    ? /^https?:\/\//.test(media.url)
      ? media.url
      : absoluteUrl(media.url)
    : undefined

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })

  const global = (slug: 'home-page' | 'projects-page' | 'about-page' | 'uses-page') =>
    payload.findGlobal({ slug, depth: 0, select: { updatedAt: true } as never })

  const [pages, projects, home, projectsPage, about, uses] = await Promise.all([
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
      depth: 1,
      select: { slug: true, updatedAt: true, cover: true, thumbnail: true },
    }),
    global('home-page'),
    global('projects-page'),
    global('about-page'),
    global('uses-page'),
  ])

  // The newest project also changes the home and the listing, which show them
  const lastProject = projects.docs.reduce((latest, project) => (project.updatedAt > latest ? project.updatedAt : latest), '')
  const latest = (...values: Array<string | null | undefined>) =>
    date(values.filter(Boolean).sort().at(-1))

  const fixed: Array<[RouteKey, number, Date | undefined]> = [
    ['home', 1, latest(home.updatedAt, lastProject)],
    ['projects', 0.9, latest(projectsPage.updatedAt, lastProject)],
    ['about', 0.8, date(about.updatedAt)],
    ['uses', 0.6, date(uses.updatedAt)],
  ]

  // With `locale: 'all'`, localized fields come back as `{ pt, en }`
  const slugs = (slug: unknown) => slug as unknown as Partial<Record<Locale, string>>

  const entries: Entry[] = [
    ...fixed.map(([key, priority, lastModified]) => ({
      paths: { pt: routePath('pt', key), en: routePath('en', key) },
      lastModified,
      priority,
    })),
    ...projects.docs.map((project) => ({
      paths: { pt: projectPath('pt', project.slug), en: projectPath('en', project.slug) },
      lastModified: date(project.updatedAt),
      priority: 0.8,
      images: [imageUrl(project.cover), imageUrl(project.thumbnail)].filter((url): url is string => !!url),
    })),
    ...pages.docs.map((page) => {
      const { pt, en } = slugs(page.slug)
      return {
        paths: { pt: pagePath('pt', pt), en: pagePath('en', en ?? pt) },
        lastModified: date(page.updatedAt),
        priority: 0.3,
      }
    }),
  ]

  return entries.flatMap(expand)
}
