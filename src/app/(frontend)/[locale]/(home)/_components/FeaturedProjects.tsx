import Flat from '@/components/interface/button/Flat'
import type { ProjectCardData } from '@/components/interface/card/Project'
import Highlight from '@/components/interface/highlight/Highlight'
import Reveal from '@/components/interface/reveal/Reveal'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Container from '@/components/layout/container/Container'
import Projects from '@/components/layout/projects/Projects'
import type { Locale } from '@/i18n/config'

type Props = {
  subtitle?: string | null
  title?: string | null
  text?: string | null
  projects: ProjectCardData[]
  button?: { label?: string | null; href: string; blank?: boolean } | null
  locale: Locale
}

export default function FeaturedProjects({ subtitle, title, text, projects, button, locale }: Props) {
  return (
    <section className="mt-between max-sm:mt-between-mob">
      <Container>
        <Reveal>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
          <div className="flex items-end justify-between gap-10 max-sm:mt-6 max-sm:flex-col-reverse max-sm:items-start max-sm:gap-5">
            {text && <p className="max-w-[380px]">{text}</p>}
            {title && (
              <h2 className="max-w-[672px] text-right max-sm:text-left">
                <Highlight text={title} />
              </h2>
            )}
          </div>
        </Reveal>

        <Projects projects={projects} locale={locale} className="mt-20 max-sm:mt-10" />

        {button?.label && (
          <div className="mt-20 flex justify-center max-sm:mt-10">
            <Flat href={button.href} blank={button.blank}>
              {button.label}
            </Flat>
          </div>
        )}
      </Container>
    </section>
  )
}
