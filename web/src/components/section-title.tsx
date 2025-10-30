import type { ComponentProps } from 'react'
import { cn } from '../lib/utils'

interface SectionTitleProps extends ComponentProps<'h3'> {}

export function SectionTitle({ className, ...props }: SectionTitleProps) {
  return (
    <h3
      className={cn('text-base font-semibold text-zinc-100', className)}
      {...props}
    ></h3>
  )
}
