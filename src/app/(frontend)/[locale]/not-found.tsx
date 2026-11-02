import { headers } from 'next/headers'

import Button from '@/components/interface/button/Button'
import Container from '@/components/layout/container/Container'
import { defaultLocale, isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { routePath } from '@/i18n/routes'
import Image from 'next/image'

export default async function NotFound() {
  const header = (await headers()).get('x-locale') ?? ''
  const locale = isLocale(header) ? header : defaultLocale
  const t = getDictionary(locale).notFound

  return (
    <section className="py-between max-sm:py-between-mob relative">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[96px] max-sm:text-[64px]">404</h1>
          <h4 className="mt-10 max-sm:mt-6">{t.title}</h4>
          <p className="mt-6 text-gray">{t.text}</p>
          <Button href={routePath(locale, 'home')} className="mt-12">
            {t.button}
          </Button>
        </div>
      </Container>
    </section>
  )
}
