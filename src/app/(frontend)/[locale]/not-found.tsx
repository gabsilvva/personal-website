'use client'

import { usePathname } from 'next/navigation'

import Button from '@/components/interface/button/Button'
import Container from '@/components/layout/container/Container'
import { getDictionary } from '@/i18n/dictionaries'
import { parsePath, routePath } from '@/i18n/routes'

/**
 * A not-found page gets no params, so the language comes from the URL. Reading it on the client
 * (instead of a request header) keeps every page of the site static.
 */
export default function NotFound() {
  const { locale } = parsePath(usePathname() ?? '/')
  const t = getDictionary(locale).notFound

  return (
    <section className="relative py-between max-sm:py-between-mob">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[96px] max-sm:text-[64px]">404</h1>
          <h2 className="mt-10 text-[40px] max-sm:mt-6 max-sm:text-[28px]">{t.title}</h2>
          <p className="mt-6 text-gray">{t.text}</p>
          <Button href={routePath(locale, 'home')} className="mt-12">
            {t.button}
          </Button>
        </div>
      </Container>
    </section>
  )
}
