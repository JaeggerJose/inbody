'use client'
import { useEffect, useState } from 'react'
import type { Measurement } from '@/lib/types'

interface BodyCompositionBarProps {
  m: Measurement
}

export function BodyCompositionBar({ m }: BodyCompositionBarProps) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(t)
  }, [])

  const total = m.weight_kg ?? 0
  if (!total) return null

  const segments = [
    { key: 'water',    value: m.body_water_kg,  color: 'var(--color-water)',  label: '體水分' },
    { key: 'protein',  value: m.protein_kg,     color: 'var(--color-muscle)', label: '蛋白質' },
    { key: 'mineral',  value: m.mineral_kg,     color: 'var(--color-bone)',   label: '礦物質' },
    { key: 'fat',      value: m.body_fat_kg,    color: 'var(--color-fat)',    label: '體脂肪' },
  ]

  return (
    <div className="glass p-5 flex flex-col gap-4">
      <span className="text-xs text-muted uppercase tracking-widest font-medium">
        身體組成分析
      </span>

      {/* Stacked bar */}
      <div className="flex h-6 rounded-full overflow-hidden gap-px">
        {segments.map(({ key, value, color }) => {
          const pct = value != null ? (value / total) * 100 : 0
          return (
            <div
              key={key}
              style={{
                width: animated ? `${pct}%` : '0%',
                background: color,
                transition: 'width 1s cubic-bezier(0.34, 1.1, 0.64, 1)',
                transitionDelay: '0.1s',
              }}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {segments.map(({ key, value, color, label }) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="shrink-0 w-2.5 h-2.5 rounded-full"
              style={{ background: color }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted truncate">{label}</span>
              <span
                className="text-sm font-semibold font-mono"
                style={{ color, fontFamily: 'var(--font-mono)' }}
              >
                {value != null ? `${value.toFixed(1)} kg` : '—'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
