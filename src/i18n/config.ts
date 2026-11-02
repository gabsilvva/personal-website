export const locales = ['pt', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pt'

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value)

/** Stores the language picked in the menu, so it wins over the browser preference. */
export const LOCALE_COOKIE = 'locale'

/** Value for `<html lang>` and hreflang. */
export const htmlLang: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en',
}

/** Locale used by `Intl` to format dates and times. */
export const intlLocale: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en-US',
}
