import type { Metadata } from 'next'

import Highlight from '@/components/interface/highlight/Highlight'
import Reveal from '@/components/interface/reveal/Reveal'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Container from '@/components/layout/container/Container'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { routePath } from '@/i18n/routes'
import { getPage } from '@/lib/payload'
import JsonLd from '@/components/seo/JsonLd'
import { buildMetadata, plainTitle } from '@/lib/seo'
import { breadcrumbs } from '@/lib/structured-data'

import Categories from './_components/Categories'

export async function generateMetadata({ params }: PageProps<'/[locale]/vida'>): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const page = await getPage('uses-page', locale)

  return buildMetadata(page.meta, {
    locale,
    paths: { pt: routePath('pt', 'uses'), en: routePath('en', 'uses') },
    fallbackTitle: getDictionary(locale).pages.uses,
    fallbackDescription: plainTitle(page.title),
  })
}

export default async function Uses({ params }: PageProps<'/[locale]/vida'>) {
  const locale = (await params).locale as Locale
  const page = await getPage('uses-page', locale)
  const t = getDictionary(locale).uses

  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: 'Home', path: routePath(locale, 'home') },
          { name: plainTitle(page.subtitle) || getDictionary(locale).pages.uses, path: routePath(locale, 'uses') },
        ])}
      />
      <section className="pt-30 pb-20 max-sm:pt-12 max-sm:pb-10">
        <Container>
          <Reveal className="flex items-start justify-between gap-10 max-sm:flex-col">
            {page.subtitle && <Subtitle className="mt-11 max-sm:mt-0">{page.subtitle}</Subtitle>}
            {page.title && (
              <h1 className="text-right max-sm:text-left">
                <Highlight text={page.title} />
              </h1>
            )}
          </Reveal>
        </Container>
      </section>

      {!!page.categories?.length && (
        <section className="border-t border-light-black">
          <Categories categories={page.categories} labels={t} />
        </section>
      )}
    </>
  )
}
