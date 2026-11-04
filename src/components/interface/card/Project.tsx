import Image from 'next/image'
import Link from 'next/link'

import ProjectCover from '@/components/interface/card/ProjectCover'
import Tag from '@/components/interface/tag/Tag'
import TechList from '@/components/interface/tech-list/TechList'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { projectPath } from '@/i18n/routes'
import type { Project as ProjectType } from '@/payload-types'

export type ProjectCardData = Pick<
  ProjectType,
  'id' | 'title' | 'slug' | 'year' | 'soon' | 'url' | 'thumbnail' | 'technologies' | 'logo'
>

type Props = {
  project: ProjectCardData
  locale: Locale
}

export default function Project({ project, locale }: Props) {
  const t = getDictionary(locale)
  const path = projectPath(locale, project.slug);

  return (
    <div className="group block relative">
      <div className="absolute top-8 left-8 max-sm:top-5 max-sm:left-5 z-20">
        {project.soon ? (
          <Tag variant="soon">{t.soon}</Tag>
        ) : (
          project.url && (
            <Link href={project.url} target='_blank'>
              <Image src="/svg/link.svg" alt={t.projects.live} width={48} height={48} className="max-sm:size-10" />
            </Link>
          )
        )}
      </div>
      <Link href={path} className='relative z-10 block'>
        <ProjectCover
          thumbnail={project.thumbnail}
          logo={project.logo}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="aspect-[672/640]"
        />
        <div className="mt-8 border-l border-light-black py-8 pl-8 max-sm:mt-5 max-sm:py-1 max-sm:pl-5">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
            <h3 className="text-[32px] max-sm:text-2xl">{project.title}</h3>
            {project.year && <span className="text-sm leading-[1.6] font-light text-gray">{project.year}</span>}
          </div>
          <TechList items={project.technologies} className="mt-4" />
        </div>
      </Link>
    </div>
  )
}
