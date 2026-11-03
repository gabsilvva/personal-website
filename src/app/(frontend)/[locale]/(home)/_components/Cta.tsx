import Button from '@/components/interface/button/Button'
import Highlight from '@/components/interface/highlight/Highlight'
import Media from '@/components/interface/media/Media'
import Reveal from '@/components/interface/reveal/Reveal'
import Container from '@/components/layout/container/Container'
import type { Media as MediaType } from '@/payload-types'

type Props = {
  title?: string | null
  image?: number | MediaType | null
  hire: { label: string; href: string; blank: boolean }
}

export default function Cta({ title, image, hire }: Props) {
  if (!title) return null

  return (
    <section className="mt-between max-sm:mt-between-mob">
      <Container>
        <Reveal className="@container relative flex flex-col items-center text-center">
          {/* On desktop the phrase and the memoji scale with the content width (1360px in the
              design), so the spaces that offset the lines around the memoji keep the composition */}
          <Media
            resource={image}
            width={200}
            height={212}
            className="pointer-events-none absolute -top-[min(3.5rem,4.118cqw)] left-1/2 z-10 w-[min(200px,14.706cqw)] max-sm:static max-sm:mb-4 max-sm:w-28"
          />
          {/* Long statement: a notch smaller than h1 on small screens so it keeps 5–6 lines.
              The optical size stays at the design's 96px: Fraunces widens its glyphs at smaller
              sizes, which would break the composition. */}
          <h2 className="text-h1 relative sm:text-[min(6rem,7.059cqw)] sm:[font-variation-settings:'opsz'_96,var(--fraunces-axes)] max-sm:text-[clamp(2.25rem,10vw,3.5rem)]">
            <Highlight text={title} />
          </h2>
          <Button href={hire.href} blank={hire.blank} className="mt-20 max-sm:mt-10 max-sm:w-full">
            {hire.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}
