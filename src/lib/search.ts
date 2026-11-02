import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { pagePath, projectPath, routePath } from '@/i18n/routes'

import { getHeader, getPage, getProjects, getSettings, getTextPages } from './payload'

export type SearchGroup = 'pages' | 'projects' | 'uses' | 'socials'

export type SearchItem = {
  id: string
  group: SearchGroup
  label: string
  description?: string
  href: string
  external?: boolean
  /** Extra words that match without being shown, e.g. a project's technologies. */
  keywords?: string
}

const isExternal = (href: string) => /^https?:\/\//.test(href)

/** Everything the search can find, in the visitor's language. Built from the CMS on the server. */
export async function getSearchIndex(locale: Locale): Promise<SearchItem[]> {
  const [header, settings, projects, textPages, uses] = await Promise.all([
    getHeader(locale),
    getSettings(locale),
    getProjects(locale),
    getTextPages(locale),
    getPage('uses-page', locale),
  ])

  const t = getDictionary(locale)

  // Fixed pages use the labels from the menu, so renaming them in the CMS reaches the search too
  const navLabel = (page: 'projects' | 'about' | 'uses') =>
    header.navItems?.find((item) => item.page === page)?.label ?? t.pages[page]

  const pages: SearchItem[] = [
    { id: 'page-home', group: 'pages', label: 'Home', href: routePath(locale, 'home') },
    { id: 'page-projects', group: 'pages', label: navLabel('projects'), href: routePath(locale, 'projects') },
    { id: 'page-about', group: 'pages', label: navLabel('about'), href: routePath(locale, 'about') },
    { id: 'page-uses', group: 'pages', label: navLabel('uses'), href: routePath(locale, 'uses') },
    ...textPages.map((page) => ({
      id: `page-${page.id}`,
      group: 'pages' as const,
      label: page.title,
      href: pagePath(locale, page.slug),
    })),
  ]

  const projectItems: SearchItem[] = projects.map((project) => ({
    id: `project-${project.id}`,
    group: 'projects',
    label: project.title,
    description: [project.client, project.year].filter(Boolean).join(' · '),
    href: projectPath(locale, project.slug),
    keywords: project.technologies?.join(' '),
  }))

  const useItems: SearchItem[] = (uses.categories ?? []).flatMap((category) =>
    (category.items ?? []).map((item) => ({
      id: `use-${item.id ?? item.name}`,
      group: 'uses' as const,
      label: item.name,
      description: item.description ?? category.title,
      href: item.url || routePath(locale, 'uses'),
      external: !!item.url && isExternal(item.url),
      keywords: category.title,
    })),
  )

  const socials: SearchItem[] = (settings.socials ?? []).map((social) => ({
    id: `social-${social.id ?? social.label}`,
    group: 'socials',
    label: social.label,
    href: social.url,
    external: isExternal(social.url),
  }))

  return [...pages, ...projectItems, ...useItems, ...socials]
}
