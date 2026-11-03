import { isLocale } from '@/i18n/config'
import { projectsFeed } from '@/lib/feed'

export const revalidate = 3600

export const generateStaticParams = () => [{ locale: 'en' }]

/** Projects feed in English (`/en/feed.xml`); Portuguese lives at `/feed.xml`. */
export async function GET(_request: Request, { params }: RouteContext<'/[locale]/feed.xml'>) {
  const { locale } = await params
  if (!isLocale(locale) || locale === 'pt') return new Response('Not found', { status: 404 })
  return projectsFeed(locale)
}
