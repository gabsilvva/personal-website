'use client'

import { useEffect, useState } from 'react'

import type { Locale } from '@/i18n/config'

// "Hello" around the world; each locale starts with its own word
const WORDS = [
  'Olá',
  'Hello',
  'Hola',
  'Bonjour',
  'Ciao',
  'Hallo',
  'Hej',
  'Merhaba',
  'Namaste',
  'Salut',
  'Aloha',
  'Jambo',
  'Konnichiwa',
  'Annyeong',
]

const FIRST: Record<Locale, string> = { pt: 'Olá', en: 'Hello' }

const INTERVAL = 2200 // time each word stays on screen
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Props = {
  locale: Locale
  className?: string
}

/**
 * "// OLÁ" that keeps cycling through other languages: the word leaves upwards while the next
 * one comes in from below. Screen readers get the locale's word once; with reduced motion the
 * word never changes.
 */
export default function Greeting({ locale, className }: Props) {
  const words = [FIRST[locale], ...WORDS.filter((word) => word !== FIRST[locale])]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion()) return
    const timer = setInterval(() => setIndex((current) => current + 1), INTERVAL)
    return () => clearInterval(timer)
  }, [])

  const current = words[index % words.length]
  const previous = index > 0 ? words[(index - 1) % words.length] : null

  return (
    <p className={className}>
      <span className="sr-only">{FIRST[locale]}</span>
      <span aria-hidden="true" className="inline-flex gap-[0.4em]">
        <span>{'//'}</span>
        {/* Both words share one grid cell, clipped, so one slides out as the other slides in */}
        {/* The padding keeps accents (Á) inside the clip; the negative margin keeps the line height */}
        <span className="-my-[0.2em] inline-grid overflow-hidden py-[0.2em]">
          {previous && (
            <span
              key={`out-${index}`}
              className="col-start-1 row-start-1 animate-[greeting-out_500ms_ease-in-out_forwards]"
            >
              {previous}
            </span>
          )}
          <span
            key={`in-${index}`}
            className={
              index > 0 ? 'col-start-1 row-start-1 animate-[greeting-in_500ms_ease-in-out]' : 'col-start-1 row-start-1'
            }
          >
            {current}
          </span>
        </span>
      </span>
    </p>
  )
}
