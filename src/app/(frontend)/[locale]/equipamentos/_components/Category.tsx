'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import type { Dictionary } from '@/i18n/dictionaries'
import { cn } from '@/utilities/ui'

type Item = {
  id?: string | null
  name: string
  description?: string | null
  url?: string | null
}

type Props = {
  title: string
  icon?: string | null
  items?: Item[] | null
  labels: Dictionary['uses']
}

function Cell({ item }: { item: Item }) {
  const content = (
    <>
      {item.url && (
        <Image
          src="/svg/arrow-up-right-small.svg"
          alt=""
          width={24}
          height={24}
          className="absolute top-6 right-6 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 max-sm:top-1/2 max-sm:right-5 max-sm:-translate-y-1/2"
        />
      )}
      <span className="font-display block text-xl leading-[1.4] text-white max-sm:text-lg">{item.name}</span>
      {item.description && <span className="mt-1 block text-[13px] leading-[1.6] text-gray">{item.description}</span>}
    </>
  )

  // Desktop: tall cells with the name at the bottom. Mobile: compact rows with the arrow on the right
  const classes =
    'group relative flex h-full flex-col justify-end px-10 pt-14 pb-8 max-sm:justify-center max-sm:py-4 max-sm:pr-12 max-sm:pl-5'

  return item.url ? (
    <Link href={item.url} target="_blank" rel="noopener noreferrer" className={cn(classes, 'transition-colors hover:bg-dark-gray')}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  )
}

export default function Category({ title, icon, items, labels }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border-b border-light-black">
      <div className="flex items-center justify-between gap-6 bg-dark-gray px-10 py-10 max-sm:px-5 max-sm:py-6">
        <div className="flex items-center gap-10 max-sm:gap-4">
          <span className="relative flex size-16 shrink-0 items-center justify-center max-sm:size-11">
            <Image src="/svg/services/circle.svg" alt="" width={64} height={64} className="absolute inset-0 size-full" />
            {icon && (
              <Image src={`/svg/uses/${icon}.svg`} alt="" width={24} height={24} className="relative max-sm:size-5" />
            )}
          </span>
          <h3>{title}</h3>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-label={`${open ? labels.collapse : labels.expand} ${title}`}
          onClick={() => setOpen(!open)}
          className={cn('shrink-0 transition-transform', !open && 'rotate-45')}
        >
          <Image src="/svg/close.svg" alt="" width={64} height={64} className="size-16 max-sm:size-11" />
        </button>
      </div>

      <div className={cn('grid transition-[grid-template-rows] duration-500', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">
          {/* Every cell draws right and bottom borders; the extra 1px on the edges is clipped by the wrapper */}
          <ul className="-mr-px -mb-px grid grid-cols-3 border-t border-light-black max-sm:grid-cols-2 max-md:grid-cols-1">
            {items?.map((item) => (
              <li key={item.id ?? item.name} className="border-r border-b border-light-black">
                <Cell item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
