import { cn } from '@/utilities/ui'

type Props = {
  variant?: 'default' | 'soon' | 'mini'
  className?: string
  children: React.ReactNode
}

const variants = {
  default: 'px-4 py-2 text-sm text-light-gray',
  soon: 'px-4 py-2 text-sm text-white',
  mini: 'px-1.5 py-[3px] text-[10px] font-medium text-dim-gray',
}

/** Rounded pill used for tags, technologies and the "Soon" badge. */
export default function Tag({ variant = 'default', className, children }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border border-gray bg-black leading-none whitespace-nowrap',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
