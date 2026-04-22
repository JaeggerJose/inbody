import { getLatestMeasurement, getMeasurements } from '@/lib/supabase'
import { RadialGauge } from '@/components/dashboard/RadialGauge'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { BodyCompositionBar } from '@/components/dashboard/BodyCompositionBar'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { fmt, fmtInt, bodyFatCategory, bmiCategory } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Link from 'next/link'
import { Activity, Scale, Flame, Ruler } from 'lucide-react'

export const revalidate = 0

export default async function DashboardPage() {
  const [latest, all] = await Promise.all([getLatestMeasurement(), getMeasurements()])

  if (!latest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-6 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-primary-dim)', border: '1px solid var(--color-border-bright)' }}
        >
          <Activity size={32} className="text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h1
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontFamily: 'var(--font-display)' }}
          >
            還沒有任何量測紀錄
          </h1>
          <p className="text-muted text-sm">上傳你的 InBody 照片開始紀錄</p>
        </div>
        <Link
          href="/upload"
          className="px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 glow-teal"
          style={{ background: 'var(--color-primary)', color: 'oklch(1 0 0)' }}
        >
          上傳第一筆
        </Link>
      </div>
    )
  }

  const fatCat = bodyFatCategory(latest.body_fat_pct)
  const bmiCat = bmiCategory(latest.bmi)
  const measuredDate = format(parseISO(latest.measured_at), 'yyyy 年 M 月 d 日', { locale: zhTW })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}
          >
            身體組成<br />
            <span className="text-primary">儀表板</span>
          </h1>
          <p className="text-muted text-sm mt-2">最後量測：{measuredDate}</p>
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

      {/* Radial gauges — key metrics */}
      <div className="glass p-6 flex flex-wrap justify-around gap-6">
        <RadialGauge
          value={latest.body_fat_pct}
          max={50}
          label="體脂肪率"
          unit="%"
          color="var(--color-fat)"
          size={130}
        />
        <RadialGauge
          value={latest.skeletal_muscle_kg}
          max={50}
          label="骨骼肌重"
          unit="kg"
          color="var(--color-muscle)"
          size={130}
        />
        <RadialGauge
          value={latest.weight_kg}
          max={120}
          label="體重"
          unit="kg"
          color="var(--color-primary)"
          size={130}
        />
        <RadialGauge
          value={latest.bmi}
          max={40}
          label="BMI"
          unit=""
          color="var(--color-water)"
          size={130}
        />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="體脂肪"
          value={fmt(latest.body_fat_kg, ' kg')}
          sub={fatCat.label}
          accent="var(--color-fat)"
          icon={<Flame size={16} />}
        />
        <MetricCard
          label="去脂體重"
          value={fmt(latest.lean_mass_kg, ' kg')}
          sub="Fat-Free Mass"
          accent="var(--color-muscle)"
          icon={<Activity size={16} />}
        />
        <MetricCard
          label="基礎代謝"
          value={fmtInt(latest.bmr_kcal, ' kcal')}
          sub="BMR"
          accent="var(--color-primary)"
          icon={<Flame size={16} />}
        />
        <MetricCard
          label="腰圍"
          value={fmt(latest.waist_cm, ' cm')}
          sub={bmiCat.label}
          accent="var(--color-bone)"
          icon={<Ruler size={16} />}
        />
        <MetricCard
          label="體重"
          value={fmt(latest.weight_kg, ' kg')}
          sub={`身高 ${fmt(latest.height_cm, ' cm')}`}
          accent="var(--color-primary)"
          icon={<Scale size={16} />}
        />
        <MetricCard
          label="體水分"
          value={fmt(latest.body_water_kg, ' kg')}
          sub="Body Water"
          accent="var(--color-water)"
        />
        <MetricCard
          label="蛋白質"
          value={fmt(latest.protein_kg, ' kg')}
          accent="var(--color-muscle)"
        />
        <MetricCard
          label="礦物質"
          value={fmt(latest.mineral_kg, ' kg')}
          accent="var(--color-bone)"
        />
      </div>

      {/* Body composition bar */}
      <BodyCompositionBar m={latest} />

      {/* Trend chart */}
      <TrendChart measurements={all} />

      {/* Segment analysis */}
      {(latest.seg_right_arm_muscle || latest.seg_trunk_muscle) && (
        <div className="glass p-5 flex flex-col gap-4">
          <span className="text-xs text-muted uppercase tracking-widest font-medium">部位分析</span>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { label: '右臂', m: latest.seg_right_arm_muscle, f: latest.seg_right_arm_fat },
              { label: '左臂', m: latest.seg_left_arm_muscle,  f: latest.seg_left_arm_fat },
              { label: '軀幹', m: latest.seg_trunk_muscle,     f: latest.seg_trunk_fat },
              { label: '右腿', m: latest.seg_right_leg_muscle, f: latest.seg_right_leg_fat },
              { label: '左腿', m: latest.seg_left_leg_muscle,  f: latest.seg_left_leg_fat },
            ].map(({ label, m: ms, f }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <span className="text-xs text-muted">{label}</span>
                <span className="text-xs font-mono text-muscle" style={{ fontFamily: 'var(--font-mono)' }}>
                  {ms != null ? `${ms.toFixed(1)}` : '—'}
                </span>
                <span className="text-xs text-dim">肌</span>
                <span className="text-xs font-mono text-fat" style={{ fontFamily: 'var(--font-mono)' }}>
                  {f != null ? `${f.toFixed(1)}` : '—'}
                </span>
                <span className="text-xs text-dim">脂</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
