import Link from 'next/link'

import { cn } from '@/utilities/ui'

type Props = {
  href: string
  blank?: boolean
  color?: 'light' | 'dark'
  className?: string
  children: React.ReactNode
}

/** Underlined serif link, e.g. "Ver todos" and the social links in the footer. */
export default function Flat({ href, blank, color = 'light', className, children }: Props) {
  return (
    <Link
      href={href}
      target={blank ? '_blank' : undefined}
      rel={blank ? 'noopener noreferrer' : undefined}
      className={cn(
        'font-display inline-flex items-center gap-3 text-xl leading-[1.4] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70 max-sm:text-lg',
        color === 'light' ? 'text-white' : 'text-black',
        className,
      )}
    >
      {children}
    </Link>
  )
}
