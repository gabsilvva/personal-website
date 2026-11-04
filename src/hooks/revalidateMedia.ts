import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateSite as revalidateAll } from '@/hooks/revalidateDiscovery'

// Image URLs carry the media's updatedAt, so pages must re-render to pick up a replaced file or
// a new alt text. Any page may show any image, so the whole site is revalidated.
const revalidateSite = (payload: { logger: { info: (msg: string) => void } }) => {
  payload.logger.info('Revalidating site after a media change')
  revalidateAll()
}

export const revalidateMedia: CollectionAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) revalidateSite(payload)
  return doc
}

export const revalidateMediaDelete: CollectionAfterDeleteHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) revalidateSite(payload)
  return doc
}
