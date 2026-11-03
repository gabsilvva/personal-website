'use client'

import { usePathname } from 'next/navigation'

import Button from '@/components/interface/button/Button'
import Flat from '@/components/interface/button/Flat'
import Container from '@/components/layout/container/Container'
import { getDictionary } from '@/i18n/dictionaries'
import { parsePath, routePath } from '@/i18n/routes'

/** A page failed to render (e.g. the CMS was unreachable): keep the site's layout and offer a retry. */
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { locale } = parsePath(usePathname() ?? '/')
  const t = getDictionary(locale).error

  return (
    <section className="relative py-between max-sm:py-between-mob">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[64px] max-sm:text-[44px]">{t.title}</h1>
          <p className="mt-6 text-gray">{t.text}</p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-10">
            <Button onClick={retry}>{t.retry}</Button>
            <Flat href={routePath(locale, 'home')}>{t.home}</Flat>
          </div>
        </div>
      </Container>
    </section>
  )
}
