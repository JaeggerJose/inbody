'use client'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import type { Measurement } from '@/lib/types'

interface TrendChartProps {
  measurements: Measurement[]
}

export function TrendChart({ measurements }: TrendChartProps) {
  const data = [...measurements]
    .reverse()
    .map((m) => ({
      date: format(parseISO(m.measured_at), 'MM/dd', { locale: zhTW }),
      體重: m.weight_kg,
      體脂率: m.body_fat_pct,
      骨骼肌: m.skeletal_muscle_kg,
    }))

  if (!data.length) {
    return (
      <div
        className="glass flex items-center justify-center h-48 text-muted text-sm"
        style={{ borderRadius: 'var(--radius-lg)' }}
      >
        尚無歷史數據
      </div>
    )
  }

  return (
    <div className="glass p-5 flex flex-col gap-4">
      <span className="text-xs text-muted uppercase tracking-widest font-medium">
        趨勢追蹤
      </span>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 55)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '0.5rem',
              color: 'var(--color-text)',
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: 'var(--color-text-muted)', paddingTop: 8 }}
          />
          <Line
            type="monotone"
            dataKey="體重"
            stroke="var(--color-teal)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-teal)', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="體脂率"
            stroke="var(--color-fat)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-fat)', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="骨骼肌"
            stroke="var(--color-muscle)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-muscle)', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
