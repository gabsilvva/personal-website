/**
 * Fills the CMS with the site content (Portuguese and English) from the command line:
 *   pnpm seed
 * Same as the "Popule o banco" button in the admin. Clears pages, projects and media first.
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { seed } from '@/endpoints/seed'

const payload = await getPayload({ config })
const req = await createLocalReq({}, payload)

await seed({ payload, req })

process.exit(0)
