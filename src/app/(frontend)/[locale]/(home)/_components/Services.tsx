'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type ReactNode } from 'react'

import type { ProjectCardData } from '@/components/interface/card/Project'
import Media from '@/components/interface/media/Media'
import Tag from '@/components/interface/tag/Tag'
import Container from '@/components/layout/container/Container'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { projectPath } from '@/i18n/routes'
import { cn } from '@/utilities/ui'

type Service = {
  id?: string | null
  title: string
  icon?: string | null
  tagline?: string | null
  text?: string | null
  tags?: string[] | null
  case?: ProjectCardData | null
}

type Props = {
  items: Service[]
  locale: Locale
}

function ServiceIcon({ icon, open }: { icon?: string | null; open: boolean }) {
  const size = 'size-16 max-sm:size-11'

  if (open) return <Image src="/svg/close.svg" alt="" width={64} height={64} className={size} />

  // On hover the circle fills white and the glyph turns black
  const glyph = 'transition-[filter] duration-300 group-hover:brightness-0 group-focus-visible:brightness-0'

  return (
    <span className={cn('relative flex items-center justify-center', size)}>
      <span className="absolute inset-0 scale-75 rounded-full bg-white opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100" />

      {/* Star and hexagon come as bare glyphs, so they sit on the outlined circle */}
      {icon === 'star' || icon === 'hexagon' ? (
        <>
          <Image
            src="/svg/services/circle.svg"
            alt=""
            width={64}
            height={64}
            className={cn('absolute inset-0 size-full', glyph)}
          />
          <Image
            src={`/svg/services/${icon}.svg`}
            alt=""
            width={24}
            height={24}
            className={cn('relative max-sm:size-4', glyph)}
          />
        </>
      ) : (
        <Image
          src={`/svg/services/${icon ?? 'square'}.svg`}
          alt=""
          width={64}
          height={64}
          className={cn('relative size-full', glyph)}
        />
      )}
    </span>
  )
}

/** Opens and closes its content by animating the grid row from 0fr to 1fr. */
function Collapse({ open, className, children }: { open: boolean; className?: string; children: ReactNode }) {
  return (
    <div
      inert={!open}
      className={cn(
        'grid transition-[grid-template-rows] duration-500',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        className,
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

export default function Services({ items, locale }: Props) {
  const t = getDictionary(locale)
  const [active, setActive] = useState<number | null>(0)

  if (!items.length) return null

  return (
    <section className="mt-between max-sm:mt-between-mob">
      <ul className="border-t border-light-black">
        {items.map((service, index) => {
          const open = active === index

          return (
            <li
              key={service.id ?? service.title}
              className={cn(
                'border-b transition-colors duration-500',
                open ? 'border-white' : 'border-light-black',
              )}
            >
              <Container>
                {/* Desktop: the case sits beside the whole open service, from the title down.
                    The second row is 1fr so a case taller than the text grows it, not the title row. */}
                <div className="grid grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_1fr] gap-x-10 max-sm:grid-cols-1">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setActive(open ? null : index)}
                    className={cn(
                      'group col-start-1 row-start-1 flex w-full items-center gap-10 py-12 text-left max-sm:gap-4 max-sm:py-6',
                      // A closed service shows no case, so its tagline can reach into that column.
                      // col-end, not col-span: span would drop col-start-1 and push the button
                      // past the case column into new columns.
                      !open && 'sm:col-end-3',
                    )}
                  >
                    <span className="font-display w-8 shrink-0 text-2xl leading-none text-gray max-sm:hidden">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="shrink-0">
                      <ServiceIcon icon={service.icon} open={open} />
                    </span>
                    <span className="min-w-0 sm:basis-[540px] max-sm:flex-1">
                      <span className="font-display block text-[48px] leading-none text-white max-sm:text-[26px]">
                        {service.title}
                      </span>
                      {service.tagline && (
                        <span className="mt-2 block text-xs leading-[1.4] font-light text-gray uppercase sm:hidden">
                          {service.tagline}
                        </span>
                      )}
                    </span>
                    {service.tagline && !open && (
                      <span className="shrink-0 text-base leading-[1.4] font-light text-gray uppercase motion-safe:animate-[fade-in_300ms_ease-out_250ms_backwards] max-sm:hidden">
                        {service.tagline}
                      </span>
                    )}
                  </button>

                  <Collapse open={open} className="col-start-1 row-start-2">
                    <div className="pb-12 pl-44 max-sm:pb-8 max-sm:pl-0">
                      <div className="max-w-[603px]">
                        {service.text && <p>{service.text}</p>}
                        {!!service.tags?.length && (
                          <ul className="mt-8 flex flex-wrap gap-2 max-sm:mt-5">
                            {service.tags.map((tag) => (
                              <li key={tag}>
                                <Tag>{tag}</Tag>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </Collapse>

                  {service.case && (
                    <Collapse
                      open={open}
                      className="col-start-2 row-span-2 row-start-1 max-sm:col-start-1 max-sm:row-span-1 max-sm:row-start-3"
                    >
                      <div className="w-[clamp(18rem,28vw,25rem)] py-12 max-sm:w-full max-sm:max-w-[480px] max-sm:pt-0 max-sm:pb-8">
                        <Link href={projectPath(locale, service.case.slug)} className="group block">
                          <div className="border-l border-light-black pl-7">
                            <span className="text-base leading-none text-gray">{t.projects.case}</span>
                            <div className="mt-2 flex items-end gap-2">
                              <span className="font-display text-xl leading-none text-white">
                                {service.case.title}
                              </span>
                              {service.case.year && (
                                <span className="text-xs leading-none font-light text-gray">{service.case.year}</span>
                              )}
                            </div>
                          </div>
                          <figure className="relative mt-4 aspect-[400/333] overflow-hidden rounded-lg bg-dark-gray">
                            <Media
                              resource={service.case.thumbnail}
                              fill
                              sizes="400px"
                              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            />
                            {service.case.soon && (
                              <Tag variant="soon" className="absolute top-6 left-6">
                                {t.soon}
                              </Tag>
                            )}
                          </figure>
                        </Link>
                      </div>
                    </Collapse>
                  )}
                </div>
              </Container>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
