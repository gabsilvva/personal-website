import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import Reveal from '@/components/interface/reveal/Reveal'
import RichText from '@/components/interface/rich-text/RichText'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Container from '@/components/layout/container/Container'
import { intlLocale, locales, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { pagePath } from '@/i18n/routes'
import { findPageBySlugInAnyLocale, getPageBySlug, getPageSlug, getPublishedSlugs } from '@/lib/payload'
import { buildMetadata, richTextExcerpt } from '@/lib/seo'

type Props = PageProps<'/[locale]/[slug]'>

const read = async (params: Props['params']) => {
  const { locale, slug } = await params
  return { locale: locale as Locale, slug: decodeURIComponent(slug) }
}

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) => (await getPublishedSlugs('pages', locale)).map((slug) => ({ locale, slug }))),
  )
  return params.flat()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await read(params)
  const page = await getPageBySlug(slug, locale)
  if (!page) return {}

  const [pt, en] = await Promise.all([getPageSlug(page.id, 'pt'), getPageSlug(page.id, 'en')])

  return buildMetadata(page.meta, {
    locale,
    paths: { pt: pt && pagePath('pt', pt), en: en && pagePath('en', en) },
    fallbackTitle: page.title,
    fallbackDescription: richTextExcerpt(page.content),
  })
}

/** Text pages created in the admin, e.g. the privacy policy and terms of use. */
export default async function TextPage({ params }: Props) {
  const { locale, slug } = await read(params)
  const page = await getPageBySlug(slug, locale)

  if (!page) {
    // A slug from the other language (e.g. from the language switch): go to the translated one
    const match = await findPageBySlugInAnyLocale(slug)
    const translated = match && (await getPageSlug(match.id, locale))
    if (translated && translated !== slug) redirect(pagePath(locale, translated))
    notFound()
  }

  const t = getDictionary(locale)
  const updated = new Intl.DateTimeFormat(intlLocale[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(page.updatedAt))

  return (
    <>
      <section className="border-b border-light-black pt-30 pb-20 max-sm:pt-12 max-sm:pb-10">
        <Container>
          <Reveal>
            <h1>{page.title}</h1>
          </Reveal>
        </Container>
      </section>

      <section className="pt-20 max-sm:pt-10">
        <Container>
          <div className="grid grid-cols-[357px_1fr] max-sm:grid-cols-1 max-sm:gap-8">
            <div>
              <Subtitle className="text-sm">
                {t.legal.updated} {updated}
              </Subtitle>
            </div>
            <RichText data={page.content} locale={locale} className="max-w-[640px]" />
          </div>
        </Container>
      </section>
    </>
  )
}
