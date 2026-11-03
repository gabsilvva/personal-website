'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import Button from '@/components/interface/button/Button'
import Highlight from '@/components/interface/highlight/Highlight'
import Container from '@/components/layout/container/Container'

type Step = { id?: string | null; title: string; text?: string | null }

type Props = {
  title?: string | null
  steps?: Array<Step> | null
  hire: { label: string; href: string; blank: boolean }
}

const number = (index: number) => String(index + 1).padStart(2, '0')

// Same query as the `pin` variant in globals.css
const PIN_QUERY = '(min-width: 1024px) and (min-height: 780px)'
const isPinned = () => window.matchMedia(PIN_QUERY).matches

/**
 * "Do Pixel // Ao Código." — on desktop the section pins to the viewport and scrolling walks
 * through the steps: the active one sits in the middle column, its neighbours blurred on the sides.
 * Desktop windows too short to pin keep the carousel and change steps on click.
 * On mobile the steps are a plain vertical timeline.
 */
export default function Process({ title, steps, hire }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  const count = steps?.length ?? 0

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !count) return

    let frame = 0

    const update = () => {
      frame = 0
      if (!isPinned()) return

      const distance = section.offsetHeight - window.innerHeight
      if (distance <= 0) return

      const progress = Math.min(Math.max(-section.getBoundingClientRect().top / distance, 0), 1)
      setActive(Math.min(count - 1, Math.floor(progress * count)))
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [count])

  if (!steps?.length) return null

  // Scrolls to the middle of the step's slice of the pinned section, or just shows it when not pinned
  const goTo = (step: number) => {
    const section = sectionRef.current
    if (!section) return

    if (!isPinned()) {
      setActive(step)
      return
    }

    const distance = section.offsetHeight - window.innerHeight
    const top = section.getBoundingClientRect().top + window.scrollY + (distance * (step + 0.5)) / count
    window.scrollTo({ top, behavior: 'smooth' })
  }

  // Three copies of the steps so the active one always has a neighbour on each side
  const track = [...steps, ...steps, ...steps]
  const current = count + active

  return (
    // Desktop height: one screen plus 70vh of scrolling per extra step
    <section
      ref={sectionRef}
      style={{ '--steps': count } as React.CSSProperties}
      className="mt-between pin:mt-30 pin:h-[calc(100vh+(var(--steps)-1)*70vh)] max-sm:mt-between-mob"
    >
      <div className="[--gap:5rem] pin:sticky pin:top-0 pin:flex pin:h-screen pin:flex-col pin:justify-center pin:pt-nav pin:[--gap:clamp(1.5rem,5vh,5rem)]">
        <Container>
          {/* While pinned, the title and gaps shrink with the window height so everything fits */}
          {title && (
            <h2 className="text-h1 text-center pin:text-[min(6rem,10vh)]">
              <Highlight text={title} />
            </h2>
          )}

          {/* Desktop: carousel */}
          <div className="@container relative mt-25 pin:mt-[clamp(2rem,6vh,6.25rem)] max-sm:hidden">
            <div className="absolute inset-x-0 top-0 h-30 border border-light-black bg-light-black/32" />

            <div className="overflow-hidden">
              <ol
                className="relative flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
                style={{ transform: `translateX(calc(${1 - current} * 100cqw / 3))` }}
              >
                {track.map((step, index) => {
                  const visible = Math.abs(index - current) <= 1
                  const stepIndex = index % count

                  return (
                    <li
                      key={`${step.id ?? step.title}-${index}`}
                      aria-hidden={!visible}
                      className="w-[calc(100cqw/3)] shrink-0"
                    >
                      <button
                        type="button"
                        tabIndex={visible ? 0 : -1}
                        aria-current={index === current ? 'step' : undefined}
                        onClick={() => goTo(stepIndex)}
                        className="flex h-30 w-full items-center justify-center gap-6"
                      >
                        <span className="relative flex size-16 items-center justify-center">
                          <Image src="/svg/step.svg" alt="" width={64} height={64} className="absolute inset-0" />
                          <span className="font-display relative text-2xl leading-none text-white">
                            {number(stepIndex)}
                          </span>
                        </span>
                        <span className="font-display text-[40px] leading-none text-white">{step.title}</span>
                      </button>
                      {step.text && (
                        <p className="mx-auto mt-(--gap) max-w-[375px] px-4 text-center">{step.text}</p>
                      )}
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* The active step is always the middle column */}
            <span className="absolute top-[118px] left-1/3 h-px w-1/3 bg-white" />

            {/* Neighbours are blurred and darkened towards the edges */}
            <div className="pointer-events-none absolute top-px bottom-[calc(-1*(var(--gap)+4.5rem))] left-px w-[calc(100%/3-1px)] bg-linear-to-r from-black/50 from-[1.663%] to-transparent backdrop-blur-[4px]" />
            <div className="pointer-events-none absolute top-px right-px bottom-[calc(-1*(var(--gap)+4.5rem))] w-[calc(100%/3-1px)] bg-linear-to-l from-black/50 from-[1.663%] to-transparent backdrop-blur-[4px]" />
          </div>

          {/* Mobile: every step at once, as a timeline */}
          <ol className="mt-12 sm:hidden">
            {steps.map((step, index) => (
              <li key={step.id ?? step.title} className="relative flex gap-5 pb-10 last:pb-0">
                {index < steps.length - 1 && <span className="absolute top-12 bottom-0 left-6 w-px bg-light-black" />}
                <span className="font-display flex size-12 shrink-0 items-center justify-center rounded-full border border-light-black bg-dark-gray text-base leading-none text-white">
                  {number(index)}
                </span>
                <div className="pt-3">
                  <h3 className="text-2xl">{step.title}</h3>
                  {step.text && <p className="mt-3">{step.text}</p>}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-(--gap) flex justify-center max-sm:mt-12">
            <Button href={hire.href} blank={hire.blank} className="relative max-sm:w-full">
              {hire.label}
            </Button>
          </div>
        </Container>
      </div>
    </section>
  )
}
