import Image from 'next/image'

import Highlight from '@/components/interface/highlight/Highlight'
import Reveal from '@/components/interface/reveal/Reveal'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Tag from '@/components/interface/tag/Tag'
import Container from '@/components/layout/container/Container'

type Props = {
  subtitle?: string | null
  title?: string | null
  coins?: string[] | null
}

export default function Payment({ subtitle, title, coins }: Props) {
  if (!coins?.length) return null

  // Each half of the marquee repeats the coins so it is always wider than the screen
  const half = [...coins, ...coins]

  return (
    <section className="mt-between max-sm:mt-between-mob">
      <Container>
        <Reveal>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
          <div className="mt-8 flex items-center justify-between gap-10 max-sm:mt-6 max-sm:flex-col max-sm:items-start max-sm:gap-8">
            {title && (
              <h2 className="shrink-0">
                <Highlight text={title} />
              </h2>
            )}
            {/* 120px coins, one every 72px (48px overlap), as in the design */}
            <ul className="flex -space-x-12 max-sm:-space-x-5">
              {coins.map((coin) => (
                <li key={coin} className="size-30 shrink-0 max-sm:size-14">
                  <Image
                    src={`/svg/crypto/${coin}.svg`}
                    alt={coin.toUpperCase()}
                    width={124}
                    height={124}
                    className="size-full scale-[1.034]"
                  />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Decorative marquee: the coins are already listed above */}
        <div aria-hidden className="relative mt-20 overflow-hidden max-sm:mt-10">
          <span className="absolute inset-x-0 top-1/2 h-px bg-light-black" />

          <div className="relative flex w-max hover:[animation-play-state:paused] motion-safe:animate-[marquee_45s_linear_infinite]">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 gap-20 pr-20 max-sm:gap-10 max-sm:pr-10">
                {half.map((coin, index) => (
                  <li key={`${coin}-${index}`}>
                    <Tag>{coin.toUpperCase()}</Tag>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          <span className="pointer-events-none absolute inset-y-0 left-0 w-50 bg-linear-to-r from-black to-transparent max-sm:w-16" />
          <span className="pointer-events-none absolute inset-y-0 right-0 w-50 bg-linear-to-l from-black to-transparent max-sm:w-16" />
        </div>
      </Container>
    </section>
  )
}
