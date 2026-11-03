import Image from 'next/image'

import Highlight from '@/components/interface/highlight/Highlight'
import Media from '@/components/interface/media/Media'
import Reveal from '@/components/interface/reveal/Reveal'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Tag from '@/components/interface/tag/Tag'
import Container from '@/components/layout/container/Container'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Experience = {
  id?: string | null
  type?: 'work' | 'education' | null
  company: string
  period?: string | null
  roles?: string[] | null
  logo?: number | MediaType | null
  text?: string | null
  tags?: string[] | null
  location?: string | null
}

type Props = {
  title?: string | null
  text?: string | null
  experiences?: Experience[] | null
  locale: Locale
}

export default function Career({ title, text, experiences, locale }: Props) {
  const types = getDictionary(locale).career

  return (
    <section className="mt-between max-sm:mt-between-mob">
      <Container>
        <Reveal className="flex items-start justify-between gap-10 max-sm:flex-col-reverse">
          {text && <p className="max-w-[380px] text-white">{text}</p>}
          {title && (
            <h2 className="text-h1 text-right max-sm:text-left">
              <Highlight text={title} />
            </h2>
          )}
        </Reveal>

        {!!experiences?.length && (
          <ul className="mt-20 grid grid-cols-2 gap-2 rounded-lg bg-dark-gray p-2 max-sm:mt-10 max-sm:grid-cols-1">
            {experiences.map((experience, index) => {
              const roles = experience.roles ?? []

              return (
                <li
                  key={experience.id ?? experience.company}
                  className={cn('rounded-lg px-14 py-12 max-sm:px-5 max-sm:py-8', index % 2 === 1 && 'bg-black')}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      {experience.type && <Subtitle>{types[experience.type]}</Subtitle>}
                      <div className="mt-8 flex flex-wrap items-end gap-4">
                        <h3 className="text-h5">{experience.company}</h3>
                        {experience.period && (
                          <span className="text-sm leading-none font-light text-gray">{experience.period}</span>
                        )}
                      </div>
                    </div>
                    <Media
                      resource={experience.logo}
                      width={64}
                      height={64}
                      className="size-16 rounded-lg object-cover max-sm:size-12"
                    />
                  </div>

                  {roles.length > 0 && (
                    <div className="mt-6 border-b border-light-black">
                      <p className="font-display inline-block border-b border-gray pb-3 text-base leading-none font-normal text-light-black">
                        {roles.map((role, roleIndex) => (
                          <span key={role} className={cn(roleIndex === roles.length - 1 && 'text-white')}>
                            {roleIndex > 0 && ' - '}
                            {role}
                          </span>
                        ))}
                      </p>
                    </div>
                  )}

                  {experience.text && <p className="mt-10 text-white">{experience.text}</p>}

                  {!!experience.tags?.length && (
                    <ul className="mt-8 flex flex-wrap gap-2">
                      {experience.tags.map((tag) => (
                        <li key={tag}>
                          <Tag className="text-white">{tag}</Tag>
                        </li>
                      ))}
                    </ul>
                  )}

                  {experience.location && (
                    <p className="mt-16 flex items-center gap-4 text-sm text-gray max-sm:mt-10">
                      <Image src="/svg/location.svg" alt="" width={20} height={20} />
                      {experience.location}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Container>
    </section>
  )
}
