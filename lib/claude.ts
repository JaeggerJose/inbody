import OpenAI from 'openai'
import type { AnalysisResult } from './types'

const MODEL = process.env.OPENROUTER_MODEL ?? 'google/gemini-2.0-flash'

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY ?? 'placeholder',
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://inbody-tracker.vercel.app',
      'X-Title': 'InBody Tracker',
    },
  })
}

export interface ImageBase64 {
  data: string
  mediaType: 'image/jpeg' | 'image/png'
}

const EXTRACT_PROMPT = `You are analyzing photos of an ACCUNIQ InBody body composition analyzer display screen.
The machine shows multiple screens in Chinese. Extract ALL visible measurements and return ONLY a JSON object.

Screen types you may see:
1. Summary: 體重(weight), 骨骼肌重(skeletal muscle), 體脂肪百分比(body fat %)
2. 身體組成分析: 體水分(body water), 蛋白質(protein), 礦物質(mineral), 體脂肪(body fat kg), 去脂體重(lean mass), 基礎代謝率BMR, BMI
3. 部位分析: segment muscle/fat for 右臂/左臂/軀幹/右腿/左腿
4. 腹部肥胖分析: 腰圍(waist)

Also extract from the side panel: 年齡(age), 身高(height), 性別(gender: 男性=male, 女性=female)

Return ONLY this JSON (use null for values you cannot clearly read):
{
  "height_cm": number|null,
  "weight_kg": number|null,
  "age": number|null,
  "gender": "male"|"female"|"other"|null,
  "body_water_kg": number|null,
  "protein_kg": number|null,
  "mineral_kg": number|null,
  "body_fat_kg": number|null,
  "lean_mass_kg": number|null,
  "skeletal_muscle_kg": number|null,
  "bmi": number|null,
  "body_fat_pct": number|null,
  "bmr_kcal": number|null,
  "waist_cm": number|null,
  "seg_right_arm_muscle": number|null,
  "seg_left_arm_muscle": number|null,
  "seg_trunk_muscle": number|null,
  "seg_right_leg_muscle": number|null,
  "seg_left_leg_muscle": number|null,
  "seg_right_arm_fat": number|null,
  "seg_left_arm_fat": number|null,
  "seg_trunk_fat": number|null,
  "seg_right_leg_fat": number|null,
  "seg_left_leg_fat": number|null,
  "notes": string|null
}`

export async function analyzeInBodyImages(images: ImageBase64[]): Promise<AnalysisResult> {
  const imageContents = images.map((img) => ({
    type: 'image_url' as const,
    image_url: { url: `data:${img.mediaType};base64,${img.data}` },
  }))

  const response = await getClient().chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          ...imageContents,
          { type: 'text', text: EXTRACT_PROMPT },
        ],
      },
    ],
  })

  const text = response.choices[0]?.message?.content ?? ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Model did not return valid JSON')

  return JSON.parse(jsonMatch[0]) as AnalysisResult
}
