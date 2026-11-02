import '@/styles/globals.css'

import type { Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import Footer from '@/components/layout/footer/Footer'
import Nav from '@/components/layout/nav/Nav'
import Search from '@/components/layout/search/Search'
import Loadscreen, { loadscreenScript } from '@/components/layout/loadscreen/Loadscreen'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import JsonLd from '@/components/seo/JsonLd'
import { htmlLang, isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { pagePath, routePath } from '@/i18n/routes'
import { hireLink } from '@/lib/links'
import { getFooter, getHeader, getPage, getSettings } from '@/lib/payload'
import { getSearchIndex } from '@/lib/search'
import { SITE_NAME, SITE_URL } from '@/lib/site'

const serif = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-fraunces',
})

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/svg+xml' }],
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function Layout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const [settings, header, footer, searchItems, home, { isEnabled: draft }] = await Promise.all([
    getSettings(locale),
    getHeader(locale),
    getFooter(locale),
    getSearchIndex(locale),
    getPage('home-page', locale),
    draftMode(),
  ])

  const t = getDictionary(locale)
  const hire = hireLink(settings)

  const navItems = (header.navItems ?? []).map((item) => ({
    label: item.label,
    href: routePath(locale, item.page),
    soon: !!item.soon,
  }))

  const legalLinks = (footer.legalLinks ?? []).flatMap((page) =>
    typeof page === 'object' ? [{ label: page.title, href: pagePath(locale, page.slug) }] : [],
  )

  // Who owns the site, for search engines: name, role, contact and public profiles
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: settings.seo?.title || SITE_NAME,
      url: SITE_URL,
      inLanguage: htmlLang[locale],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL,
      email: `mailto:${settings.email}`,
      jobTitle: home.hero?.rolesRight?.split(/\r?\n/).filter(Boolean).join(' & ') || undefined,
      description: settings.seo?.description || undefined,
      // Only real profile URLs (with a path), not placeholders like https://github.com/
      sameAs: (settings.socials ?? [])
        .map((social) => social.url)
        .filter((url) => /^https?:\/\/[^/]+\/.+/.test(url)),
    },
  ]

  const footerSocials = (settings.socials ?? [])
    .filter((social) => social.showInFooter)
    .map((social) => ({ label: social.label, url: social.url }))

  return (
    // The inline script may mark <html> as loaded before React hydrates
    <html
      lang={htmlLang[locale]}
      data-scroll-behavior="smooth"
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: loadscreenScript }} />
        <noscript>
          <style>{'#loadscreen{display:none}body{overflow:auto!important}'}</style>
        </noscript>
      </head>
      <body id="top">
        <Loadscreen />

        <JsonLd data={structuredData} />
        {draft && <LivePreviewListener />}

        <Nav locale={locale} items={navItems} hire={hire} t={t.nav} />
        <Search locale={locale} items={searchItems} hire={hire} email={settings.email} t={t.search} />

        <main className="pt-nav max-sm:pt-nav-mob">{children}</main>

        <Footer
          contact={{
            subtitle: footer.contact?.subtitle,
            title: footer.contact?.title,
            email: settings.email,
          }}
          home={routePath(locale, 'home')}
          hire={hire}
          socials={footerSocials}
          legalText={footer.legalText}
          legalLinks={legalLinks}
          t={t.footer}
        />
      </body>
    </html>
  )
}
