import type { Metadata } from 'next'

import Stack from '@/components/layout/stack/Stack'
import Stats from '@/components/layout/stats/Stats'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { routePath } from '@/i18n/routes'
import { hireLink } from '@/lib/links'
import { getPage, getSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

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
  })
}

export default async function About({ params }: PageProps<'/[locale]/sobre'>) {
  const locale = (await params).locale as Locale
  const [page, settings] = await Promise.all([getPage('about-page', locale), getSettings(locale)])

  return (
    <>
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
