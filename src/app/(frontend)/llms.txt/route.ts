import { getDictionary } from '@/i18n/dictionaries'
import { feedPath, projectPath, routePath, pagePath, type RouteKey } from '@/i18n/routes'
import { hireLink } from '@/lib/links'
import { getPage, getProjects, getSettings, getTextPages } from '@/lib/payload'
import { absoluteUrl, plainTitle, richTextExcerpt } from '@/lib/seo'
import { SITE_NAME } from '@/lib/site'
import { profileUrls } from '@/lib/structured-data'

export const revalidate = 3600

const line = (value?: string | null) => value?.replace(/\s+/g, ' ').trim() ?? ''

/**
 * llms.txt (https://llmstxt.org): the site summarized in Markdown for AI assistants and answer
 * engines — who Gabriel is, what he offers, his projects and where to find each page.
 */
export async function GET() {
  const [settings, home, about, projects, textPages, englishTextPages] = await Promise.all([
    getSettings('pt'),
    getPage('home-page', 'pt'),
    getPage('about-page', 'pt'),
    getProjects('pt'),
    getTextPages('pt'),
    getTextPages('en'),
  ])
  const t = getDictionary('pt').pages
  const en = getDictionary('en').pages
  const link = (label: string, path: string, note?: string | null) =>
    `- [${label}](${absoluteUrl(path)})${line(note) ? `: ${line(note)}` : ''}`

  const fixed: Array<[RouteKey, string, string]> = [
    ['home', 'Home', 'Home'],
    ['projects', t.projects, en.projects],
    ['about', t.about, en.about],
    ['uses', t.uses, en.uses],
  ]

  const hire = hireLink(settings)
  const roles = [home.hero?.rolesLeft, home.hero?.rolesRight]
    .flatMap((value) => value?.split(/\r?\n/) ?? [])
    .map((role) => role.trim())
    .filter(Boolean)

  const sections = [
    `# ${SITE_NAME}`,
    `> ${line(settings.seo?.description) || SITE_NAME}`,
    [
      line(home.hero?.text),
      roles.length ? `Papéis: ${roles.join(', ')}.` : '',
      settings.location?.city ? `Localização: ${settings.location.city} (${settings.location.utc ?? ''}).` : '',
      'O site está em português (raiz) e em inglês (/en).',
    ]
      .filter(Boolean)
      .join('\n\n'),

    `## ${t.about}\n\n${[line(about.hero?.text), line(richTextExcerpt(home.about?.text))].filter(Boolean).join('\n\n')}`,

    (home.services ?? []).length
      ? `## Serviços\n\n${(home.services ?? [])
          .map((service) => `- **${line(service.title)}**: ${line(service.text || service.tagline)}`)
          .join('\n')}`
      : '',

    (settings.stack ?? []).length
      ? `## Stack\n\n${(settings.stack ?? [])
          .map((group) => `- **${line(group.title)}**: ${(group.items ?? []).map((item) => item.name).join(', ')}`)
          .join('\n')}`
      : '',

    projects.length
      ? `## ${t.projects}\n\n${projects
          .map((project) =>
            link(
              project.client ? `${project.title} — ${project.client}` : project.title,
              projectPath('pt', project.slug),
              [project.summary || plainTitle(project.intro), project.technologies?.length ? `(${project.technologies.join(', ')})` : '']
                .filter(Boolean)
                .join(' '),
            ),
          )
          .join('\n')}`
      : '',

    `## Páginas\n\n${[
      ...fixed.map(([key, label]) => link(label, routePath('pt', key))),
      ...textPages.map((page) => link(page.title, pagePath('pt', page.slug))),
    ].join('\n')}`,

    `## Contato\n\n${[
      settings.email ? `- E-mail: ${settings.email}` : '',
      `- ${hire.label}: ${hire.href}`,
      ...profileUrls(settings).map((url) => `- ${url}`),
    ]
      .filter(Boolean)
      .join('\n')}`,

    `## English\n\n${[
      ...fixed.map(([key, , label]) => link(label, routePath('en', key))),
      ...englishTextPages.map((page) => link(page.title, pagePath('en', page.slug))),
    ].join('\n')}`,

    `## Optional\n\n${[
      link('Sitemap', '/sitemap.xml'),
      link('RSS (pt)', feedPath('pt')),
      link('RSS (en)', feedPath('en')),
    ].join('\n')}`,
  ]

  return new Response(`${sections.filter(Boolean).join('\n\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
