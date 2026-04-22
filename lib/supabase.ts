import { createClient } from '@supabase/supabase-js'
import type { Measurement, MeasurementInsert } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getMeasurements(): Promise<Measurement[]> {
  const { data, error } = await supabase
    .from('measurements')
    .select('*')
    .order('measured_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getLatestMeasurement(): Promise<Measurement | null> {
  const { data, error } = await supabase
    .from('measurements')
    .select('*')
    .order('measured_at', { ascending: false })
    .limit(1)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

export async function createMeasurement(m: MeasurementInsert): Promise<Measurement> {
  const { data, error } = await supabase
    .from('measurements')
    .insert(m)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function uploadImage(file: File, fileName: string): Promise<string> {
  const { error } = await supabase.storage
    .from('inbody-images')
    .upload(fileName, file, { upsert: true })
  if (error) throw error

  const { data } = supabase.storage
    .from('inbody-images')
    .getPublicUrl(fileName)
  return data.publicUrl
}
