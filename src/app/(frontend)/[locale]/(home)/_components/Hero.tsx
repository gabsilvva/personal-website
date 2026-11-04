import Link from 'next/link'

import Location from '@/components/interface/location/Location'
import Media from '@/components/interface/media/Media'
import Reveal from '@/components/interface/reveal/Reveal'
import Container from '@/components/layout/container/Container'
import type { Media as MediaType, Setting } from '@/payload-types'

type Props = {
  greeting?: string | null
  title?: string | null
  rolesLeft?: string | null
  rolesLabel?: string | null
  rolesRight?: string | null
  image?: number | MediaType | null
  avatar?: number | MediaType | null
  cta: { label?: string | null; title?: string | null; href: string; blank: boolean }
  text?: string | null
  location?: Setting['location']
}

export default function Hero({
  greeting,
  title,
  rolesLeft,
  rolesLabel,
  rolesRight,
  image,
  avatar,
  cta,
  text,
  location,
}: Props) {
  return (
    <section>
      {/* Desktop: the photo floats behind the content. Mobile: blocks are stacked with `order` */}
      <Container className="relative flex flex-col">
        <figure className="pointer-events-none absolute -top-10 left-1/2 h-[800px] w-[428px] max-sm:relative max-sm:top-auto max-sm:left-auto max-sm:order-2 max-sm:-mx-pm max-sm:mt-6 max-sm:h-[min(118vw,760px)] max-sm:w-[calc(100%+var(--spacing-pm)*2)]">
          <Media
            resource={image}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 428px"
            className="object-cover object-top grayscale"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-black max-sm:h-3/5" />
        </figure>

        <Reveal className="relative max-sm:order-1">
          <div className="flex items-start justify-between gap-10 pt-30 max-sm:flex-col max-sm:gap-6 max-sm:pt-10">
            <div>
              {greeting && <p className="text-base leading-none font-normal text-gray uppercase">{greeting}</p>}
              {title && <h1 className="mt-4">{title}</h1>}
            </div>
            {location && (
              <div className="mt-14 max-sm:mt-0">
                <Location city={location.city} utc={location.utc} timezone={location.timezone} />
              </div>
            )}
          </div>
        </Reveal>

        <Reveal className="relative z-10 max-sm:order-3 max-sm:-mt-36">
          <div className="mt-20 flex items-center max-sm:mt-0 max-sm:flex-wrap">
            {rolesLeft && (
              <p className="font-display text-right text-2xl leading-[1.2] font-normal whitespace-pre-line text-white max-sm:ml-4 max-sm:text-left max-sm:text-xl">
                {rolesLeft}
              </p>
            )}
            <Media
              resource={avatar}
              width={64}
              height={64}
              className="ml-6 size-16 rounded-full object-cover max-sm:order-first max-sm:ml-0 max-sm:size-12 opacity-75"
            />
            {rolesLabel && (
              <span className="ml-8 text-sm leading-none text-gray max-sm:mt-6 max-sm:ml-0 max-sm:w-full">
                {rolesLabel}
              </span>
            )}
            {rolesRight && (
              <p className="font-display ml-8 text-2xl leading-[1.67] font-normal whitespace-pre-line text-white max-sm:mt-2 max-sm:ml-0 max-sm:w-full max-sm:text-xl max-sm:leading-[1.4]">
                {rolesRight}
              </p>
            )}
          </div>
        </Reveal>

        <div className="relative mt-50 flex items-center justify-between gap-10 max-sm:order-4 max-sm:mt-10 max-sm:flex-col max-sm:items-stretch max-sm:gap-8">
          <Link
            href={cta.href}
            target={cta.blank ? '_blank' : undefined}
            rel={cta.blank ? 'noopener noreferrer' : undefined}
            className="flex h-42 w-[440px] flex-col justify-center gap-6 rounded-lg bg-white px-12 transition-colors hover:bg-light-gray max-sm:h-28 max-sm:w-full max-sm:gap-4 max-sm:px-6"
          >
            {cta.label && (
              <span className="text-base leading-none text-graphite uppercase max-sm:text-sm">{cta.label}</span>
            )}
            {cta.title && (
              <span className="font-display text-[32px] leading-none text-black max-sm:text-[28px]">{cta.title}</span>
            )}
          </Link>
          {text && <p className="max-w-[320px] text-right text-white max-sm:max-w-none max-sm:text-left">{text}</p>}
        </div>
      </Container>
    </section>
  )
}
