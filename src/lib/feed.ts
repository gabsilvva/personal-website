import { htmlLang, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { feedPath, projectPath, routePath } from '@/i18n/routes'
import type { Media } from '@/payload-types'

import { getPage, getProjects, getSettings } from './payload'
import { absoluteUrl, plainTitle } from './seo'
import { SITE_NAME } from './site'

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const tag = (name: string, value?: string | null, attributes = '') =>
  value ? `<${name}${attributes}>${escape(value)}</${name}>` : ''

const image = (media?: number | Media | null) =>
  media && typeof media === 'object' && media.url
    ? { url: /^https?:\/\//.test(media.url) ? media.url : absoluteUrl(media.url), type: media.mimeType ?? 'image/jpeg' }
    : null

/** RSS 2.0 feed of the projects, newest first, in one language. */
export async function projectsFeed(locale: Locale): Promise<Response> {
  const [projects, page, settings] = await Promise.all([
    getProjects(locale),
    getPage('projects-page', locale),
    getSettings(locale),
  ])
  const t = getDictionary(locale)

  const date = (value?: string | null) => (value ? new Date(value).toUTCString() : undefined)
  const sorted = [...projects].sort(
    (a, b) => +new Date(b.publishedAt ?? b.createdAt) - +new Date(a.publishedAt ?? a.createdAt),
  )
  const lastChange = projects.reduce((latest, project) => (project.updatedAt > latest ? project.updatedAt : latest), '')

  const items = sorted.map((project) => {
    const link = absoluteUrl(projectPath(locale, project.slug))
    const cover = image(project.cover) ?? image(project.thumbnail)
    return [
      '<item>',
      tag('title', project.client ? `${project.title} — ${project.client}` : project.title),
      tag('link', link),
      tag('guid', link, ' isPermaLink="true"'),
      tag('description', project.summary || plainTitle(project.intro)),
      tag('pubDate', date(project.publishedAt ?? project.createdAt)),
      tag('dc:creator', SITE_NAME),
      ...(project.technologies ?? []).map((technology) => tag('category', technology)),
      cover ? `<media:content url="${escape(cover.url)}" medium="image" type="${escape(cover.type)}" />` : '',
      '</item>',
    ]
      .filter(Boolean)
      .join('')
  })

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">',
    '<channel>',
    tag('title', `${t.pages.projects} — ${SITE_NAME}`),
    tag('link', absoluteUrl(routePath(locale, 'projects'))),
    tag('description', plainTitle(page.banner?.text) || settings.seo?.description || SITE_NAME),
    tag('language', htmlLang[locale]),
    `<atom:link href="${escape(absoluteUrl(feedPath(locale)))}" rel="self" type="application/rss+xml" />`,
    tag('lastBuildDate', date(lastChange || new Date().toISOString())),
    ...items,
    '</channel>',
    '</rss>',
  ].join('\n')

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
