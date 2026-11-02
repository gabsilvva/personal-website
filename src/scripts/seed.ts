/**
 * Fills the CMS with the site content (Portuguese and English) from the command line:
 *   pnpm seed
 * Same as the "Popule o banco" button in the admin. Clears pages, projects and media first.
 *
 * Refuses to run against a remote (shared/production) database unless `--force` is passed:
 *   pnpm seed --force
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { seed } from '@/endpoints/seed'
import { isLocalDatabase } from '@/utilities/isLocalDatabase'

if (!isLocalDatabase(process.env.DATABASE_URL) && !process.argv.includes('--force')) {
  console.error(
    'DATABASE_URL points to a remote database. Seeding deletes all pages, projects and media there.\n' +
      'Run `pnpm seed --force` if that is really what you want.',
  )
  process.exit(1)
}

const payload = await getPayload({ config })
const req = await createLocalReq({}, payload)

await seed({ payload, req })

process.exit(0)
