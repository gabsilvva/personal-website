import Image from 'next/image'
import Link from 'next/link'

import Subtitle from '@/components/interface/subtitle/Subtitle'
import Container from '@/components/layout/container/Container'
import { cn } from '@/utilities/ui'

type Props = {
  subtitle?: string | null
  links: Array<{ label: string; url: string; icon?: string | null; highlight?: boolean | null }>
}

// Raster icons in /public/svg/social, the rest are SVG
const pngIcons = ['devto', 'strava']

export default function Links({ subtitle, links }: Props) {
  if (!links.length) return null

  return (
    <section className="mt-40 max-sm:mt-between-mob">
      <Container>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        <ul className="mt-10 grid grid-cols-4 border-t border-l border-light-black max-sm:grid-cols-2">
          {links.map((link, index) => {
            // Checkerboard like the design, computed for the 4 (desktop) and 2 (mobile) column grids
            const shadedDesktop = (index + Math.floor(index / 4)) % 2 === 1
            const shadedMobile = (index + Math.floor(index / 2)) % 2 === 1

            return (
              <li key={link.url} className="border-r border-b border-light-black">
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex h-30 items-center justify-between gap-4 px-10 transition-colors hover:bg-light-black max-sm:h-18 max-sm:px-4',
                    link.highlight
                      ? 'bg-white hover:bg-light-gray'
                      : cn(shadedDesktop && 'sm:bg-dark-gray', shadedMobile && 'max-sm:bg-dark-gray'),
                  )}
                >
                  <span
                    className={cn(
                      'font-display text-xl leading-[1.4] underline decoration-1 underline-offset-4 max-sm:text-base',
                      link.highlight ? 'text-black' : 'text-white',
                    )}
                  >
                    {link.label}
                  </span>
                  {link.icon && (
                    <Image
                      src={`/svg/social/${link.icon}.${pngIcons.includes(link.icon) ? 'png' : 'svg'}`}
                      alt=""
                      width={24}
                      height={24}
                      className={cn('size-6 object-contain', pngIcons.includes(link.icon) && 'opacity-40 grayscale')}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
