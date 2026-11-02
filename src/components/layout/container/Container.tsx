import { cn } from '@/utilities/ui'

type Props = {
  children: React.ReactNode
  full?: boolean
  className?: string
}

export default function Container({ children, full, className }: Props) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[calc(var(--container-max)+(var(--spacing-pd)*2))] px-pd max-sm:px-pm',
        full && 'max-w-full px-0 max-sm:px-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
