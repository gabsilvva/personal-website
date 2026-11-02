import { NextResponse, type NextRequest } from 'next/server'

import { LOCALE_COOKIE } from '@/i18n/config'
import { alternatePath, englishToFolder, folderToEnglish } from '@/i18n/routes'

// Lets pages without route params (not-found) know the locale
const rewrite = (request: NextRequest, url: URL, locale: string) => {
  const headers = new Headers(request.headers)
  headers.set('x-locale', locale)
  return NextResponse.rewrite(url, { request: { headers } })
}

const BOT = /bot|crawl|spider|slurp|preview|lighthouse/i

/** True when the browser ranks English above Portuguese in `Accept-Language`. */
const prefersEnglish = (header: string | null) => {
  if (!header) return false

  const quality = (lang: string) =>
    header
      .split(',')
      .map((part) => part.trim().split(';q='))
      .filter(([tag]) => tag.toLowerCase().split('-')[0] === lang)
      .reduce((best, [, q]) => Math.max(best, q ? Number(q) : 1), 0)

  return quality('en') > quality('pt')
}

/**
 * Locale routing. Portuguese is served at the root and English under `/en`, with translated
 * paths (`/en/about`). Both are rewritten onto `app/(frontend)/[locale]`, whose folders keep
 * the Portuguese names. On a first visit, browsers that prefer English are sent to `/en`;
 * choosing a language in the menu stores a cookie that wins from then on.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()

  // `/pt` is only the internal prefix: the public URL has none
  if (pathname === '/pt' || pathname.startsWith('/pt/')) {
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const [first, ...rest] = pathname.slice(4).split('/').filter(Boolean)

    // Portuguese route names under /en → their English URL
    if (first && folderToEnglish[first]) {
      url.pathname = `/en/${[folderToEnglish[first], ...rest].join('/')}`
      return NextResponse.redirect(url, 308)
    }

    const folder = first ? (englishToFolder[first] ?? first) : undefined
    url.pathname = `/en${folder ? `/${[folder, ...rest].join('/')}` : ''}`
    return rewrite(request, url, 'en')
  }

  // First visit from an English browser: suggest the English site (never for crawlers,
  // which must index the Portuguese URLs as they are)
  const chosen = request.cookies.get(LOCALE_COOKIE)?.value
  const userAgent = request.headers.get('user-agent') ?? ''
  if (!chosen && !BOT.test(userAgent) && prefersEnglish(request.headers.get('accept-language'))) {
    url.pathname = alternatePath(pathname, 'en')
    return NextResponse.redirect(url, 307)
  }

  url.pathname = `/pt${pathname === '/' ? '' : pathname}`
  return rewrite(request, url, 'pt')
}

export const config = {
  matcher: [
    // Everything except Payload (admin, api), Next internals, the preview routes and files
    '/((?!admin|api|_next|next/|media/|.*\\..*).*)',
  ],
}
