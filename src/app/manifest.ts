import type { MetadataRoute } from 'next'

import { SITE_NAME } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'GAB.S',
    description: 'Design Engineer & Full Stack Developer',
    start_url: '/',
    display: 'browser',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [{ src: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' }],
  }
}
