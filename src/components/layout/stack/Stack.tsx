'use client'

import { useState } from 'react'

import Reveal from '@/components/interface/reveal/Reveal'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import { SlashedText } from '@/components/interface/tech-list/TechList'
import Container from '@/components/layout/container/Container'
import { cn } from '@/utilities/ui'

type Props = {
  subtitle?: string
  groups?: Array<{
    title: string
    items?: Array<{ name: string; years?: string | null }> | null
  }> | null
  /** Right below the Home's About: its two column lines run down the gap into these columns. */
  joined?: boolean
}

/**
 * Technologies with years of experience, shared by Home and About.
 * Three columns on desktop; on mobile the groups become tabs to keep the list short.
 */
export default function Stack({ subtitle = 'Stack', groups, joined }: Props) {
  const [active, setActive] = useState(0)

  if (!groups?.length) return null

  return (
    <section className={cn(!joined && 'mt-between max-sm:mt-between-mob')}>
      <Container>
        {joined ? (
          <div className="grid grid-cols-3 max-sm:block">
            <div className="border-l border-light-black pt-between max-sm:border-l-0 max-sm:pt-between-mob">
              <Subtitle className="flex">{subtitle}</Subtitle>
            </div>
            <div className="border-l border-light-black max-sm:hidden" />
          </div>
        ) : (
          <Subtitle className="flex">{subtitle}</Subtitle>
        )}

        <div role="tablist" className="mt-8 flex justify-between gap-4 overflow-x-auto border-b border-light-black sm:hidden">
          {groups.map((group, index) => (
            <button
              key={group.title}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              className={cn(
                'font-display shrink-0 border-b-2 pb-4 text-lg leading-none transition-colors',
                index === active ? 'border-gray text-white' : 'border-transparent text-gray',
              )}
            >
              {group.title}
            </button>
          ))}
        </div>

        {/* The column lines start right under the subtitle. The closing line belongs to the
            last column, so the columns are exact thirds and line up with the About above. */}
        <div className="grid grid-cols-3 max-sm:block">
          {groups.map((group, index) => (
            <Reveal
              key={group.title}
              delay={index * 100}
              className={cn(
                'border-l border-light-black last:border-r max-sm:border-x-0',
                index !== active && 'max-sm:hidden',
              )}
            >
              <div className="border-b border-light-black pt-20 max-sm:hidden">
                <h3 className="inline-block border-b-2 border-gray pb-8 text-[40px]">{group.title}</h3>
              </div>
              <ul className="flex flex-col gap-6 pt-10 pr-10 max-sm:gap-5 max-sm:pt-8 max-sm:pr-0">
                {group.items?.map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-2xl leading-none text-white max-sm:text-xl">
                      <SlashedText text={item.name} />
                    </span>
                    {item.years && (
                      <span className="shrink-0 text-sm leading-none font-light text-gray">{item.years}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
