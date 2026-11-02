import { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import { isLocale, type Locale } from '@/i18n/config'
import { pagePath, projectPath, withLocale } from '@/i18n/routes'
import { PayloadRequest, CollectionSlug } from 'payload'

type Props = {
  collection: Extract<CollectionSlug, 'pages' | 'projects' | 'posts'>
  slug: string
  /** Admin locale, as a code or `{ code }`. */
  locale?: unknown
  req: PayloadRequest
}

/** URL of the preview route that enables draft mode and redirects to `path`. */
export const previewUrl = (path: string) => {
  const encodedParams = new URLSearchParams({
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  return `/next/preview?${encodedParams.toString()}`
}

const toLocale = (locale: unknown): Locale => {
  const code = typeof locale === 'string' ? locale : (locale as { code?: string } | undefined)?.code
  return code && isLocale(code) ? code : 'pt'
}

export const generatePreviewPath = ({ collection, slug, locale }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encoded = encodeURIComponent(slug)
  const target = toLocale(locale)

  if (collection === 'projects') return previewUrl(projectPath(target, encoded))
  if (collection === 'posts') return previewUrl(withLocale(target, `/artigos/${encoded}`))

  return previewUrl(pagePath(target, encoded))
}
