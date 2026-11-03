import { projectsFeed } from '@/lib/feed'

export const revalidate = 3600

/** Projects feed in Portuguese, at the root like the rest of the Portuguese site. */
export const GET = () => projectsFeed('pt')
