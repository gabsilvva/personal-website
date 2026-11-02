import { getServerSideURL } from '@/utilities/getURL'

export const SITE_NAME = 'Gabriel da Silva'

export const SITE_URL = getServerSideURL().replace(/\/$/, '')
