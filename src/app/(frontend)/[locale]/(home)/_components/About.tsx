import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Image from 'next/image'

import Button from '@/components/interface/button/Button'
import Flat from '@/components/interface/button/Flat'
import Media from '@/components/interface/media/Media'
import Reveal from '@/components/interface/reveal/Reveal'
import RichText from '@/components/interface/rich-text/RichText'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Container from '@/components/layout/container/Container'
import type { Media as MediaType } from '@/payload-types'

type Props = {
  subtitle?: string | null
  title?: string | null
  text?: SerializedEditorState | null
  image?: number | MediaType | null
  link?: { label?: string | null; href: string; blank?: boolean } | null
  hire: { label: string; href: string; blank: boolean }
}

export default function About({ subtitle, title, text, image, link, hire }: Props) {
  return (
    <section>
      <Container>
        {/* Thirds, like the Stack below: its first two column lines continue these.
            On mobile the columns dissolve so the text sits between the photo and the buttons. */}
        <div className="grid grid-cols-3 max-sm:flex max-sm:flex-col">
          <div className="flex flex-col border-l border-light-black pt-between max-sm:contents">
            <Reveal className="max-sm:order-1 max-sm:pt-between-mob">
              {subtitle && <Subtitle>{subtitle}</Subtitle>}
              <figure className="relative mt-14 h-40 max-sm:mt-8">
                <Media
                  resource={image}
                  fill
                  sizes="452px"
                  className="object-cover object-[center_20%] opacity-75 grayscale"
                />
                <Image
                  src="/img/signature.png"
                  alt=""
                  width={105}
                  height={160}
                  className="absolute right-16 bottom-20 max-sm:right-6"
                />
              </figure>
            </Reveal>
            <div className="mt-auto flex items-center justify-between gap-6 pt-20 max-sm:order-3 max-sm:pt-10">
              <Button href={hire.href} blank={hire.blank}>
                {hire.label}
              </Button>
              {link?.label && (
                <Flat href={link.href} blank={link.blank}>
                  {link.label}
                </Flat>
              )}
            </div>
          </div>

          <div className="col-span-2 border-l border-light-black max-sm:contents">
            <Reveal className="pt-between pl-[165px] max-sm:order-2 max-sm:pt-10 max-sm:pl-0">
              {title && <h2 className="max-w-[578px]">{title}</h2>}
              <RichText data={text} variant="emphasis" className="mt-10 max-w-[578px]" />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
