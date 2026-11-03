import type { GlobalAfterChangeHook, GlobalConfig, Tab } from 'payload'

import { revalidatePath } from 'next/cache'

import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { localizeTabs } from '@/fields/localize'
import { seoTab } from '@/fields/seoTab'
import { isLocale } from '@/i18n/config'
import { routePath, routes, type RouteKey } from '@/i18n/routes'
import { previewUrl } from '@/utilities/generatePreviewPath'
import { revalidateDiscovery } from '@/hooks/revalidateDiscovery'

type Options = {
  slug: string
  label: string
  /** The fixed route that renders this page, in `app/(frontend)/[locale]`. */
  route: RouteKey
  tabs: Tab[]
}

// Payload hands the admin locale over either as a code or as a `{ code }` object
const localeCode = (locale: unknown) => {
  const code = typeof locale === 'string' ? locale : (locale as { code?: string } | undefined)?.code
  return code && isLocale(code) ? code : 'pt'
}

/**
 * A fixed page of the site (Home, Sobre...) edited as a global: one entry in the admin, with
 * translated text, drafts, live preview and its own SEO.
 */
export const pageGlobal = ({ slug, label, route, tabs }: Options): GlobalConfig => {
  const folder = routes[route].pt
  // Route pattern revalidates the page in every locale
  const pattern = `/[locale]${folder === '/' ? '' : folder}`

  const revalidate: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
    if (!context.disableRevalidate) {
      payload.logger.info(`Revalidating page: ${pattern}`)
      revalidatePath(pattern, 'page')
      // The uses page also feeds the search of every page
      if (route === 'uses') revalidatePath('/[locale]', 'layout')
      revalidateDiscovery()
    }

    return doc
  }

  return {
    slug,
    label,
    access: {
      // Visitors only get the published version, never the drafts and autosaves
      read: authenticatedOrPublished,
    },
    admin: {
      group: 'Páginas',
      livePreview: { url: ({ locale }) => previewUrl(routePath(localeCode(locale), route)) },
      preview: (_doc, { locale }) => previewUrl(routePath(localeCode(locale), route)),
    },
    fields: [
      {
        type: 'tabs',
        tabs: [...localizeTabs(tabs, ['url']), seoTab({ generate: false })],
      },
    ],
    hooks: {
      afterChange: [revalidate],
    },
    versions: {
      drafts: {
        autosave: {
          interval: 100, // We set this interval for optimal live preview
        },
        schedulePublish: true,
      },
      max: 50,
    },
  }
}
