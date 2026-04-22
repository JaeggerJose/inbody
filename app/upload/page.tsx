'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DropZone } from '@/components/upload/DropZone'
import { AnalysisResultPanel } from '@/components/upload/AnalysisResult'
import type { AnalysisResult } from '@/lib/types'
import { Loader2, Sparkles } from 'lucide-react'

type Step = 'upload' | 'analyzing' | 'review' | 'done'

export default function UploadPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('upload')
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<{
    result: AnalysisResult
    imageUrls: string[]
  } | null>(null)

  const handleFiles = useCallback((f: File[]) => setFiles(f), [])

  const handleAnalyze = async () => {
    if (!files.length) return
    setError(null)
    setStep('analyzing')

    try {
      const formData = new FormData()
      files.forEach((f) => formData.append('images', f))

      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg ?? 'Analysis failed')
      }

      const { analysis, imageUrls } = await res.json()
      setAnalysisData({ result: analysis, imageUrls })
      setStep('review')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStep('upload')
    }
  }

  const handleSave = async (data: AnalysisResult, date: string) => {
    const payload = {
      ...data,
      measured_at: new Date(date).toISOString(),
      image_urls: analysisData?.imageUrls ?? [],
      llm_analysis: analysisData?.result ?? null,
    }

    const res = await fetch('/api/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const { error: msg } = await res.json()
      throw new Error(msg ?? 'Save failed')
    }

    setStep('done')
    setTimeout(() => router.push('/'), 1200)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      <div>
        <h1
          className="font-display font-bold"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}
        >
          上傳<span className="text-primary"> InBody</span><br />照片分析
        </h1>
        <p className="text-muted text-sm mt-2">拍下 ACCUNIQ 機器的各個畫面，AI 會自動識別數值</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-3">
        {(['upload', 'analyzing', 'review'] as const).map((s, i) => {
          const labels = ['上傳照片', 'AI 分析', '確認儲存']
          const done = ['upload', 'analyzing', 'review', 'done'].indexOf(step) > i
          const active = step === s
          return (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className="h-px flex-1 min-w-8"
                  style={{ background: done ? 'var(--color-primary)' : 'var(--color-border)' }}
                />
              )}
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono"
                  style={{
                    background: active || done ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: active || done ? 'oklch(1 0 0)' : 'var(--color-text-muted)',
                    border: `1px solid ${active || done ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  }}
                >
                  {done ? '✓' : i + 1}
                </div>
                <span
                  className="text-xs hidden sm:inline"
                  style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                >
                  {labels[i]}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {error && (
        <div
          className="px-4 py-3 rounded-lg text-sm"
          style={{ background: 'oklch(0.4 0.15 25 / 0.15)', border: '1px solid oklch(0.6 0.2 25 / 0.3)', color: 'oklch(0.75 0.15 25)' }}
        >
          ⚠ {error}
        </div>
      )}

      {step === 'upload' && (
        <div className="flex flex-col gap-6">
          <DropZone onFiles={handleFiles} />
          <button
            onClick={handleAnalyze}
            disabled={!files.length}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: files.length ? 'var(--color-primary)' : 'var(--color-surface)',
              color: files.length ? 'oklch(1 0 0)' : 'var(--color-text-muted)',
              cursor: files.length ? 'pointer' : 'not-allowed',
            }}
          >
            <Sparkles size={16} />
            開始 AI 分析（{files.length} 張）
          </button>
        </div>
      )}

      {step === 'analyzing' && (
        <div className="glass flex flex-col items-center justify-center gap-6 py-20">
          <Loader2 size={40} className="text-primary animate-spin" />
          <div className="text-center">
            <p className="font-medium text-sm">Claude 正在識別 InBody 數據…</p>
            <p className="text-xs text-muted mt-1">上傳照片 → 分析各頁面數值 → 結構化資料</p>
          </div>
        </div>
      )}

      {step === 'review' && analysisData && (
        <AnalysisResultPanel
          result={analysisData.result}
          imageUrls={analysisData.imageUrls}
          onSave={handleSave}
        />
      )}

      {step === 'done' && (
        <div className="glass flex flex-col items-center justify-center gap-4 py-20">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ background: 'var(--color-primary-dim)', border: '1px solid var(--color-border-bright)' }}
          >
            ✓
          </div>
          <p className="font-medium text-sm text-teal">儲存成功，跳轉到儀表板…</p>
        </div>
      )}
    </div>
  )
}
