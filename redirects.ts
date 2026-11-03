import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Old URLs of renamed pages, so shared links keep working
  const renamed = [
    { source: '/equipamentos', destination: '/vida', permanent: true },
    { source: '/en/equipamentos', destination: '/en/uses', permanent: true },
  ]

  return [internetExplorerRedirect, ...renamed]
}
