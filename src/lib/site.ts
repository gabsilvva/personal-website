import { getServerSideURL } from '@/utilities/getURL'

export const SITE_NAME = 'Gabriel da Silva'

export const SITE_URL = getServerSideURL().replace(/\/$/, '')

/**
 * Google Analytics 4 measurement ID, from NEXT_PUBLIC_GA_ID. Only production builds load it,
 * never local runs or Vercel preview deploys, so those visits don't skew the numbers. Without
 * it there is no analytics and no cookie notice.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''

export const analyticsId =
  process.env.NODE_ENV === 'production' &&
  process.env.VERCEL_ENV !== 'preview' &&
  /^G-[A-Z0-9]+$/.test(GA_ID)
    ? GA_ID
    : undefined
