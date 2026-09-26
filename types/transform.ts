export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
export type ImageFormat = 'jpeg' | 'png' | 'webp'
export type CompressLevel = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100

export interface ResizeOptions {
  width: number
  height: number
}

export interface CropOptions {
  width: number
  height: number
  x: number
  y: number
}

export interface FilterOptions {
  grayscale?: boolean
  sepia?: boolean
}

export interface WatermarkOptions {
  text: string
  position?: WatermarkPosition
  fontSize?: number
}

export interface TransformPayload {
  resize?: ResizeOptions
  crop?: Partial<CropOptions>
  rotate?: number
  format?: ImageFormat
  filters?: FilterOptions
  flip?: boolean
  mirror?: boolean
  compress?: CompressLevel
  watermark?: WatermarkOptions
}

export type TransformStep = 'resize' | 'crop' | 'rotate' | 'flip-mirror' | 'watermark' | 'filters' | 'compress' | 'format'

export type TransformationSteps = { key: TransformStep; num: string; label: string; color: string };