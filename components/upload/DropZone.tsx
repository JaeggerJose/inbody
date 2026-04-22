'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropZoneProps {
  onFiles: (files: File[]) => void
  disabled?: boolean
}

export function DropZone({ onFiles, disabled }: DropZoneProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])

  const onDrop = useCallback(
    (accepted: File[]) => {
      const items = accepted.map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
      }))
      setPreviews((prev) => [...prev, ...items])
      onFiles(accepted)
    },
    [onFiles]
  )

  const remove = (idx: number) => {
    URL.revokeObjectURL(previews[idx].url)
    const next = previews.filter((_, i) => i !== idx)
    setPreviews(next)
    onFiles(next.map((p) => p.file))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
    },
    disabled,
    multiple: true,
  })

  return (
    <div className="flex flex-col gap-4">
      <div
        {...getRootProps()}
        className={cn(
          'glass glass-hover cursor-pointer flex flex-col items-center justify-center gap-4 p-12 transition-all duration-200',
          isDragActive && 'border-accent glow-teal',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{ borderStyle: 'dashed', minHeight: 200 }}
      >
        <input {...getInputProps()} />
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-teal-muted)', border: '1px solid var(--color-border-bright)' }}
        >
          <Upload size={24} className="text-teal" />
        </div>
        <div className="text-center">
          <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
            {isDragActive ? '放開以上傳' : '拖放 InBody 照片到這裡'}
          </p>
          <p className="text-xs text-muted mt-1">支援 HEIC、JPG、PNG</p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {previews.map(({ url, file }, idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden glass"
              style={{ aspectRatio: '3/4' }}
            >
              {file.type === 'image/heic' || file.type === 'image/heif' ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <ImageIcon size={28} className="text-muted" />
                  <span className="text-xs text-muted">HEIC</span>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => remove(idx)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'oklch(0.96 0.01 55 / 0.9)' }}
              >
                <X size={12} className="text-muted" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
