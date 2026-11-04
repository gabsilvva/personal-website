import type { GlobalAfterChangeHook } from 'payload'

import { revalidateSite } from '@/hooks/revalidateDiscovery'

// Globals feed the layout and several templates, so every page of every locale is revalidated.
export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, global, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating site after "${global.slug}" changed`)
    revalidateSite()
  }

  return doc
}
