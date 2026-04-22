import { getMeasurements } from '@/lib/supabase'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { fmt, fmtInt, bodyFatCategory } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Link from 'next/link'

export const revalidate = 0

export default async function HistoryPage() {
  const measurements = await getMeasurements()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}
          >
            歷史<span className="text-primary">紀錄</span>
          </h1>
          <p className="text-muted text-sm mt-2">共 {measurements.length} 筆量測資料</p>
        </div>
        <Link
          href="/upload"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: 'var(--color-primary-dim)',
            border: '1px solid var(--color-border-bright)',
            color: 'var(--color-primary)',
          }}
        >
          + 新增量測
        </Link>
      </div>

      <TrendChart measurements={measurements} />

      {measurements.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-muted text-sm">還沒有任何量測紀錄</p>
          <Link
            href="/upload"
            className="px-6 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: 'var(--color-primary)', color: 'oklch(0.09 0.02 240)' }}
          >
            上傳第一筆
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {measurements.map((m) => {
            const fatCat = bodyFatCategory(m.body_fat_pct)
            return (
              <div
                key={m.id}
                className="glass glass-hover p-4 grid grid-cols-2 sm:grid-cols-5 gap-4"
              >
                <div className="col-span-2 sm:col-span-1 flex flex-col gap-1">
                  <span className="text-xs text-muted">量測日期</span>
                  <span className="text-sm font-medium">
                    {format(parseISO(m.measured_at), 'yyyy/MM/dd', { locale: zhTW })}
                  </span>
                  <span className="text-xs text-dim">
                    {format(parseISO(m.measured_at), 'HH:mm')}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted">體重</span>
                  <span
                    className="text-lg font-semibold font-mono text-teal"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {fmt(m.weight_kg, '')}
                  </span>
                  <span className="text-xs text-dim">kg</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted">體脂率</span>
                  <span
                    className="text-lg font-semibold font-mono"
                    style={{ fontFamily: 'var(--font-mono)', color: fatCat.color.replace('text-', '') === 'fat' ? 'var(--color-fat)' : 'var(--color-muscle)' }}
                  >
                    {fmt(m.body_fat_pct, '')}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-fat)' }}>
                    % · {fatCat.label}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted">骨骼肌</span>
                  <span
                    className="text-lg font-semibold font-mono text-muscle"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {fmt(m.skeletal_muscle_kg, '')}
                  </span>
                  <span className="text-xs text-dim">kg</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted">BMR / BMI</span>
                  <span
                    className="text-sm font-mono text-water"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {fmtInt(m.bmr_kcal, ' kcal')}
                  </span>
                  <span className="text-xs text-dim">
                    BMI {fmt(m.bmi, '', 1)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
