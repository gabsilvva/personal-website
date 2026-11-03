import { htmlLang, type Locale } from '@/i18n/config'
import type { HomePage, Media, Project, Setting } from '@/payload-types'

import { absoluteUrl, plainTitle } from './seo'
import { SITE_NAME, SITE_URL } from './site'

/**
 * schema.org data shared by the pages. The person and the website have fixed `@id`s, so every
 * page can point to them ("author", "about") and search engines and AI answer engines read the
 * site as one connected graph about the same person.
 */
export const PERSON_ID = `${SITE_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`

const CONTEXT = 'https://schema.org'

const imageUrl = (media?: number | Media | null) => {
  if (!media || typeof media !== 'object' || !media.url) return undefined
  return /^https?:\/\//.test(media.url) ? media.url : absoluteUrl(media.url)
}

/** Real profile URLs (with a path), not placeholders like https://github.com/ */
export const profileUrls = (settings: Setting) =>
  (settings.socials ?? []).map((social) => social.url).filter((url) => /^https?:\/\/[^/]+\/.+/.test(url))

/** The site and its owner, on every page. */
export function siteGraph({ locale, settings, home }: { locale: Locale; settings: Setting; home: HomePage }) {
  const roles = home.hero?.rolesRight?.split(/\r?\n/).map((role) => role.trim()).filter(Boolean) ?? []
  const skills = (settings.stack ?? []).flatMap((group) =>
    (group.items ?? []).flatMap((item) => item.name.split('/').map((name) => name.trim())),
  )

  return {
    '@context': CONTEXT,
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: 'GAB.S',
        description: settings.seo?.description || undefined,
        inLanguage: htmlLang[locale],
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: SITE_NAME,
        alternateName: 'GAB.S',
        url: SITE_URL,
        email: settings.email ? `mailto:${settings.email}` : undefined,
        image: imageUrl(home.hero?.image),
        jobTitle: roles.length ? roles.join(' & ') : undefined,
        description: settings.seo?.description || undefined,
        homeLocation: settings.location?.city ? { '@type': 'Place', name: settings.location.city } : undefined,
        knowsAbout: skills.length ? [...new Set(skills)] : undefined,
        sameAs: profileUrls(settings),
      },
    ],
  }
}

/** The services of the home, offered by the person. */
export function servicesGraph(services: HomePage['services']) {
  const items = (services ?? []).filter((service) => service.title)
  if (!items.length) return null

  return {
    '@context': CONTEXT,
    '@id': PERSON_ID,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: items.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.text || service.tagline || undefined,
          provider: { '@id': PERSON_ID },
        },
      })),
    },
  }
}

type Crumb = { name: string; path: string }

export const breadcrumbs = (items: Crumb[]) => ({
  '@context': CONTEXT,
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})

/** A project as a creative work made by the person. */
export function projectGraph(project: Project, { locale, path }: { locale: Locale; path: string }) {
  const url = absoluteUrl(path)

  return {
    '@context': CONTEXT,
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    url,
    name: project.client ? `${project.title} — ${project.client}` : project.title,
    description: project.summary || plainTitle(project.intro) || undefined,
    image: imageUrl(project.cover) ?? imageUrl(project.thumbnail),
    dateCreated: project.year || undefined,
    dateModified: project.updatedAt,
    inLanguage: htmlLang[locale],
    creator: { '@id': PERSON_ID },
    author: { '@id': PERSON_ID },
    keywords: project.technologies?.length ? project.technologies.join(', ') : undefined,
    genre: project.specs?.service || undefined,
    sameAs: project.url && /^https?:\/\//.test(project.url) ? project.url : undefined,
    isPartOf: { '@id': WEBSITE_ID },
  }
}

/** A page whose subject is the person (the About page). */
export const profilePage = ({ path, name, updatedAt }: { path: string; name: string; updatedAt?: string | null }) => ({
  '@context': CONTEXT,
  '@type': 'ProfilePage',
  url: absoluteUrl(path),
  name,
  dateModified: updatedAt || undefined,
  mainEntity: { '@id': PERSON_ID },
  isPartOf: { '@id': WEBSITE_ID },
})

/** The projects listing. */
export const projectList = ({ path, name, items }: { path: string; name: string; items: Crumb[] }) => ({
  '@context': CONTEXT,
  '@type': 'CollectionPage',
  url: absoluteUrl(path),
  name,
  isPartOf: { '@id': WEBSITE_ID },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  },
})
