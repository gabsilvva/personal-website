import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => [
  // Old URLs of renamed pages, so shared links keep working
  { source: '/equipamentos', destination: '/vida', permanent: true },
  { source: '/en/equipamentos', destination: '/en/uses', permanent: true },
]
