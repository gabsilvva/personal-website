import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import Media, { hasMedia } from '@/components/interface/media/Media'
import Reveal from '@/components/interface/reveal/Reveal'
import RichText from '@/components/interface/rich-text/RichText'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Container from '@/components/layout/container/Container'
import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Props = {
  subtitle?: string | null
  text?: SerializedEditorState | null
  favorites?: Array<{ label: string; value: string }> | null
  image?: number | MediaType | null
}

export default function Story({ subtitle, text, favorites, image }: Props) {
  // The memoji hangs 48px below the list and is 212px tall: both columns keep that space free
  // at the bottom (desktop only), so no text ever sits behind it
  const memojiSpace = hasMedia(image) && 'sm:pb-44'

  return (
    <section className="mt-between max-sm:mt-between-mob">
      <Container>
        {/* The list takes the 4th column of the stats above and the links below, so its line
            continues theirs: it rises through the gap up to the stats */}
        <div className="grid grid-cols-4 max-sm:grid-cols-1 max-sm:gap-10">
          <Reveal className={cn('col-span-3 pr-10 max-sm:col-span-1 max-sm:pr-0', memojiSpace)}>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            <RichText
              data={text}
              variant="emphasis"
              className="mt-8 max-w-[830px] text-xl [&_p]:text-xl max-sm:[&_p]:text-base"
            />
          </Reveal>

          {!!favorites?.length && (
            <div
              className={cn(
                'relative -mt-between -mr-pd border-l border-light-black pt-between max-sm:mt-0 max-sm:mr-0 max-sm:border-l-0 max-sm:pt-0',
                memojiSpace,
              )}
            >
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
                // In front of the links line that continues this column's line below
                className="absolute -bottom-12 -left-[170px] z-10 w-[200px] max-sm:hidden"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
