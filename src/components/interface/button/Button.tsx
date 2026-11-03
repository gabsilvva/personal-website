import Link from 'next/link'

import { cn } from '@/utilities/ui'

type Props = {
  href?: string | null
  blank?: boolean
  submit?: boolean
  onClick?: () => void
  full?: boolean
  color?: 'light' | 'dark'
  className?: string
  children: React.ReactNode
}

const colors = {
  light: 'bg-white text-black hover:bg-light-gray',
  dark: 'bg-black text-white hover:bg-light-black',
}

export default function Button({
  href,
  blank,
  submit,
  onClick,
  full,
  color = 'light',
  className,
  children,
}: Props) {
  const classes = cn(
    'font-display inline-flex h-18 items-center justify-center rounded-lg px-12 text-xl leading-none whitespace-nowrap transition-colors max-sm:h-16 max-sm:px-8 max-sm:text-lg',
    colors[color],
    full && 'w-full',
    className,
  )

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        target={blank ? '_blank' : undefined}
        rel={blank ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    )
  }

  return (
    <button type={submit ? 'submit' : 'button'} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
