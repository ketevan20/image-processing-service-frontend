import { TransformPayload, TransformStep } from '@/types/transform'

export function isStepSet(key: TransformStep, pending: TransformPayload): boolean {
  switch (key) {
    case 'resize': return !!pending.resize
    case 'crop': return !!pending.crop
    case 'rotate': return pending.rotate !== undefined
    case 'flip-mirror': return !!pending.flip || !!pending.mirror
    case 'watermark': return !!pending.watermark
    case 'filters': return !!pending.filters?.grayscale || !!pending.filters?.sepia
    case 'compress': return pending.compress !== undefined
    case 'format': return pending.format !== undefined
  }
}