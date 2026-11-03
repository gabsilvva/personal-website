'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'

import { rememberLocale } from '@/i18n/client'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { alternatePath } from '@/i18n/routes'
import type { HireLink } from '@/lib/links'
import type { SearchGroup, SearchItem } from '@/lib/search'
import { cn } from '@/utilities/ui'

/** Dispatch on `window` to open the search from anywhere (e.g. the nav button). */
export const OPEN_SEARCH_EVENT = 'search:open'

type Group = SearchGroup | 'actions'

type Result = Omit<SearchItem, 'group'> & {
  group: Group
  run?: () => void | 'keep-open'
}

type Props = {
  locale: Locale
  items: SearchItem[]
  hire: HireLink
  email: string
  t: Dictionary['search']
}

const ORDER: Group[] = ['pages', 'projects', 'uses', 'socials', 'actions']

// Shown before typing; equipment only appears once there is a query
const IDLE: Group[] = ['pages', 'projects', 'actions', 'socials']

/** Lowercase without accents, so "logistica" finds "Logística". */
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))

export default function Search({ locale, items, hire, email, t }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  // Where the focus was before opening (the input takes it on mount), to return it on close
  const returnFocus = useRef<HTMLElement | null>(null)

  const show = () => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setQuery('')
    setActive(0)
    setCopied(false)
    setOpen(true)
  }

  const toggle = useEffectEvent(() => (open ? setOpen(false) : show()))
  const openFromEvent = useEffectEvent(() => show())

  // Ctrl/⌘ + K anywhere (except while typing in a form), or the nav button
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey) && !isTyping(event.target)) {
        event.preventDefault()
        toggle()
      }
    }
    const onOpen = () => openFromEvent()

    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen)
    }
  }, [])

  // A modal: the page behind can't scroll, be clicked or take focus (`inert`), Esc closes from
  // anywhere, and focus goes back to where it was (e.g. the nav button) when it closes
  useEffect(() => {
    if (!open) return

    const previous = returnFocus.current
    const root = rootRef.current
    const behind = [...document.body.children].filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== root && !element.inert,
    )
    behind.forEach((element) => (element.inert = true))
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)

    return () => {
      behind.forEach((element) => (element.inert = false))
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [open])

  const results = useMemo(() => {
    const otherLocale: Locale = locale === 'pt' ? 'en' : 'pt'

    const actions: Result[] = [
      {
        id: 'action-hire',
        group: 'actions',
        // "...pelo WhatsApp" only while the button opens the chat
        label: hire.href.startsWith('https://wa.me/') ? t.actions.hire : hire.label,
        href: hire.href,
        external: hire.blank,
      },
      {
        id: 'action-email',
        group: 'actions',
        label: copied ? t.actions.copied : t.actions.copyEmail,
        description: email,
        href: `mailto:${email}`,
        run: () => {
          void navigator.clipboard?.writeText(email)
          setCopied(true)
          return 'keep-open'
        },
      },
      {
        id: 'action-language',
        group: 'actions',
        label: t.actions.language,
        href: alternatePath(pathname, otherLocale),
        keywords: 'english portugues idioma language',
        run: () => rememberLocale(otherLocale),
      },
    ]

    const all: Result[] = [...items, ...actions]
    const words = normalize(query).split(/\s+/).filter(Boolean)

    const matches = words.length
      ? all.filter((item) => {
          const haystack = normalize(
            [item.label, item.description, item.keywords, t.groups[item.group]].filter(Boolean).join(' '),
          )
          return words.every((word) => haystack.includes(word))
        })
      : all.filter((item) => IDLE.includes(item.group))

    // Grouped in a fixed order; the flat list drives keyboard navigation
    return ORDER.flatMap((group) => matches.filter((item) => item.group === group))
  }, [items, query, locale, pathname, hire.href, email, copied, t])

  const close = () => setOpen(false)

  const select = (result: Result | undefined) => {
    if (!result) return
    if (result.run?.() === 'keep-open') return

    if (result.external) window.open(result.href, '_blank', 'noopener,noreferrer')
    else router.push(result.href)
    close()
  }

  const move = (step: number) => {
    if (!results.length) return
    const next = (active + step + results.length) % results.length
    setActive(next)
    listRef.current?.querySelector(`[data-index="${next}"]`)?.scrollIntoView({ block: 'nearest' })
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      move(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      move(-1)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      select(results[active])
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') {
      // The input is the only stop in the dialog: results are picked with the arrows
      event.preventDefault()
    }
  }

  if (!open) return null

  const activeId = results[active] ? `search-${results[active].id}` : undefined

  return (
    <div ref={rootRef} className="fixed inset-0 z-100 flex items-start justify-center px-pm pt-[12vh] max-sm:pt-4">
      <button
        type="button"
        aria-label={t.hints.close}
        tabIndex={-1}
        onClick={close}
        className="motion-safe:animate-[fade-in_160ms_ease-out] absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.label}
        className="motion-safe:animate-[search-in_180ms_ease-out] relative flex max-h-[min(640px,80vh)] w-full max-w-[640px] flex-col overflow-hidden rounded-lg border border-light-black bg-black shadow-[0_24px_80px_rgba(0,0,0,0.6)] max-sm:max-h-[calc(100dvh-2rem)]"
      >
        <div className="flex h-16 shrink-0 items-center gap-4 border-b border-light-black px-6 max-sm:px-4">
          <Image src="/svg/command.svg" alt="" width={24} height={24} className="size-5 opacity-60" />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={activeId}
            aria-label={t.label}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            placeholder={t.placeholder}
            className="h-full flex-1 bg-transparent text-base font-light text-white outline-none placeholder:text-gray"
          />
          <kbd className="rounded border border-light-black px-1.5 py-0.5 text-[11px] leading-none text-gray max-sm:hidden">
            ESC
          </kbd>
        </div>

        <ul id="search-results" ref={listRef} role="listbox" aria-label={t.label} className="overflow-y-auto pb-2">
          {results.map((result, index) => {
            const first = index === 0 || results[index - 1].group !== result.group

            return (
              <Fragment key={result.id}>
                {first && (
                  <li
                    role="presentation"
                    className="flex items-center gap-3 px-6 pt-5 pb-2 text-xs leading-none text-gray uppercase max-sm:px-4"
                  >
                    <span className="size-1 bg-white" />
                    {t.groups[result.group]}
                  </li>
                )}
                <li
                  id={`search-${result.id}`}
                  role="option"
                  aria-selected={index === active}
                  data-index={index}
                  onMouseMove={() => index !== active && setActive(index)}
                  onClick={() => select(result)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-4 px-6 py-3 max-sm:px-4',
                    index === active && 'bg-dark-gray shadow-[inset_2px_0_0_var(--color-white)]',
                  )}
                >
                  <span className="min-w-0">
                    <span className="font-display block truncate text-lg leading-tight text-white">
                      {result.label}
                    </span>
                    {result.description && (
                      <span className="mt-1 block truncate text-[13px] leading-tight text-gray">
                        {result.description}
                      </span>
                    )}
                  </span>
                  {result.external && (
                    <Image
                      src="/svg/arrow-up-right-small.svg"
                      alt=""
                      width={24}
                      height={24}
                      className="size-4 shrink-0 opacity-60"
                    />
                  )}
                </li>
              </Fragment>
            )
          })}

          {!results.length && (
            <li className="px-6 py-10 text-center text-sm text-gray">
              {t.empty} “{query}”
            </li>
          )}
        </ul>

        <div className="flex shrink-0 items-center gap-5 border-t border-light-black px-6 py-3 text-xs text-gray max-sm:hidden">
          {[
            ['↑↓', t.hints.navigate],
            ['↵', t.hints.open],
            ['esc', t.hints.close],
          ].map(([key, hint]) => (
            <span key={hint} className="flex items-center gap-2">
              <kbd className="rounded border border-light-black px-1.5 py-0.5 text-[11px] leading-none text-light-gray">
                {key}
              </kbd>
              {hint}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
