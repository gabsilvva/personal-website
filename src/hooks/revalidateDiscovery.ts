import { revalidatePath } from 'next/cache'

/** The machine-readable files built from the CMS: sitemap, llms.txt and the RSS feeds. */
export const revalidateDiscovery = () => {
  for (const path of ['/sitemap.xml', '/llms.txt', '/feed.xml', '/en/feed.xml']) revalidatePath(path)
}
