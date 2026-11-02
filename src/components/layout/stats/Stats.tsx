import CountUp from '@/components/interface/count-up/CountUp'
import Reveal from '@/components/interface/reveal/Reveal'
import Container from '@/components/layout/container/Container'

type Props = {
  items?: Array<{ value: string; label: string }> | null
}

/** "+6 Anos transformando ideias em produto" — the numbers row on the Home and About pages. */
export default function Stats({ items }: Props) {
  if (!items?.length) return null

  return (
    <section className="border-t border-light-black">
      <Container>
        <ul className="grid grid-cols-4 max-sm:grid-cols-2">
          {items.map((item, index) => (
            <li
              key={item.label}
              className="border-l border-light-black pb-16 last:border-r max-sm:pt-6 max-sm:pb-8 max-sm:even:border-r max-sm:[&:nth-child(-n+2)]:border-b"
            >
              <Reveal delay={index * 100}>
                <p className="font-display text-[96px] leading-none text-white max-sm:pl-4 max-sm:text-[clamp(2.5rem,12vw,4rem)]">
                  <CountUp value={item.value} delay={index * 100} />
                </p>
                <p className="mt-6 max-w-[230px] pl-10 text-base leading-[1.8] font-medium text-light-gray max-sm:mt-3 max-sm:pl-4 max-sm:text-sm max-sm:leading-[1.6]">
                  {item.label}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
