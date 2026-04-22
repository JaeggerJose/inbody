'use client'
import { useState } from 'react'
import type { AnalysisResult } from '@/lib/types'

interface Field {
  key: keyof AnalysisResult
  label: string
  unit: string
  color?: string
}

const FIELDS: Field[] = [
  { key: 'weight_kg',          label: '體重',       unit: 'kg' },
  { key: 'height_cm',          label: '身高',       unit: 'cm' },
  { key: 'age',                label: '年齡',       unit: '歲' },
  { key: 'body_fat_pct',       label: '體脂肪率',   unit: '%',  color: 'var(--color-fat)' },
  { key: 'skeletal_muscle_kg', label: '骨骼肌重',   unit: 'kg', color: 'var(--color-muscle)' },
  { key: 'bmi',                label: 'BMI',        unit: '' },
  { key: 'bmr_kcal',           label: '基礎代謝',   unit: 'kcal' },
  { key: 'waist_cm',           label: '腰圍',       unit: 'cm' },
  { key: 'body_water_kg',      label: '體水分',     unit: 'kg', color: 'var(--color-water)' },
  { key: 'protein_kg',         label: '蛋白質',     unit: 'kg' },
  { key: 'mineral_kg',         label: '礦物質',     unit: 'kg' },
  { key: 'body_fat_kg',        label: '體脂肪',     unit: 'kg', color: 'var(--color-fat)' },
  { key: 'lean_mass_kg',       label: '去脂體重',   unit: 'kg', color: 'var(--color-primary)' },
]

interface Props {
  result: AnalysisResult
  imageUrls: string[]
  onSave: (data: AnalysisResult, date: string) => Promise<void>
}

export function AnalysisResultPanel({ result, imageUrls, onSave }: Props) {
  const [edited, setEdited] = useState<AnalysisResult>({ ...result })
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16))
  const [saving, setSaving] = useState(false)

  const update = (key: keyof AnalysisResult, raw: string) => {
    const num = parseFloat(raw)
    setEdited((prev) => ({
      ...prev,
      [key]: isNaN(num) ? null : num,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(edited, date)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="glass p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted uppercase tracking-widest font-medium">
            LLM 分析結果 — 請確認數值
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">量測日期</span>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-xs px-2 py-1 rounded font-mono"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {FIELDS.map(({ key, label, unit, color }) => {
            const val = edited[key as keyof AnalysisResult]
            return (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-muted">{label}</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={val != null ? String(val) : ''}
                    onChange={(e) => update(key as keyof AnalysisResult, e.target.value)}
                    placeholder="—"
                    className="w-full px-2 py-1.5 rounded text-sm font-mono"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: color ?? 'var(--color-text)',
                    }}
                  />
                  {unit && <span className="text-xs text-dim shrink-0">{unit}</span>}
                </div>
              </div>
            )
          })}
        </div>

        {result.notes && (
          <p className="text-xs text-muted border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
            備註：{result.notes}
          </p>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
        style={{
          background: saving ? 'var(--color-primary-dim)' : 'var(--color-primary)',
          color: 'oklch(1 0 0)',
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? '儲存中…' : '✓ 確認並儲存'}
      </button>

      <p className="text-xs text-dim text-center">
        已上傳 {imageUrls.length} 張照片到 Supabase Storage
      </p>
    </div>
  )
}
