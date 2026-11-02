import type { Metadata } from 'next'

import Highlight from '@/components/interface/highlight/Highlight'
import Reveal from '@/components/interface/reveal/Reveal'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Container from '@/components/layout/container/Container'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { routePath } from '@/i18n/routes'
import { getPage } from '@/lib/payload'
import { buildMetadata, plainTitle } from '@/lib/seo'

import Category from './_components/Category'

export async function generateMetadata({ params }: PageProps<'/[locale]/equipamentos'>): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const page = await getPage('uses-page', locale)

  return buildMetadata(page.meta, {
    locale,
    paths: { pt: routePath('pt', 'uses'), en: routePath('en', 'uses') },
    fallbackTitle: getDictionary(locale).pages.uses,
    fallbackDescription: plainTitle(page.title),
  })
}

export default async function Uses({ params }: PageProps<'/[locale]/equipamentos'>) {
  const locale = (await params).locale as Locale
  const page = await getPage('uses-page', locale)
  const t = getDictionary(locale).uses

  return (
    <>
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
          <Container>
            <div className="border-x border-light-black max-sm:border-x-0">
              {page.categories.map((category) => (
                <Category key={category.id ?? category.title} {...category} labels={t} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
