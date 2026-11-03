import type { Metadata } from 'next'

import Stack from '@/components/layout/stack/Stack'
import Stats from '@/components/layout/stats/Stats'
import JsonLd from '@/components/seo/JsonLd'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { routePath } from '@/i18n/routes'
import { hireLink } from '@/lib/links'
import { getPage, getSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbs, profilePage } from '@/lib/structured-data'

import Career from './_components/Career'
import Hero from './_components/Hero'
import Links from './_components/Links'
import Story from './_components/Story'

export async function generateMetadata({ params }: PageProps<'/[locale]/sobre'>): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const page = await getPage('about-page', locale)

  return buildMetadata(page.meta, {
    locale,
    paths: { pt: routePath('pt', 'about'), en: routePath('en', 'about') },
    fallbackTitle: getDictionary(locale).pages.about,
    fallbackDescription: page.hero?.text,
    type: 'profile',
  })
}

export default async function About({ params }: PageProps<'/[locale]/sobre'>) {
  const locale = (await params).locale as Locale
  const [page, settings] = await Promise.all([getPage('about-page', locale), getSettings(locale)])

  const t = getDictionary(locale).pages
  const path = routePath(locale, 'about')

  return (
    <>
      <JsonLd
        data={[
          profilePage({ path, name: t.about, updatedAt: page.updatedAt }),
          breadcrumbs([
            { name: 'Home', path: routePath(locale, 'home') },
            { name: t.about, path },
          ]),
        ]}
      />
      <Hero {...page.hero} hire={hireLink(settings)} location={settings.location} />

      <Stats items={settings.stats} />

      <Story
        subtitle={page.story?.subtitle}
        text={page.story?.text}
        favorites={page.story?.favorites}
        image={page.story?.image}
      />

      <Links subtitle={page.story?.linksSubtitle} links={settings.socials ?? []} />

      <Career
        title={page.career?.title}
        text={page.career?.text}
        experiences={page.career?.experiences}
        locale={locale}
      />

      <Stack groups={settings.stack} />
    </>
  )
}
