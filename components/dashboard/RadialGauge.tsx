'use client'
import { useEffect, useState } from 'react'

interface RadialGaugeProps {
  value: number | null
  max: number
  label: string
  unit: string
  color: string
  size?: number
}

export function RadialGauge({ value, max, label, color, unit, size = 120 }: RadialGaugeProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const pct = value != null ? Math.min(value / max, 1) : 0
  const offset = animated ? circumference * (1 - pct) : circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="oklch(0.9 0.01 55)"
          strokeWidth={8}
        />
        {/* Fill */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
        {/* Center number */}
        <text
          x={size / 2} y={size / 2}
          textAnchor="middle" dominantBaseline="middle"
          style={{
            transform: `rotate(90deg)`,
            transformOrigin: `${size / 2}px ${size / 2}px`,
            fill: 'var(--color-text)',
            fontSize: size * 0.18,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
          }}
        >
          {value != null ? value.toFixed(1) : '—'}
        </text>
        <text
          x={size / 2} y={size / 2 + size * 0.14}
          textAnchor="middle" dominantBaseline="middle"
          style={{
            transform: `rotate(90deg)`,
            transformOrigin: `${size / 2}px ${size / 2}px`,
            fill: 'var(--color-text-muted)',
            fontSize: size * 0.1,
            fontFamily: 'var(--font-sans)',
          }}
        >
          {unit}
        </text>
      </svg>
      <span className="text-xs text-muted text-center" style={{ maxWidth: size }}>
        {label}
      </span>
    </div>
  )
}
