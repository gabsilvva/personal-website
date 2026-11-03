import '@/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import Analytics from '@/components/layout/consent/Analytics'
import Footer from '@/components/layout/footer/Footer'
import Nav from '@/components/layout/nav/Nav'
import Search from '@/components/layout/search/Search'
import Loadscreen, { loadscreenScript } from '@/components/layout/loadscreen/Loadscreen'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import JsonLd from '@/components/seo/JsonLd'
import { htmlLang, isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { routePath } from '@/i18n/routes'
import { hireLink, resolveLink } from '@/lib/links'
import { getFooter, getHeader, getPage, getSettings } from '@/lib/payload'
import { getSearchIndex } from '@/lib/search'
import { analyticsId, SITE_NAME, SITE_URL } from '@/lib/site'
import { siteGraph } from '@/lib/structured-data'

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

// Preview deploys must never be indexed (they duplicate the production content)
const indexable = process.env.VERCEL_ENV !== 'preview'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // iOS would turn the CNPJ and numbers into phone links
  formatDetection: { telephone: false, address: false, email: false },
  robots: indexable
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
      }
    : { index: false, follow: false },
  // Generated from public/svg/icon-gs.svg
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
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

  const navItems = (header.navItems ?? []).map((item) => {
    const link = resolveLink(item, locale)
    return { label: item.label, href: link?.href ?? null, blank: link?.blank, soon: !!item.soon }
  })

  const legalLinks = (footer.legalLinks ?? []).flatMap((item) => {
    const link = resolveLink(item, locale)
    const label = item.label || (typeof item.document === 'object' ? item.document?.title : null)
    return link && label ? [{ label, ...link }] : []
  })

  const gaId = analyticsId
  const privacyHref = (legalLinks.find((link) => /privac/i.test(link.href)) ?? legalLinks[0])?.href

  // Who owns the site, for search and AI answer engines: name, role, skills, contact and profiles
  const structuredData = siteGraph({ locale, settings, home })

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
          <style>{'#loadscreen{display:none}body{overflow:auto!important}[data-reveal]{opacity:1!important;transform:none!important}'}</style>
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
          cookies={!!gaId}
          t={t.footer}
        />

        <Analytics gaId={gaId} privacyHref={privacyHref} t={t.consent} />
      </body>
    </html>
  )
}
