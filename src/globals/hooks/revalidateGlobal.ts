import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import { revalidateDiscovery } from '@/hooks/revalidateDiscovery'

// Globals feed the layout and several templates, so every page of every locale is revalidated.
export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, global, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating site after "${global.slug}" changed`)
    revalidatePath('/[locale]', 'layout')
    revalidateDiscovery()
  }

  return doc
}
