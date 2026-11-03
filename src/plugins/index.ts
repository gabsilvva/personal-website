import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Page, Project } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { SITE_NAME } from '@/lib/site'

const generateTitle: GenerateTitle<Page | Project> = ({ doc }) => {
  return doc?.title ? `${doc.title} — ${SITE_NAME}` : SITE_NAME
}

const generateURL: GenerateURL<Page | Project> = ({ doc, collectionSlug }) => {
  const url = getServerSideURL()

  if (!doc?.slug) return url
  if (collectionSlug === 'projects') return `${url}/projetos/${doc.slug}`

  return `${url}/${doc.slug}`
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'projects'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  // Media goes to Vercel Blob whenever a token is present (production and local runs that
  // share the production database); without it, uploads fall back to public/media.
  vercelBlobStorage({
    enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    // Keep the plugin's fields (e.g. media.prefix) in the schema even without a token,
    // so migrations generated locally match the production schema.
    alwaysInsertFields: true,
    collections: { media: true },
    token: process.env.BLOB_READ_WRITE_TOKEN,
    // Upload straight from the browser to bypass Vercel's 4.5MB request body limit
    clientUploads: true,
  }),
]
