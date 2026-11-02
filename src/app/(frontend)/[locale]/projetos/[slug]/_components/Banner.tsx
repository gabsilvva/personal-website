import Image from 'next/image'

import Button from '@/components/interface/button/Button'
import Flat from '@/components/interface/button/Flat'
import Media, { hasMedia } from '@/components/interface/media/Media'
import Reveal from '@/components/interface/reveal/Reveal'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Container from '@/components/layout/container/Container'
import type { Media as MediaType } from '@/payload-types'

type Props = {
  client?: string | null
  title: string
  logo?: number | MediaType | null
  summary?: string | null
  url?: string | null
  hire: { label: string; href: string; blank: boolean }
  visitLabel: string
}

export default function Banner({ client, title, logo, summary, url, hire, visitLabel }: Props) {
  return (
    <section className="border-b border-light-black pt-30 pb-between max-sm:pt-12 max-sm:pb-between-mob">
      <Container>
        <div className="grid grid-cols-[1fr_561px] gap-10 max-sm:grid-cols-1">
          <Reveal className="flex flex-col justify-between gap-10">
            <div>
              {client && <Subtitle>{client}</Subtitle>}
              <h1 className="mt-8">{title}</h1>
            </div>
            <div className="flex items-center gap-10">
              <Button href={hire.href} blank={hire.blank}>
                {hire.label}
              </Button>
              {url && (
                <Flat href={url} blank>
                  {visitLabel}
                  <Image src="/svg/link.svg" alt="" width={48} height={48} className="size-8" />
                </Flat>
              )}
            </div>
          </Reveal>

          <Reveal delay={150}>
            {hasMedia(logo) && (
              <div className="border-x border-light-black py-6">
                <div className="flex h-[105px] items-center justify-center border-y border-light-black bg-dark-gray">
                  <Media resource={logo} className="h-10 w-auto max-w-[70%] object-contain" />
                </div>
              </div>
            )}
            {summary && <p className="mt-8">{summary}</p>}
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
