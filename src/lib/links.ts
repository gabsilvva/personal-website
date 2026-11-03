import type { Locale } from '@/i18n/config'
import { pagePath, routePath, type RouteKey } from '@/i18n/routes'
import type { Page, Setting } from '@/payload-types'

export type HireLink = { label: string; href: string; blank: boolean }

export type ResolvedLink = { href: string; blank: boolean }

/** A link edited with `linkFields` (src/fields/link.ts). */
export type CmsLink = {
  type?: 'page' | 'document' | 'custom' | null
  page?: RouteKey | null
  document?: number | Pick<Page, 'slug'> | null
  url?: string | null
}

/** Other sites open in a new tab; pages of this site, e-mail and phone links don't. */
const opensNewTab = (href: string) => /^https?:\/\//.test(href)

/** WhatsApp chat link with the message already typed. */
export const whatsappLink = (number?: string | null, message?: string | null) => {
  const digits = number?.replace(/\D/g, '') ?? ''
  const query = message ? `?text=${encodeURIComponent(message)}` : ''

  return `https://wa.me/${digits}${query}`
}

/**
 * The address of a CMS link in the visitor's language, or `null` when it is incomplete.
 * `fallback` covers links saved before the field existed (e.g. "Ver todos" → Projetos).
 */
export function resolveLink(
  link: CmsLink | null | undefined,
  locale: Locale,
  fallback?: RouteKey,
): ResolvedLink | null {
  const type = link?.type ?? 'page'

  if (type === 'custom') {
    const href = link?.url?.trim()
    return href ? { href, blank: opensNewTab(href) } : null
  }

  if (type === 'document') {
    const slug = typeof link?.document === 'object' ? link.document?.slug : null
    return slug ? { href: pagePath(locale, slug), blank: false } : null
  }

  const page = link?.page ?? fallback
  return page ? { href: routePath(locale, page), blank: false } : null
}

/** Every "Quero contratar" button: the link set in Configurações, or the WhatsApp chat. */
export function hireLink(settings: Setting): HireLink {
  const custom = settings.hire?.url?.trim()
  const href = custom || whatsappLink(settings.whatsapp?.number, settings.whatsapp?.message)

  return {
    label: settings.hire?.label || 'Quero contratar',
    href,
    blank: opensNewTab(href),
  }
}
