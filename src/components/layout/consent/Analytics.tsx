'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useState, useSyncExternalStore } from 'react'

import type { Dictionary } from '@/i18n/dictionaries'
import { cn } from '@/utilities/ui'

type Choice = 'granted' | 'denied'

type Props = {
  /** GA4 measurement ID (G-...). Without it nothing loads and no notice is shown. */
  gaId?: string
  privacyHref?: string
  t: Dictionary['consent']
}

/** Reopens the notice, e.g. from "Preferências de cookies" in the footer. */
export const OPEN_CONSENT_EVENT = 'open-cookie-consent'

const KEY = 'cookie-consent'
const CHANGE_EVENT = 'cookie-consent-change'

const readChoice = (): Choice | null => {
  try {
    const value = localStorage.getItem(KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

const subscribe = (callback: () => void) => {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void } & Record<string, unknown>

/** Removes the Google Analytics cookies (_ga, _ga_*) from this host and its parent domains. */
const clearAnalyticsCookies = () => {
  const names = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_') || name === '_gid')
  const parts = location.hostname.split('.')
  const domains = parts.map((_, index) => parts.slice(index).join('.'))

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/`
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`
  }
}

/** Stores the choice and applies it to a GA script that may already be running in this page. */
const saveChoice = (gaId: string, value: Choice) => {
  const w = window as unknown as GtagWindow
  // GA's own opt-out switch
  w[`ga-disable-${gaId}`] = value === 'denied'
  if (value === 'denied') clearAnalyticsCookies()
  else w.gtag?.('config', gaId)

  try {
    localStorage.setItem(KEY, value)
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/**
 * LGPD: Google Analytics only loads after the visitor accepts. The choice is stored in this
 * browser; declining (or withdrawing later) stops the tracking and deletes its cookies.
 */
export default function Analytics({ gaId, privacyHref, t }: Props) {
  // The server renders no notice; the browser decides once it can read the stored choice
  const choice = useSyncExternalStore(subscribe, readChoice, () => 'unknown' as const)
  const [reopened, setReopened] = useState(false)

  useEffect(() => {
    const open = () => setReopened(true)
    window.addEventListener(OPEN_CONSENT_EVENT, open)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open)
  }, [])

  if (!gaId) return null

  const decide = (value: Choice) => {
    saveChoice(gaId, value)
    setReopened(false)
  }

  const visible = choice === null || (reopened && choice !== 'unknown')

  return (
    <>
      {choice === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}

      {visible && (
        <section
          role="dialog"
          aria-label={t.label}
          className="fixed bottom-6 left-6 z-100 w-105 rounded-lg border border-light-black bg-dark-gray p-6 motion-safe:animate-[fade-in_300ms_ease-out] max-sm:inset-x-pm max-sm:bottom-4 max-sm:w-auto max-sm:p-5"
        >
          <p className="text-sm leading-[1.7] font-light text-gray">
            {t.text}{' '}
            {privacyHref && (
              <Link href={privacyHref} className="font-normal text-white underline hover:opacity-70">
                {t.policy}
              </Link>
            )}
          </p>

          {/* Declining is as easy as accepting */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {(['denied', 'granted'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => decide(value)}
                className={cn(
                  'font-display h-12 rounded-lg text-base leading-none transition-colors',
                  value === 'granted'
                    ? 'bg-white text-black hover:bg-light-gray'
                    : 'border border-light-black text-white hover:bg-light-black',
                )}
              >
                {value === 'granted' ? t.accept : t.reject}
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
