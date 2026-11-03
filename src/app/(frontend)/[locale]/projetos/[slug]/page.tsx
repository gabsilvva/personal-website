import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import Flat from '@/components/interface/button/Flat'
import Highlight from '@/components/interface/highlight/Highlight'
import Media, { hasMedia } from '@/components/interface/media/Media'
import Reveal from '@/components/interface/reveal/Reveal'
import TechList from '@/components/interface/tech-list/TechList'
import Container from '@/components/layout/container/Container'
import Projects from '@/components/layout/projects/Projects'
import { locales, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { projectPath, routePath } from '@/i18n/routes'
import { hireLink } from '@/lib/links'
import { getProjectBySlug, getProjects, getPublishedSlugs, getSettings } from '@/lib/payload'
import JsonLd from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbs, projectGraph } from '@/lib/structured-data'

import Banner from './_components/Banner'
import Specs from './_components/Specs'

type Props = PageProps<'/[locale]/projetos/[slug]'>

const read = async (params: Props['params']) => {
  const { locale, slug } = await params
  return { locale: locale as Locale, slug: decodeURIComponent(slug) }
}

export async function generateStaticParams() {
  // Project slugs are the same in every language
  const slugs = await getPublishedSlugs('projects', 'pt')
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await read(params)
  const project = await getProjectBySlug(slug, locale)
  if (!project) return {}

  return buildMetadata(project.meta, {
    locale,
    paths: { pt: projectPath('pt', project.slug), en: projectPath('en', project.slug) },
    fallbackTitle: project.client ? `${project.title} — ${project.client}` : project.title,
    fallbackDescription: project.summary,
    fallbackImage: project.cover ?? project.thumbnail,
    type: 'article',
    modifiedTime: project.updatedAt,
  })
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await read(params)
  const project = await getProjectBySlug(slug, locale)
  if (!project) notFound()

  const t = getDictionary(locale).projects
  const [settings, more] = await Promise.all([
    getSettings(locale),
    getProjects(locale, { exclude: project.id, limit: 2 }),
  ])

  const path = projectPath(locale, project.slug)

  return (
    <>
      <JsonLd
        data={[
          projectGraph(project, { locale, path }),
          breadcrumbs([
            { name: 'Home', path: routePath(locale, 'home') },
            { name: getDictionary(locale).pages.projects, path: routePath(locale, 'projects') },
            { name: project.title, path },
          ]),
        ]}
      />
      <Banner
        client={project.client}
        title={project.title}
        logo={project.logo}
        summary={project.summary}
        url={project.url}
        hire={hireLink(settings)}
        visitLabel={t.visit}
      />

      <section className="pt-8">
        <Container>
          <TechList items={project.technologies} className="text-xl max-sm:text-base" />
          {hasMedia(project.cover) && (
            <Reveal className="mt-8">
              <Media
                resource={project.cover}
                sizes="(max-width: 1024px) 100vw, 1360px"
                preload
                className="h-auto w-full rounded-lg"
              />
            </Reveal>
          )}
        </Container>
      </section>

      {project.intro && (
        <section className="mt-16 max-sm:mt-10">
          <Container>
            <Reveal>
              <p className="max-w-[980px] text-[32px] leading-[1.3] font-normal text-gray max-sm:text-xl">
                <Highlight text={project.intro} inverse />
              </p>
            </Reveal>
          </Container>
        </section>
      )}

      <Specs
        title={t.specs}
        description={project.description}
        rows={[
          { label: t.service, value: project.specs?.service },
          { label: t.solution, value: project.specs?.solution },
          { label: t.industry, value: project.specs?.industry },
          { label: t.year, value: project.year },
          { label: t.technology, value: project.specs?.technology },
        ]}
      />

      {more.length > 0 && (
        <section className="mt-between max-sm:mt-between-mob">
          <Container>
            <Reveal>
              <h2>
                {t.more[0]}
                <br />
                {t.more[1]}
              </h2>
            </Reveal>
            <Projects projects={more} locale={locale} className="mt-20 max-sm:mt-10" />
            <div className="mt-20 flex justify-center max-sm:mt-10">
              <Flat href={routePath(locale, 'projects')}>{t.viewAll}</Flat>
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
