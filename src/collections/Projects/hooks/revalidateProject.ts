import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

import type { Project } from '../../../payload-types'

// Projects show up on the home, the listing and other projects' "explore more", in every locale.
// Route patterns cover all locales and slugs at once.
const revalidateProjects = () => {
  revalidatePath('/[locale]/projetos/[slug]', 'page')
  revalidatePath('/[locale]/projetos', 'page')
  revalidatePath('/[locale]', 'page')
}

export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  // Published now, or unpublished: either way the public pages change
  if (doc._status === 'published' || previousDoc?._status === 'published') {
    payload.logger.info(`Revalidating project: ${doc.slug}`)
    revalidateProjects()
  }

  return doc
}

export const revalidateProjectDelete: CollectionAfterDeleteHook<Project> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) revalidateProjects()

  return doc
}
