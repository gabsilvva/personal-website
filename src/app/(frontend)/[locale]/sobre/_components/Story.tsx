import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import Media from '@/components/interface/media/Media'
import Reveal from '@/components/interface/reveal/Reveal'
import RichText from '@/components/interface/rich-text/RichText'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Container from '@/components/layout/container/Container'
import type { Media as MediaType } from '@/payload-types'

type Props = {
  subtitle?: string | null
  text?: SerializedEditorState | null
  favorites?: Array<{ label: string; value: string }> | null
  image?: number | MediaType | null
}

export default function Story({ subtitle, text, favorites, image }: Props) {
  return (
    <section className="mt-between max-sm:mt-between-mob">
      <Container>
        <div className="grid grid-cols-[1fr_380px] gap-10 max-sm:grid-cols-1">
          <Reveal>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            <RichText
              data={text}
              variant="emphasis"
              className="mt-8 max-w-[860px] text-xl [&_p]:text-xl max-sm:[&_p]:text-base"
            />
          </Reveal>

          {!!favorites?.length && (
            <div className="relative -mr-pd border-l border-light-black max-sm:mr-0 max-sm:border-l-0">
              <dl className="max-sm:grid max-sm:grid-cols-2 max-sm:border-t max-sm:border-light-black">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.label}
                    className="border-b border-light-black px-5 py-6 max-sm:px-0 max-sm:py-5 max-sm:even:pl-4 max-sm:odd:border-r max-sm:odd:pr-4"
                  >
                    <dt className="text-[13px] leading-[1.4] text-gray">{favorite.label}</dt>
                    <dd className="font-display mt-3 text-xl leading-[1.2] text-white max-sm:text-lg">{favorite.value}</dd>
                  </div>
                ))}
              </dl>
              <Media
                resource={image}
                width={200}
                height={212}
                className="absolute -bottom-12 -left-[170px] w-[200px] max-sm:hidden"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
