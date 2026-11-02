import Image from 'next/image'

import Button from '@/components/interface/button/Button'
import Highlight from '@/components/interface/highlight/Highlight'
import Location from '@/components/interface/location/Location'
import Media from '@/components/interface/media/Media'
import Reveal from '@/components/interface/reveal/Reveal'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Container from '@/components/layout/container/Container'
import type { Media as MediaType, Setting } from '@/payload-types'

type Props = {
  title?: string | null
  subtitle?: string | null
  image?: number | MediaType | null
  text?: string | null
  hire: { label: string; href: string; blank: boolean }
  location?: Setting['location']
}

export default function Hero({ title, subtitle, image, text, hire, location }: Props) {
  return (
    <section>
      <Container>
        <div className="grid grid-cols-[339px_1fr] pt-[138px] max-sm:grid-cols-1 max-sm:pt-12">
          <div className="border-x border-light-black max-sm:hidden">
            <div className="flex h-[305px] items-center justify-center bg-dark-gray">
              <Image src="/img/signature.png" alt="" width={105} height={160} />
            </div>
          </div>

          <div>
            <Reveal className="relative border-b border-light-black pb-4">
              <Media
                resource={image}
                width={120}
                height={120}
                className="absolute -top-[18px] left-0 size-30 rounded-full object-cover object-[center_8%] grayscale max-sm:static max-sm:mb-6 max-sm:size-20"
              />
              {title && (
                <h1 className="indent-[140px] max-sm:indent-0">
                  <Highlight text={title} />
                </h1>
              )}
            </Reveal>

            <Reveal className="pt-[110px] pb-between max-sm:pt-10 max-sm:pb-between-mob">
              {subtitle && <Subtitle>{subtitle}</Subtitle>}
              {text && <p className="mt-8 max-w-[640px] text-white">{text}</p>}
              <div className="mt-12 flex items-center gap-10 max-sm:mt-10 max-sm:flex-col max-sm:items-stretch max-sm:gap-8">
                <Button href={hire.href} blank={hire.blank} className="max-sm:w-full">
                  {hire.label}
                </Button>
                {location && <Location city={location.city} utc={location.utc} timezone={location.timezone} />}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
