import { defaultLocale, type Locale } from './config'

/**
 * Public paths of the fixed pages. The route folders in `app/(frontend)/[locale]` keep the
 * Portuguese names; `proxy.ts` maps the English URLs onto them.
 */
export const routes = {
  home: { pt: '/', en: '/' },
  about: { pt: '/sobre', en: '/about' },
  projects: { pt: '/projetos', en: '/projects' },
  uses: { pt: '/vida', en: '/uses' },
} as const satisfies Record<string, Record<Locale, string>>

export type RouteKey = keyof typeof routes

/** First path segment in English → route folder. */
export const englishToFolder: Record<string, string> = Object.fromEntries(
  Object.values(routes)
    .filter((route) => route.en !== '/')
    .map((route) => [route.en.slice(1), route.pt.slice(1)]),
)

/** Route folder (Portuguese segment) → English segment. */
export const folderToEnglish: Record<string, string> = Object.fromEntries(
  Object.entries(englishToFolder).map(([en, pt]) => [pt, en]),
)

/** Prefixes a path with the locale. Portuguese lives at the root. */
export const withLocale = (locale: Locale, path: string) =>
  locale === defaultLocale ? path : `/${locale}${path === '/' ? '' : path}`

export const routePath = (locale: Locale, key: RouteKey) => withLocale(locale, routes[key][locale])

export const projectPath = (locale: Locale, slug?: string | null) =>
  withLocale(locale, `${routes.projects[locale]}/${slug ?? ''}`)

/** Text pages (privacy policy, terms...) live at `/{slug}`, with the slug translated per locale. */
export const pagePath = (locale: Locale, slug?: string | null) => withLocale(locale, `/${slug ?? ''}`)

/**
 * Splits a pathname into its locale and the path without the prefix. Accepts the public URL
 * (`/en/about`) as well as the internal one the proxy rewrites to (`/en/sobre`, `/pt/sobre`).
 */
export const parsePath = (pathname: string): { locale: Locale; path: string } => {
  for (const locale of ['en', 'pt'] as const) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(locale.length + 1) || '/' }
    }
  }
  return { locale: 'pt', path: pathname }
}

/**
 * The same page in the other language. Fixed routes and projects map directly; text pages keep
 * their slug and the page redirects to the translated one.
 */
export const alternatePath = (pathname: string, target: Locale) => {
  const { locale, path } = parsePath(pathname)
  if (locale === target) return pathname

  const [first = '', ...rest] = path.split('/').filter(Boolean)
  const folder = locale === 'en' ? (englishToFolder[first] ?? first) : first
  const segment = target === 'en' ? (folderToEnglish[folder] ?? folder) : folder

  return withLocale(target, `/${[segment, ...rest].filter(Boolean).join('/')}`)
}

/** RSS feed of the projects. Served by `[locale]/feed.xml`; the Portuguese one is rewritten to the root. */
export const feedPath = (locale: Locale) => withLocale(locale, '/feed.xml')
