/**
 * Fills the CMS with the site content (Portuguese and English) from the command line:
 *   pnpm seed
 * Same as the "Popule o banco" button in the admin. Clears pages, projects and media first.
 *
 * Refuses to run against a remote (shared/production) database unless SEED_FORCE is set:
 *   SEED_FORCE=true pnpm seed
 * (`payload run` drops `--flags` before the script sees them, so this is an env var.)
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { seed } from '@/endpoints/seed'
import { isLocalDatabase } from '@/utilities/isLocalDatabase'

if (!isLocalDatabase(process.env.DATABASE_URL) && process.env.SEED_FORCE !== 'true') {
  console.error(
    'DATABASE_URL points to a remote database. Seeding deletes all pages, projects and media there.\n' +
      'Run `SEED_FORCE=true pnpm seed` if that is really what you want.',
  )
  process.exit(1)
}

const payload = await getPayload({ config })
const req = await createLocalReq({}, payload)

await seed({ payload, req })

process.exit(0)
