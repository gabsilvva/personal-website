import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Locale } from '@/i18n/config'

const client = () => getPayload({ config: configPromise })

// Draft content is only served inside the admin's live preview
const isDraft = async () => (await draftMode()).isEnabled

// Empty English fields show the Portuguese text
const fallbackLocale = 'pt' as const

export const getSettings = cache(async (locale: Locale) => {
  const payload = await client()
  return payload.findGlobal({ slug: 'settings', depth: 1, locale, fallbackLocale })
})

export const getHeader = cache(async (locale: Locale) => {
  const payload = await client()
  return payload.findGlobal({ slug: 'header', depth: 1, locale, fallbackLocale })
})

export const getFooter = cache(async (locale: Locale) => {
  const payload = await client()
  return payload.findGlobal({ slug: 'footer', depth: 1, locale, fallbackLocale })
})

type PageGlobal = 'home-page' | 'about-page' | 'projects-page' | 'uses-page'

/** One of the fixed pages of the site, edited as a global. */
export const getPage = cache(async <T extends PageGlobal>(slug: T, locale: Locale) => {
  const draft = await isDraft()
  const payload = await client()

  return payload.findGlobal({ slug, draft, overrideAccess: draft, depth: 2, locale, fallbackLocale })
})

/** A free-form text page, e.g. the privacy policy. Slugs are translated. */
export const getPageBySlug = cache(async (slug: string, locale: Locale) => {
  const draft = await isDraft()
  const payload = await client()

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    draft,
    overrideAccess: draft,
    limit: 1,
    pagination: false,
    depth: 2,
    locale,
    fallbackLocale,
  })

  return docs[0] ?? null
})

/** Title and slug of every published text page, for the search. */
export const getTextPages = cache(async (locale: Locale) => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'pages',
    sort: 'createdAt',
    limit: 100,
    pagination: false,
    overrideAccess: false,
    locale,
    fallbackLocale,
    select: { title: true, slug: true },
  })

  return docs
})

/** The slug of a text page in another locale, for the language switch and hreflang. */
export const getPageSlug = cache(async (id: number, locale: Locale) => {
  const payload = await client()
  const page = await payload
    .findByID({ collection: 'pages', id, locale, fallbackLocale, depth: 0, select: { slug: true } })
    .catch(() => null)

  return page?.slug ?? null
})

/** Finds a text page by a slug from any locale (e.g. a Portuguese slug opened under /en). */
export const findPageBySlugInAnyLocale = cache(async (slug: string) => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    locale: 'all',
    limit: 1,
    pagination: false,
    depth: 0,
    select: { slug: true },
  })

  return docs[0] ?? null
})

export const getProjectBySlug = cache(async (slug: string, locale: Locale) => {
  const draft = await isDraft()
  const payload = await client()

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    draft,
    overrideAccess: draft,
    limit: 1,
    pagination: false,
    depth: 1,
    locale,
    fallbackLocale,
  })

  return docs[0] ?? null
})

export const getProjects = cache(async (locale: Locale, options: { exclude?: number; limit?: number } = {}) => {
  const payload = await client()

  const { docs } = await payload.find({
    collection: 'projects',
    where: options.exclude ? { id: { not_equals: options.exclude } } : undefined,
    sort: '_order',
    limit: options.limit ?? 100,
    pagination: false,
    overrideAccess: false,
    depth: 1,
    locale,
    fallbackLocale,
  })

  return docs
})

/** Slugs for static generation. */
export const getPublishedSlugs = async (collection: 'pages' | 'projects', locale: Locale) => {
  const payload = await client()

  const { docs } = await payload.find({
    collection,
    limit: 1000,
    pagination: false,
    overrideAccess: false,
    select: { slug: true },
    locale,
    fallbackLocale,
  })

  return docs.map((doc) => doc.slug).filter(Boolean) as string[]
}
