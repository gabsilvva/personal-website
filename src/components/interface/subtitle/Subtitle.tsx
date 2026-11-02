import { cn } from '@/utilities/ui'

type Props = {
  color?: 'light' | 'dark'
  className?: string
  children: React.ReactNode
}

/** Small uppercase label with a square bullet, e.g. "• PROJETOS". */
export default function Subtitle({ color = 'light', className, children }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-4 text-base leading-none text-gray uppercase max-sm:text-sm',
        className,
      )}
    >
      <span className={cn('size-1 shrink-0', color === 'light' ? 'bg-white' : 'bg-black')} />
      {children}
    </span>
  )
}
