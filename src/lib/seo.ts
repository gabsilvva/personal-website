import type { Metadata } from 'next'

import { htmlLang, type Locale } from '@/i18n/config'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getSettings } from './payload'
import { SITE_NAME, SITE_URL } from './site'

type Meta = {
  title?: string | null
  description?: string | null
  image?: number | Media | null
}

type Options = {
  locale: Locale
  /** Public path of the page in each locale, for the canonical URL and hreflang. */
  paths: Partial<Record<Locale, string | null>>
  /** The home page uses the site title from Configurações › SEO. */
  home?: boolean
  /** Used when the SEO tab has no title; the site name is appended. */
  fallbackTitle?: string
  /** Used when the SEO tab has no description, before the site default. */
  fallbackDescription?: string | null
  /** Used when the SEO tab has no image, before the site default. */
  fallbackImage?: number | Media | null
}

const asDescription = (value?: string | null) => {
  const text = value?.replace(/\s+/g, ' ').trim()
  if (!text) return undefined
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}...` : text
}

/** Removes the `{muted}` and `//` markup of display titles. */
export const plainTitle = (value?: string | null) =>
  value?.replace(/[{}]/g, '').replace(/\s*\/\/\s*/g, ' ').replace(/\s+/g, ' ').trim()

type LexicalNode = { text?: string; children?: LexicalNode[]; type?: string }

/** First paragraph of a rich text field, as plain text. */
export const richTextExcerpt = (data?: { root?: LexicalNode } | null) => {
  const collect = (node: LexicalNode): string => node.text ?? (node.children ?? []).map(collect).join('')
  const paragraph = data?.root?.children?.find((node) => node.type === 'paragraph' && collect(node).trim())
  return paragraph ? collect(paragraph) : undefined
}

const asMedia = (value?: number | Media | null) => (value && typeof value === 'object' && value.url ? value : null)

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`

/**
 * Page metadata. Each value falls back from the page's SEO tab, to its own content, to the site
 * defaults in Configurações › SEO — so every page always has a title, description and share image.
 */
export async function buildMetadata(meta: Meta | null | undefined, options: Options): Promise<Metadata> {
  const { seo } = await getSettings(options.locale)
  const siteTitle = seo?.title || SITE_NAME

  // An explicit or home title is used as-is; other pages get " — Gabriel da Silva"
  const absolute = meta?.title || (options.home ? siteTitle : undefined)
  const fullTitle = absolute ?? (options.fallbackTitle ? `${options.fallbackTitle} — ${SITE_NAME}` : siteTitle)

  // The home is described by the site description; other pages by their own content first
  const description = asDescription(
    options.home
      ? meta?.description || seo?.description || options.fallbackDescription
      : meta?.description || options.fallbackDescription || seo?.description,
  )

  const image = asMedia(meta?.image) ?? asMedia(options.fallbackImage) ?? asMedia(seo?.image)
  const og = image?.sizes?.og?.url ? { url: image.sizes.og.url, width: 1200, height: 630 } : image ? { url: image.url! } : null
  const images = og ? [{ ...og, url: getMediaUrl(og.url), alt: image?.alt || fullTitle }] : undefined

  const canonical = absoluteUrl(options.paths[options.locale] ?? '/')
  const languages = Object.fromEntries(
    Object.entries(options.paths)
      .filter(([, path]) => path)
      .map(([locale, path]) => [htmlLang[locale as Locale], absoluteUrl(path!)]),
  )
  if (options.paths.pt) languages['x-default'] = absoluteUrl(options.paths.pt)

  return {
    // Leaving `title` out keeps the layout default; it must never be `undefined` explicitly
    ...(absolute ? { title: { absolute } } : options.fallbackTitle ? { title: options.fallbackTitle } : {}),
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: htmlLang[options.locale].replace('-', '_'),
      title: fullTitle,
      description,
      url: canonical,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: images?.map((item) => item.url),
    },
  }
}
