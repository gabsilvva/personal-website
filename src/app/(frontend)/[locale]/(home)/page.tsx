import type { Metadata } from 'next'

import { populated } from '@/components/layout/projects/Projects'
import Stack from '@/components/layout/stack/Stack'
import Stats from '@/components/layout/stats/Stats'
import JsonLd from '@/components/seo/JsonLd'
import { type Locale } from '@/i18n/config'
import { routePath } from '@/i18n/routes'
import { hireLink, resolveLink, type ResolvedLink } from '@/lib/links'
import { getPage, getSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { servicesGraph } from '@/lib/structured-data'

import About from './_components/About'
import Beliefs from './_components/Beliefs'
import Cta from './_components/Cta'
import FeaturedProjects from './_components/FeaturedProjects'
import Hero from './_components/Hero'
import Payment from './_components/Payment'
import Process from './_components/Process'
import Services from './_components/Services'

/** A section's text link, only when it has both a label and a destination. */
const withLabel = (label: string | null | undefined, link: ResolvedLink | null) =>
  label && link ? { label, ...link } : null

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const page = await getPage('home-page', locale)

  return buildMetadata(page.meta, {
    locale,
    paths: { pt: routePath('pt', 'home'), en: routePath('en', 'home') },
    home: true,
    fallbackDescription: page.hero?.text,
  })
}

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as Locale
  const [page, settings] = await Promise.all([getPage('home-page', locale), getSettings(locale)])
  const hire = hireLink(settings)

  const services = servicesGraph(page.services)

  return (
    <>
      {services && <JsonLd data={services} />}
      <Hero
        {...page.hero}
        cta={{ label: page.hero?.ctaLabel, title: page.hero?.ctaTitle, href: hire.href, blank: hire.blank }}
        location={settings.location}
      />

      <div className="mt-between max-sm:mt-between-mob">
        <Stats items={settings.stats} />
      </div>

      <Beliefs title={page.beliefs?.title} items={page.beliefs?.items} hire={hire} />

      <FeaturedProjects
        subtitle={page.projects?.subtitle}
        title={page.projects?.title}
        text={page.projects?.text}
        projects={populated(page.projects?.items)}
        button={withLabel(page.projects?.buttonLabel, resolveLink(page.projects?.button, locale, 'projects'))}
        locale={locale}
      />

      <Cta title={page.cta?.title} image={page.cta?.image} hire={hire} />

      <Services
        items={(page.services ?? []).map((service) => ({
          ...service,
          case: typeof service.case === 'object' ? service.case : null,
        }))}
        locale={locale}
      />

      <About
        subtitle={page.about?.subtitle}
        title={page.about?.title}
        text={page.about?.text}
        image={page.about?.image}
        link={withLabel(page.about?.linkLabel, resolveLink(page.about?.link, locale, 'about'))}
        hire={hire}
      />

      <Stack groups={settings.stack} joined />

      <Process title={page.process?.title} steps={page.process?.steps} hire={hire} />

      <Payment subtitle={page.payment?.subtitle} title={page.payment?.title} coins={page.payment?.coins} />
    </>
  )
}
