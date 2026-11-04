import type { ReactNode } from 'react'

import Media from '@/components/interface/media/Media'
import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Props = {
  thumbnail?: number | MediaType | null
  logo?: number | MediaType | null
  /** `sizes` of the thumbnail, for the width the cover takes on the page. */
  sizes: string
  /** Aspect ratio and spacing of the figure. */
  className?: string
  children?: ReactNode
}

/**
 * Project thumbnail dimmed under the client logo. On hover of the parent `group`, the dim and
 * the logo fade out and the thumbnail zooms in. Used by the project card and the service case.
 */
export default function ProjectCover({ thumbnail, logo, sizes, className, children }: Props) {
  return (
    <figure className={cn('relative overflow-hidden rounded-lg bg-dark-gray', className)}>
      <Media
        resource={thumbnail}
        fill
        sizes={sizes}
        className="z-10 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 z-20 bg-black opacity-32 duration-200 group-hover:opacity-0" />
      <Media
        resource={logo}
        // Scales with the cover: 40px tall on the 640px desktop card, never under 24px, and
        // wide logos are contained within 60% of the width
        className="absolute top-1/2 left-1/2 z-30 h-[6.25%] min-h-6 w-auto max-w-[60%] -translate-1/2 object-contain grayscale duration-400 group-hover:invisible group-hover:opacity-0"
      />
      {children}
    </figure>
  )
}
