import Image from 'next/image'
import Link from 'next/link'

import Container from '@/components/layout/container/Container'
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
  open: boolean
  onToggle: () => void
  allOpen: boolean
  onToggleAll: () => void
  labels: Dictionary['uses']
}

const COLUMNS = 3

function Cell({ item }: { item: Item }) {
  const content = (
    <>
      {item.url && (
        <Image
          src="/svg/arrow-up-right-small.svg"
          alt=""
          width={24}
          height={24}
          className="absolute top-10 right-10 size-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 max-sm:top-1/2 max-sm:right-5 max-sm:size-4 max-sm:-translate-y-1/2"
        />
      )}
      <span className="font-display block text-2xl leading-none text-white max-sm:text-lg max-sm:leading-[1.4]">
        {item.name}
      </span>
      {item.description && (
        <span className="mt-2 block text-base leading-[1.8] font-light text-gray max-sm:mt-1 max-sm:text-[13px] max-sm:leading-[1.6]">
          {item.description}
        </span>
      )}
    </>
  )

  // Desktop: the text starts below the arrow's row, so it lines up across the row.
  // Mobile: compact rows with the arrow on the right
  const classes =
    'group relative flex h-full flex-col px-10 pt-22 pb-10 max-sm:justify-center max-sm:py-4 max-sm:pr-12 max-sm:pl-5'

  return item.url ? (
    <Link href={item.url} target="_blank" rel="noopener noreferrer" className={cn(classes, 'transition-colors hover:bg-dark-gray')}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  )
}

export default function Category({ title, icon, items, open, onToggle, allOpen, onToggleAll, labels }: Props) {
  const rows = Array.from({ length: Math.ceil((items?.length ?? 0) / COLUMNS) }, (_, row) =>
    (items ?? []).slice(row * COLUMNS, (row + 1) * COLUMNS),
  )

  return (
    // Every horizontal line crosses the whole screen, as in the design; the vertical ones follow the container
    <div className="border-b border-light-black">
      <Container className="max-sm:px-0">
        <div className="flex items-center justify-between gap-6 border-x border-light-black bg-dark-gray px-10 py-10 max-sm:border-x-0 max-sm:px-5 max-sm:py-6">
          <div className="flex items-center gap-10 max-sm:gap-4">
            <span className="relative flex size-16 shrink-0 items-center justify-center max-sm:size-11">
              <Image src="/svg/services/circle.svg" alt="" width={64} height={64} className="absolute inset-0 size-full" />
              {icon && (
                <Image src={`/svg/uses/${icon}.svg`} alt="" width={24} height={24} className="relative max-sm:size-5" />
              )}
            </span>
            <h3>{title}</h3>
          </div>

          <div className="flex shrink-0 items-center gap-10">
            <button
              type="button"
              onClick={onToggleAll}
              className="flex items-center gap-3 text-base leading-none text-gray transition-colors hover:text-white max-sm:hidden"
            >
              <Image src="/svg/expand.svg" alt="" width={20} height={20} />
              {allOpen ? labels.collapseAll : labels.expandAll}
            </button>
            <button
              type="button"
              aria-expanded={open}
              aria-label={`${open ? labels.collapse : labels.expand} ${title}`}
              onClick={onToggle}
              className={cn('shrink-0 transition-transform', !open && 'rotate-45')}
            >
              <Image src="/svg/close.svg" alt="" width={64} height={64} className="size-16 max-sm:size-11" />
            </button>
          </div>
        </div>
      </Container>

      <div
        inert={!open}
        className={cn('grid transition-[grid-template-rows] duration-500', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
      >
        <div className="overflow-hidden">
          {/* Desktop: one full-width band per row of three, so its bottom line crosses the screen.
              Smaller screens dissolve the bands and the cells flow in two columns, then one;
              the last cells' bottom line is clipped to leave the category's own. */}
          <div
            role="list"
            className="border-t border-light-black max-sm:-mb-px max-sm:grid max-sm:grid-cols-2 max-md:grid-cols-1"
          >
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="border-b border-light-black last:border-b-0 max-sm:contents">
                <Container className="max-sm:contents">
                  <div className="grid grid-cols-3 border-x border-light-black max-sm:contents">
                    {row.map((item, column) => (
                      <div
                        key={item.id ?? item.name}
                        role="listitem"
                        className={cn(
                          // The third cell's right line is the container's
                          'border-r border-light-black sm:nth-3:border-r-0 max-sm:border-b max-md:border-r-0',
                          (rowIndex * COLUMNS + column) % 2 === 1 && 'max-sm:border-r-0',
                        )}
                      >
                        <Cell item={item} />
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
