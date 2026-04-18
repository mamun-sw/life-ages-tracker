import { cn } from '@/lib/utils'
import type { UiconName } from './icon-names'

interface IconProps {
  name: UiconName
  variant?: 'rr' | 'rs'
  className?: string
}

export function Icon({ name, variant = 'rr', className }: IconProps) {
  return <i className={cn('fi', `fi-${variant}-${name}`, 'leading-none', className)} />
}
