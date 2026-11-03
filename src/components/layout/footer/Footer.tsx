import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

import Button from '@/components/interface/button/Button'
import Flat from '@/components/interface/button/Flat'
import Subtitle from '@/components/interface/subtitle/Subtitle'
import ConsentButton from '@/components/layout/consent/ConsentButton'
import Container from '@/components/layout/container/Container'
import type { Dictionary } from '@/i18n/dictionaries'
import type { HireLink } from '@/lib/links'

type Props = {
  contact: {
    subtitle?: string | null
    title?: string | null
    email: string
  }
  /** Home path in the current locale. */
  home: string
  hire: HireLink
  socials: Array<{ label: string; url: string }>
  legalText?: string | null
  legalLinks: Array<{ label: string; href: string; blank: boolean }>
  /** Shows "Preferências de cookies" when the site uses analytics cookies. */
  cookies?: boolean
  t: Dictionary['footer']
}

export default function Footer({ contact, home, hire, socials, legalText, legalLinks, cookies, t }: Props) {
  const year = new Date().getFullYear().toString()

  return (
    <footer className="relative mt-between overflow-hidden pb-30 max-sm:mt-between-mob max-sm:pb-16">
      <Image
        src="/svg/logo-watermark.svg"
        alt=""
        width={1440}
        height={376}
        className="pointer-events-none absolute bottom-30 left-1/2 w-[1440px] max-w-none -translate-x-1/2 max-sm:bottom-24 max-sm:w-[640px]"
      />

      <Container className="relative">
        <section className="rounded-lg bg-white px-20 py-20 max-sm:px-6 max-sm:py-10">
          <div className="flex justify-between mb-8 max-sm:mb-4 gap-10 max-sm:flex-col max-sm:gap-6">
            {contact.subtitle && <Subtitle color="dark">{contact.subtitle}</Subtitle>}
            {contact.title && (
              <p className="font-display text-right text-[32px] leading-none whitespace-pre-line text-black max-sm:text-left max-sm:text-2xl">
                {contact.title}
              </p>
            )}
          </div>

          <a
            href={`mailto:${contact.email}`}
            className="
              group relative inline-flex items-center gap-6
              after:content-[''] after:absolute after:bottom-0 after:left-0
              after:h-0.5 after:w-0 after:bg-black
              after:transition-all after:duration-200
              hover:after:w-full
            "
          >
            <span className="font-display border-b-2 border-black pb-2 text-[clamp(1.75rem,8.6vw,6rem)] leading-none text-black">
              {contact.email}
            </span>
            <Image
              src="/svg/arrow-up-right.svg"
              alt=""
              width={64}
              height={64}
              className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 max-sm:size-6"
            />
          </a>

          <div className="mt-20 flex items-center justify-between gap-10 rounded-lg bg-black p-8 max-sm:mt-10 max-sm:flex-col max-sm:items-stretch max-sm:p-6">
            <Button href={hire.href} blank={hire.blank} className="max-sm:w-full">
              {hire.label}
            </Button>
            {socials.length > 0 && (
              <ul className="flex flex-wrap items-center gap-x-8 gap-y-4 pr-6 max-sm:justify-center max-sm:gap-x-6 max-sm:pr-0 max-sm:pb-2">
                {/* Labels never wrap, so "X (Twitter)" stays on one line */}
                {socials.map((social) => (
                  <li key={social.url}>
                    <Flat href={social.url} blank={/^https?:\/\//.test(social.url)} className="whitespace-nowrap">
                      {social.label}
                    </Flat>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <div className="mt-40 flex items-center justify-between gap-6 px-20 max-sm:mt-16 max-sm:flex-col max-sm:px-0">
          <Link href={home} aria-label="GAB.S">
            <Image src="/svg/logo-footer.svg" alt="GAB.S" width={122} height={32} />
          </Link>

          <div className="text-center text-sm leading-[1.8] font-light text-gray">
            {legalText && <p className="text-sm text-gray">{legalText.replace(/\{(ano|year)\}/g, year)}</p>}
            {legalLinks.length > 0 && (
              <p className="text-sm text-gray">
                {legalLinks.map((link, index) => (
                  <Fragment key={link.href}>
                    {index > 0 && (index === legalLinks.length - 1 ? t.and : ', ')}
                    <Link
                      href={link.href}
                      target={link.blank ? '_blank' : undefined}
                      rel={link.blank ? 'noopener noreferrer' : undefined}
                      className="font-normal text-white underline hover:opacity-70"
                    >
                      {link.label}
                    </Link>
                  </Fragment>
                ))}
              </p>
            )}
            {cookies && (
              <p className="text-sm text-gray">
                <ConsentButton>{t.cookies}</ConsentButton>
              </p>
            )}
          </div>

          <a href="#top" aria-label={t.backToTop} className="transition-opacity hover:opacity-70">
            <Image src="/svg/back-to-top.svg" alt="" width={48} height={48} />
          </a>
        </div>
      </Container>
    </footer>
  )
}
