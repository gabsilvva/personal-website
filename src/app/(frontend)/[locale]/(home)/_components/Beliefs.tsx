import Button from '@/components/interface/button/Button'
import Highlight from '@/components/interface/highlight/Highlight'
import Reveal from '@/components/interface/reveal/Reveal'
import Container from '@/components/layout/container/Container'

type Props = {
  title?: string | null
  items?: Array<{ title: string; text?: string | null }> | null
  hire: { label: string; href: string; blank: boolean }
}

export default function Beliefs({ title, items, hire }: Props) {
  return (
    <section>
      <Container>
        <div className="grid grid-cols-2 max-sm:grid-cols-1">
          <Reveal className="pt-between pb-12 max-sm:pt-between-mob max-sm:pb-10">
            {title && (
              <h2 className="max-w-[520px]">
                <Highlight text={title} />
              </h2>
            )}
            <Button href={hire.href} blank={hire.blank} className="mt-20 max-sm:hidden">
              {hire.label}
            </Button>
          </Reveal>

          {!!items?.length && (
            <ol className="flex flex-col gap-20 border-l border-light-black pt-between max-sm:gap-10 max-sm:pt-0">
              {items.map((item, index) => (
                <li key={item.title} className="relative pl-10 max-sm:pl-6">
                  <span className="absolute top-3.5 -left-px size-1 bg-white" />
                  <Reveal delay={index * 100}>
                    <div className="flex gap-6 max-sm:gap-4">
                      <span className="font-display text-[32px] leading-none text-gray max-sm:text-2xl">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-h5 max-sm:text-2xl">{item.title}</h3>
                        {item.text && <p className="mt-8 max-w-[400px] max-sm:mt-3">{item.text}</p>}
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* On mobile the button closes the section instead of splitting title and list */}
        <Button href={hire.href} blank={hire.blank} full className="mt-12 sm:hidden">
          {hire.label}
        </Button>
      </Container>
    </section>
  )
}
