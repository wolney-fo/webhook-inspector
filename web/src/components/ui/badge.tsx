import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps extends ComponentProps<'span'> {}

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-lg text-zinc-100 border border-zinc-600 bg-zinc-800 font-mono text-sm font-semibold',
        className,
      )}
      {...props}
    ></span>
  )
}
