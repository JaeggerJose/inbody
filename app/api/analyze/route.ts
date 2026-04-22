import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { analyzeInBodyImages, type ImageBase64 } from '@/lib/claude'
import { generateFileName } from '@/lib/utils'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function detectHeic(file: File): boolean {
  if (file.type === 'image/heic' || file.type === 'image/heif') return true
  return /\.(heic|heif)$/i.test(file.name)
}

async function toJpegBuffer(buffer: Buffer, file: File): Promise<Buffer> {
  if (!detectHeic(file)) return buffer
  const sharp = (await import('sharp')).default
  return sharp(buffer).jpeg({ quality: 88 }).toBuffer()
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('images') as File[]
    if (!files.length) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    const uploadedUrls: string[] = []
    const base64Images: ImageBase64[] = []

    for (const file of files) {
      const rawBuffer = Buffer.from(await file.arrayBuffer())
      const jpegBuffer = await toJpegBuffer(rawBuffer, file)
      const fileName = generateFileName('jpg')

      const { error } = await supabase.storage
        .from('inbody-images')
        .upload(fileName, jpegBuffer, { contentType: 'image/jpeg', upsert: true })

      if (error) {
        console.error('Storage upload error:', error.message)
        throw new Error(`Upload failed: ${error.message}`)
      }

      const { data } = supabase.storage.from('inbody-images').getPublicUrl(fileName)
      uploadedUrls.push(data.publicUrl)
      base64Images.push({ data: jpegBuffer.toString('base64'), mediaType: 'image/jpeg' })
    }

    const analysis = await analyzeInBodyImages(base64Images)
    return NextResponse.json({ analysis, imageUrls: uploadedUrls })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Analyze error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
