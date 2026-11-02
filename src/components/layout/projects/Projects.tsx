import Project, { type ProjectCardData } from '@/components/interface/card/Project'
import Reveal from '@/components/interface/reveal/Reveal'
import type { Locale } from '@/i18n/config'
import { cn } from '@/utilities/ui'

type Props = {
  projects: ProjectCardData[]
  locale: Locale
  className?: string
}

/** Two-column grid of project cards. */
export default function Projects({ projects, locale, className }: Props) {
  if (!projects.length) return null

  return (
    <ul className={cn('grid grid-cols-2 gap-x-4 gap-y-10 max-md:grid-cols-1', className)}>
      {projects.map((project, index) => (
        <li key={project.id}>
          <Reveal delay={(index % 2) * 120}>
            <Project project={project} locale={locale} />
          </Reveal>
        </li>
      ))}
    </ul>
  )
}

/** Keeps only the populated projects of a relationship field. */
export const populated = <T extends { id: number }>(items?: (number | T)[] | null): T[] =>
  (items ?? []).filter((item): item is T => typeof item === 'object' && item !== null)
