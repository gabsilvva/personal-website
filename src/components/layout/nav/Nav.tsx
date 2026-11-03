'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'

import Button from '@/components/interface/button/Button'
import Tag from '@/components/interface/tag/Tag'
import Container from '@/components/layout/container/Container'
import { OPEN_SEARCH_EVENT } from '@/components/layout/search/Search'
import { rememberLocale } from '@/i18n/client'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { alternatePath, routePath } from '@/i18n/routes'
import type { HireLink } from '@/lib/links'
import { cn } from '@/utilities/ui'

export type NavItem = {
  label: string
  href: string | null
  blank?: boolean
  soon?: boolean
}

type Props = {
  locale: Locale
  items: NavItem[]
  hire: HireLink
  t: Dictionary['nav']
}

const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))

// The shortcut label follows the platform; the server renders the Windows one
const noSubscribe = () => () => {}
const detectMac = () => /Mac|iPhone|iPad/i.test(navigator.userAgent)

export default function Nav({ locale, items, hire, t }: Props) {
  const pathname = usePathname()
  const isMac = useSyncExternalStore(noSubscribe, detectMac, () => false)
  const otherLocale: Locale = locale === 'pt' ? 'en' : 'pt'
  const languageHref = alternatePath(pathname, otherLocale)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The page behind the mobile menu must not scroll; Esc closes it
  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Close the mobile menu after navigating
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 z-90 flex h-nav w-full items-center border-b transition-colors max-sm:h-nav-mob',
          scrolled || open ? 'border-light-black bg-black/90 backdrop-blur-md' : 'border-transparent bg-transparent',
          open && 'max-sm:bg-black',
        )}
      >
        <Container className="h-full">
          <div className="flex h-full items-center justify-between">
            <div className="flex h-full items-center">
              <Link href={routePath(locale, 'home')} aria-label={t.home} className="shrink-0">
                <Image src="/svg/logo.svg" alt="GAB.S" width={92} height={24}/>
              </Link>

              <span className="mx-16 h-8 w-px bg-light-black max-sm:hidden" />

              <ul className="flex items-center gap-10 max-sm:hidden">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.soon || !item.href ? (
                      <span className="flex items-center gap-2 text-[15px] leading-none font-medium text-gray">
                        {item.label}
                        {item.soon && <Tag variant="mini">SOON</Tag>}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        target={item.blank ? '_blank' : undefined}
                        rel={item.blank ? 'noopener noreferrer' : undefined}
                        className="block text-[15px] leading-none font-medium text-white transition-opacity hover:opacity-70"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-10 max-sm:gap-6">
              <button
                type="button"
                onClick={openSearch}
                aria-label={t.search}
                aria-keyshortcuts="Control+K Meta+K"
                className="flex items-center gap-3 text-[15px] leading-none font-medium text-white transition-opacity hover:opacity-70"
              >
                <Image src="/svg/command.svg" alt="" width={24} height={24} />
                <span className="max-sm:hidden">
                  <span className="font-light text-gray">{t.press}</span> {isMac ? '⌘ + K' : 'CTRL + K'}
                </span>
              </button>

              {/* Same page in the other language */}
              <Link
                href={languageHref}
                hrefLang={otherLocale}
                aria-label={t.switchLanguage}
                onClick={() => rememberLocale(otherLocale)}
                className="flex items-center gap-3 text-[15px] leading-none font-medium text-white uppercase transition-opacity hover:opacity-70"
              >
                <Image src="/svg/translate.svg" alt="" width={24} height={24} />
                {otherLocale}
              </Link>

              <button
                type="button"
                aria-label={open ? t.closeMenu : t.openMenu}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen(!open)}
                className="-mr-2 flex size-10 flex-col items-center justify-center gap-1.5 sm:hidden"
              >
                <span
                  className={cn('h-px w-6 bg-white transition-transform', open && 'translate-y-[3.5px] rotate-45')}
                />
                <span
                  className={cn('h-px w-6 bg-white transition-transform', open && 'translate-y-[-3.5px] -rotate-45')}
                />
              </button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Outside the nav: its backdrop-filter would become the containing block of this fixed panel */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-x-0 top-nav-mob bottom-0 z-80 flex flex-col justify-between overflow-y-auto bg-black px-pm pt-2 pb-8 transition-[opacity,visibility] duration-300 sm:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <ul>
          {items.map((item, index) => (
            <li
              key={item.label}
              className={cn(
                'border-b border-light-black transition-transform duration-500',
                open ? 'translate-y-0' : 'translate-y-3',
              )}
              style={{ transitionDelay: open ? `${index * 50}ms` : '0ms' }}
            >
              {item.soon || !item.href ? (
                <span className="font-display flex items-center gap-3 py-5 text-[40px] leading-none text-gray">
                  {item.label}
                  {item.soon && <Tag variant="mini">SOON</Tag>}
                </span>
              ) : (
                <Link
                  href={item.href}
                  target={item.blank ? '_blank' : undefined}
                  rel={item.blank ? 'noopener noreferrer' : undefined}
                  onClick={() => setOpen(false)}
                  className="font-display flex items-center justify-between py-5 text-[40px] leading-none text-white"
                >
                  {item.label}
                  <Image src="/svg/arrow-up-right-small.svg" alt="" width={24} height={24} className="size-5" />
                </Link>
              )}
            </li>
          ))}
        </ul>

        <Button href={hire.href} blank={hire.blank} full className="mt-10">
          {hire.label}
        </Button>
      </div>
    </>
  )
}
