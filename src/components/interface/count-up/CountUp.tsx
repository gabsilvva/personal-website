'use client'

import { useEffect, useRef } from 'react'

type Props = {
  /** As typed in the CMS, e.g. "+6" or "+1MM": only the number counts, the rest stays put. */
  value: string
  /** Waits before counting, to match a surrounding reveal. */
  delay?: number
  duration?: number
}

const NUMBER = /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t))

/**
 * Counts up from zero the first time the number scrolls into view. The server renders the final
 * value, so it is there without JavaScript and for screen readers.
 */
export default function CountUp({ value, delay = 0, duration = 1800 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    const match = value.match(NUMBER)
    if (!element || !match || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const [, prefix, number, suffix] = match
    const separator = number.includes(',') ? ',' : '.'
    const decimals = number.split(separator)[1]?.length ?? 0
    const target = Number(number.replace(',', '.'))
    const render = (current: number) => {
      element.textContent = `${prefix}${current.toFixed(decimals).replace('.', separator)}${suffix}`
    }

    let frame = 0
    let timer = 0
    render(0)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        timer = window.setTimeout(() => {
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            render(target * easeOutExpo(progress))
            if (progress < 1) frame = requestAnimationFrame(tick)
          }
          frame = requestAnimationFrame(tick)
        }, delay)
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(element)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(frame)
      element.textContent = value
    }
  }, [value, delay, duration])

  return (
    <>
      <span ref={ref} aria-hidden>
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  )
}
