import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('rounded-xl border border-slate-800 bg-card p-4', className)}>{children}</div>
}
