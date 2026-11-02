import { LOCALE_COOKIE, type Locale } from './config'

/** Remembers a language picked by the visitor; it then wins over the browser preference (see proxy.ts). */
export const rememberLocale = (locale: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
}
