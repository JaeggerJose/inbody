import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmt(value: number | null | undefined, unit = '', decimals = 1): string {
  if (value == null) return '—'
  return `${value.toFixed(decimals)}${unit}`
}

export function fmtInt(value: number | null | undefined, unit = ''): string {
  if (value == null) return '—'
  return `${Math.round(value)}${unit}`
}

export function bodyFatCategory(pct: number | null): { label: string; color: string } {
  if (pct == null) return { label: '—', color: 'text-muted' }
  if (pct < 10) return { label: '過低', color: 'text-water' }
  if (pct < 20) return { label: '標準低', color: 'text-muscle' }
  if (pct < 25) return { label: '標準', color: 'text-teal' }
  if (pct < 30) return { label: '偏高', color: 'text-fat' }
  return { label: '過高', color: 'text-fat' }
}

export function bmiCategory(bmi: number | null): { label: string; color: string } {
  if (bmi == null) return { label: '—', color: 'text-muted' }
  if (bmi < 18.5) return { label: '過輕', color: 'text-water' }
  if (bmi < 24) return { label: '正常', color: 'text-muscle' }
  if (bmi < 27) return { label: '過重', color: 'text-fat' }
  return { label: '肥胖', color: 'text-fat' }
}

export function generateFileName(ext: string): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
}
