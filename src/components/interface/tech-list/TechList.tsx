import { Fragment } from 'react'

import { cn } from '@/utilities/ui'

type Props = {
  items?: string[] | null
  className?: string
}

/** "/ Next.js / PostgreSQL / Figma" — a list separated by dim slashes. */
export default function TechList({ items, className }: Props) {
  if (!items?.length) return null

  return (
    <p className={cn('text-base leading-[1.8] font-medium text-light-gray max-sm:text-sm', className)}>
      {items.map((item) => (
        <Fragment key={item}>
          <span className="font-light text-light-black">/ </span>
          {item}{' '}
        </Fragment>
      ))}
    </p>
  )
}

/** "Strapi / PayloadCMS / WordPress" — splits a single string on its slashes. */
export function SlashedText({ text }: { text: string }) {
  const parts = text.split(/\s*\/\s*/)

  return parts.map((part, index) => (
    <Fragment key={index}>
      {index > 0 && <span className="font-light text-light-black"> / </span>}
      {part}
    </Fragment>
  ))
}
