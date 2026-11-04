'use client'

import Image from 'next/image'
import { useEffect, useState, useSyncExternalStore } from 'react'

import { cn } from '@/utilities/ui'

/** Set on <html> once the loadscreen has been seen in this session (see `loadscreenScript`). */
const SEEN_ATTRIBUTE = 'data-loaded'
const STORAGE_KEY = 'loadscreen-seen'

const MIN_DURATION = 900 // never flashes
const MAX_DURATION = 6000 // never blocks the site

/**
 * Runs before the page paints: visitors who already saw the loadscreen in this session never
 * see it again, not even for a frame. Inline in <head>, so it must stay tiny and self-contained.
 */
// Skipped when already seen or with reduced motion; if the app never hydrates, it still
// leaves after 8s (the intro lasts up to 6s) so the page is never stuck behind it
export const loadscreenScript = `(function(){var d=document.documentElement,done=function(){d.setAttribute('${SEEN_ATTRIBUTE}','')};try{if(sessionStorage.getItem('${STORAGE_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)done()}catch(e){}setTimeout(done,8000)})()`

const noSubscribe = () => () => {}
const alreadySeen = () => document.documentElement.hasAttribute(SEEN_ATTRIBUTE)

/**
 * `loadscreenScript` in the server HTML only. The server snapshot also applies while hydrating,
 * so the tag matches; a later client mount (switching locale remounts the root layout) renders
 * nothing, since React never runs a script it creates and warns about it.
 */
export function LoadscreenScript() {
  const fromServer = !useSyncExternalStore(noSubscribe, () => true, () => false)
  return fromServer ? <script dangerouslySetInnerHTML={{ __html: loadscreenScript }} /> : null
}

/** Share of the visible images and the fonts that finished loading, from 0 to 1. */
const loadedShare = () => {
  const images = [...document.images].filter((image) => image.loading !== 'lazy')
  const done = images.filter((image) => image.complete).length
  const fonts = document.fonts?.status === 'loaded' ? 1 : 0
  return (done + fonts) / (images.length + 1)
}

/**
 * First-visit loading screen from the design: the logo on a band across the screen, the
 * percentage under it and a progress line. The count follows the real loading of images and
 * fonts, then the screen slides up.
 */
export default function Loadscreen() {
  const seen = useSyncExternalStore(noSubscribe, alreadySeen, () => false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'done'>('loading')

  useEffect(() => {
    if (seen) return

    const start = performance.now()
    let shown = 0
    let pageLoaded = document.readyState === 'complete'
    let frame = 0

    const onLoad = () => {
      pageLoaded = true
    }
    window.addEventListener('load', onLoad)

    // Eases the shown value towards the real one; 100 only once the page has loaded
    const tick = () => {
      const elapsed = performance.now() - start
      const finished = (pageLoaded && elapsed >= MIN_DURATION) || elapsed >= MAX_DURATION
      const target = finished ? 100 : Math.min(loadedShare() * 100, 95)

      shown = Math.min(100, shown + Math.max((target - shown) * 0.08, target > shown ? 0.4 : 0))
      setProgress(Math.floor(shown))

      if (shown >= 99.5) {
        setProgress(100)
        setTimeout(() => setPhase('leaving'), 250)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('load', onLoad)
    }
  }, [seen])

  // Remember for the session and release the page
  const finish = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {}
    document.documentElement.setAttribute(SEEN_ATTRIBUTE, '')
    setPhase('done')
  }

  if (seen || phase === 'done') return null

  return (
    <div
      id="loadscreen"
      role="progressbar"
      aria-label="GAB.S"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      onTransitionEnd={(event) => event.target === event.currentTarget && phase === 'leaving' && finish()}
      className={cn(
        'fixed inset-0 z-200 overflow-hidden bg-black [--band:32px] [--col:124px] [--row:82px]',
        'transition-[clip-path] duration-800 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:duration-0',
        phase === 'leaving' ? '[clip-path:inset(0_0_100%_0)]' : '[clip-path:inset(0_0_0_0)]',
      )}
    >
      {/* Panels */}
      <span className="absolute top-0 left-1/2 h-[calc(50%-var(--band)/2)] w-(--col) -translate-x-1/2 bg-shade" />
      <span className="absolute inset-x-0 top-[calc(50%-var(--band)/2)] h-(--band) bg-shade" />
      <span className="absolute top-[calc(50%+var(--band)/2)] left-0 h-(--row) w-[calc(50%-var(--col)/2)] bg-shade" />
      <span className="absolute top-[calc(50%+var(--band)/2+var(--row))] right-0 bottom-0 w-[calc(50%-var(--col)/2)] bg-shade" />

      {/* Lines */}
      <span className="absolute inset-y-0 left-[calc(50%-var(--col)/2)] w-px bg-light-black/60" />
      <span className="absolute inset-y-0 left-[calc(50%+var(--col)/2)] w-px bg-light-black/60" />
      <span className="absolute inset-x-0 top-[calc(50%-var(--band)/2)] h-px bg-light-black/60" />
      <span className="absolute inset-x-0 top-[calc(50%+var(--band)/2)] h-px bg-light-black/60" />
      <span className="absolute inset-x-0 top-[calc(50%+var(--band)/2+var(--row))] h-px bg-light-black/60" />

      <div
        className={cn(
          'transition-opacity duration-300',
          phase === 'leaving' && 'opacity-0',
        )}
      >
        <Image
          src="/svg/logo-footer.svg"
          alt=""
          width={122}
          height={32}
          className="absolute top-1/2 left-1/2 -translate-1/2 motion-safe:animate-[fade-in_600ms_ease-out]"
        />

        <div className="absolute top-[calc(50%+var(--band)/2)] left-1/2 flex h-(--row) w-(--col) -translate-x-1/2 items-center justify-center">
          <span
            className={cn(
              'font-display text-lg leading-none tabular-nums transition-colors',
              progress === 100 ? 'text-white' : 'text-gray',
            )}
          >
            {progress}%
          </span>
          <span className="absolute bottom-0 left-0 h-0.5 bg-white" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
