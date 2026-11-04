import { revalidatePath } from 'next/cache'

// Next tags each cached page with its file path, route groups included
// (e.g. `/(frontend)/[locale]/(home)/page`), so route patterns must spell the groups out:
// `/[locale]` alone matches nothing and the pages would stay stale.
const SITE_ROOT = '/(frontend)/[locale]'

/** Sitemap, llms.txt and feeds, which list the site's content (literal paths). */
export const revalidateDiscovery = () => {
  for (const path of ['/sitemap.xml', '/llms.txt', '/feed.xml', '/en/feed.xml']) revalidatePath(path)
}

/** One fixed page in every locale, given its folder in `app/(frontend)/[locale]` (`/` is the home). */
export const revalidateRoute = (folder: string) => {
  revalidatePath(`${SITE_ROOT}${folder === '/' ? '/(home)' : folder}`, 'page')
  revalidateDiscovery()
}

/** Every page of every locale: the layout (menu, footer, search) and anything that shares data. */
export const revalidateSite = () => {
  revalidatePath(SITE_ROOT, 'layout')
  revalidateDiscovery()
}
