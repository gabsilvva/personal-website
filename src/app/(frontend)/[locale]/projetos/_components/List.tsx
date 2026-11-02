'use client'

import Image from 'next/image'
import { useState } from 'react'

import Button from '@/components/interface/button/Button'
import type { ProjectCardData } from '@/components/interface/card/Project'
import Container from '@/components/layout/container/Container'
import Projects from '@/components/layout/projects/Projects'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import type { HireLink } from '@/lib/links'
import type { Project } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Category = NonNullable<Project['categories']>[number]

export type ListProject = ProjectCardData & Pick<Project, 'categories'>

type Props = {
  projects: ListProject[]
  hire: HireLink
  locale: Locale
}

const filters: Array<{ value: Category; label: string; icon: React.ReactNode }> = [
  {
    value: 'code',
    label: 'Code',
    icon: (
      <span className="relative flex size-16 items-center justify-center max-sm:size-10">
        <Image src="/svg/services/circle.svg" alt="" width={64} height={64} className="absolute inset-0 size-full" />
        <Image src="/svg/services/star.svg" alt="" width={24} height={24} className="relative max-sm:size-4" />
      </span>
    ),
  },
  {
    value: 'design',
    label: 'Design',
    icon: <Image src="/svg/services/pentagon.svg" alt="" width={64} height={64} className="size-16 max-sm:size-10" />,
  },
]

export default function List({ projects, hire, locale }: Props) {
  const t = getDictionary(locale).projects
  const [active, setActive] = useState<Category | null>(null)

  const visible = active ? projects.filter((project) => project.categories?.includes(active)) : projects

  return (
    <>
      <section className="border-y border-light-black">
        <Container>
          <div className="flex items-center justify-between">
            {/* On mobile the two filters split the width and the extra hire button is dropped */}
            <div className="flex items-stretch max-sm:grid max-sm:w-full max-sm:grid-cols-2">
              <span className="flex items-center border-r border-light-black pr-16 text-base leading-[1.8] font-light text-white max-sm:hidden">
                {t.filter}
              </span>
              {filters.map((filter) => {
                const selected = active === filter.value

                return (
                  <button
                    key={filter.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActive(selected ? null : filter.value)}
                    className={cn(
                      'flex items-center gap-8 border-r border-light-black px-10 py-10 transition-opacity max-sm:gap-3 max-sm:px-4 max-sm:py-5 max-sm:first-of-type:pl-0 max-sm:last:border-r-0',
                      active && !selected ? 'opacity-40 hover:opacity-70' : 'opacity-100',
                    )}
                  >
                    {filter.icon}
                    <span className="font-display text-[48px] leading-none text-white max-sm:text-[28px]">
                      {filter.label}
                    </span>
                  </button>
                )
              })}
            </div>
            <Button href={hire.href} blank={hire.blank} className="max-sm:hidden">
              {hire.label}
            </Button>
          </div>
        </Container>
      </section>

      <section className="mt-20 max-sm:mt-10">
        <Container>
          {visible.length ? (
            <Projects projects={visible} locale={locale} />
          ) : (
            <p className="py-20 text-center text-gray">{t.empty}</p>
          )}
          <div className="mt-20 flex justify-center max-sm:mt-12">
            <Button href={hire.href} blank={hire.blank} className="max-sm:w-full">
              {hire.label}
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
