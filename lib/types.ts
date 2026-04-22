export interface Measurement {
  id: string
  measured_at: string
  height_cm: number | null
  weight_kg: number | null
  age: number | null
  gender: 'male' | 'female' | 'other' | null
  body_water_kg: number | null
  protein_kg: number | null
  mineral_kg: number | null
  body_fat_kg: number | null
  lean_mass_kg: number | null
  skeletal_muscle_kg: number | null
  bmi: number | null
  body_fat_pct: number | null
  bmr_kcal: number | null
  waist_cm: number | null
  seg_right_arm_muscle: number | null
  seg_left_arm_muscle: number | null
  seg_trunk_muscle: number | null
  seg_right_leg_muscle: number | null
  seg_left_leg_muscle: number | null
  seg_right_arm_fat: number | null
  seg_left_arm_fat: number | null
  seg_trunk_fat: number | null
  seg_right_leg_fat: number | null
  seg_left_leg_fat: number | null
  image_urls: string[]
  llm_analysis: Record<string, unknown> | null
  notes: string | null
  created_at: string
}

export type MeasurementInsert = Omit<Measurement, 'id' | 'created_at'>

export interface AnalysisResult {
  height_cm: number | null
  weight_kg: number | null
  age: number | null
  gender: 'male' | 'female' | 'other' | null
  body_water_kg: number | null
  protein_kg: number | null
  mineral_kg: number | null
  body_fat_kg: number | null
  lean_mass_kg: number | null
  skeletal_muscle_kg: number | null
  bmi: number | null
  body_fat_pct: number | null
  bmr_kcal: number | null
  waist_cm: number | null
  seg_right_arm_muscle: number | null
  seg_left_arm_muscle: number | null
  seg_trunk_muscle: number | null
  seg_right_leg_muscle: number | null
  seg_left_leg_muscle: number | null
  seg_right_arm_fat: number | null
  seg_left_arm_fat: number | null
  seg_trunk_fat: number | null
  seg_right_leg_fat: number | null
  seg_left_leg_fat: number | null
  notes: string | null
}
