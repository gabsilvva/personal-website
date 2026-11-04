import type { Metadata } from 'next'

import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { projectPath, routePath } from '@/i18n/routes'
import { hireLink } from '@/lib/links'
import { getPage, getProjects, getSettings } from '@/lib/payload'
import JsonLd from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbs, projectList } from '@/lib/structured-data'

import Banner from './_components/Banner'
import List from './_components/List'

export async function generateMetadata({ params }: PageProps<'/[locale]/projetos'>): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const page = await getPage('projects-page', locale)

  return buildMetadata(page.meta, {
    locale,
    paths: { pt: routePath('pt', 'projects'), en: routePath('en', 'projects') },
    fallbackTitle: getDictionary(locale).pages.projects,
    fallbackDescription: page.banner?.text,
  })
}

export default async function Projects({ params }: PageProps<'/[locale]/projetos'>) {
  const locale = (await params).locale as Locale
  const [page, settings, projects] = await Promise.all([
    getPage('projects-page', locale),
    getSettings(locale),
    getProjects(locale),
  ])

  const t = getDictionary(locale).pages
  const path = routePath(locale, 'projects')

  return (
    <>
      <JsonLd
        data={[
          projectList({
            path,
            name: t.projects,
            items: projects.map((project) => ({ name: project.title, path: projectPath(locale, project.slug) })),
          }),
          breadcrumbs([
            { name: 'Home', path: routePath(locale, 'home') },
            { name: t.projects, path },
          ]),
        ]}
      />
      <Banner subtitle={page.banner?.subtitle} title={page.banner?.title} text={page.banner?.text} />
      <List
        projects={projects.map(({ id, title, slug, year, soon, url, thumbnail, logo, technologies, categories }) => ({
          id,
          title,
          slug,
          year,
          soon,
          url,
          thumbnail,
          logo,
          technologies,
          categories,
        }))}
        hire={hireLink(settings)}
        locale={locale}
      />
    </>
  )
}
