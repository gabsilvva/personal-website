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
      <Container>{subtitle && <Subtitle className="flex">{subtitle}</Subtitle>}</Container>

      {/* Desktop, as in the design: the column lines run 120px past the grid above and below,
          and the row lines cross the whole screen */}
      <div className="relative mt-8 py-30 max-sm:mt-6 max-sm:py-0">
        <Container className="pointer-events-none absolute inset-0 max-sm:hidden">
          <div aria-hidden className="grid h-full grid-cols-4">
            {[0, 1, 2, 3].map((column) => (
              <span key={column} className="border-l border-light-black last:border-r" />
            ))}
          </div>
        </Container>

        {/* One 1px line every 121px: the 120px rows plus the 1px gap between them */}
        <div className="bg-[repeating-linear-gradient(to_bottom,var(--color-light-black)_0_1px,transparent_1px_121px)] py-px max-sm:bg-none max-sm:py-0">
          <Container>
            <ul className="grid grid-cols-4 gap-y-px max-sm:grid-cols-2 max-sm:gap-y-0 max-sm:border-t max-sm:border-l max-sm:border-light-black">
              {links.map((link, index) => {
                // Checkerboard like the design, computed for the 4 (desktop) and 2 (mobile) column grids
                const shadedDesktop = (index + Math.floor(index / 4)) % 2 === 1
                const shadedMobile = (index + Math.floor(index / 2)) % 2 === 1

                return (
                  <li key={link.url} className="max-sm:border-r max-sm:border-b max-sm:border-light-black">
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
                          className={cn('size-6 object-contain', pngIcons.includes(link.icon) && 'grayscale')}
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Container>
        </div>
      </div>
    </section>
  )
}
