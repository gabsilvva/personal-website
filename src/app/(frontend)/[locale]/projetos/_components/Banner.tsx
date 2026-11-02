import Highlight from '@/components/interface/highlight/Highlight'
import Reveal from '@/components/interface/reveal/Reveal'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import Container from '@/components/layout/container/Container'

type Props = {
  subtitle?: string | null
  title?: string | null
  text?: string | null
}

export default function Banner({ subtitle, title, text }: Props) {
  return (
    <section className="pt-30 pb-20 max-sm:pt-12 max-sm:pb-10">
      <Container>
        <Reveal>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
          <div className="mt-8 flex items-center justify-between gap-10 max-sm:flex-col max-sm:items-start">
            {title && (
              <h1 className="max-w-[695px]">
                <Highlight text={title} />
              </h1>
            )}
            {text && <p className="max-w-[380px] text-right max-sm:text-left">{text}</p>}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
