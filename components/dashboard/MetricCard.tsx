import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  accent?: string
  icon?: ReactNode
  className?: string
}

export function MetricCard({
  label,
  value,
  sub,
  accent,
  icon,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn('glass glass-hover p-5 flex flex-col gap-3', className)}
      style={{ minWidth: 0 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted uppercase tracking-widest font-medium">
          {label}
        </span>
        {icon && (
          <span style={{ color: accent ?? 'var(--color-teal)', opacity: 0.7 }}>
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span
          className="font-mono font-semibold leading-none"
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            color: accent ?? 'var(--color-teal)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {value}
        </span>
      </div>

      {sub && (
        <span className="text-xs text-muted">{sub}</span>
      )}
    </div>
  )
}
