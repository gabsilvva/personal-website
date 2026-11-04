import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateSite } from '@/hooks/revalidateDiscovery'
import type { Page } from '../../../payload-types'

// Text pages render at /[locale]/[slug]; the pattern covers every locale and slug
const revalidateTextPages = () => {
  // Every page: the search, built in the layout, lists the text pages
  revalidateSite()
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && (doc._status === 'published' || previousDoc?._status === 'published')) {
    payload.logger.info(`Revalidating page: ${doc.slug}`)
    revalidateTextPages()
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) revalidateTextPages()

  return doc
}
