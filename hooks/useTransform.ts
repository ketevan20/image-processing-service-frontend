'use client'
import { getImageById, transformImage } from "@/lib/api/images"
import { Image } from "@/types/image"
import { TransformationSteps, TransformPayload } from "@/types/transform"
import { useCallback, useEffect, useState } from "react"

export const transformationSteps: TransformationSteps[] = [
    { key: 'resize', num: '01', label: 'Resize', color: '#8FB0FF' },
    { key: 'crop', num: '02', label: 'Crop', color: '#B5EBA5' },
    { key: 'rotate', num: '03', label: 'Rotate', color: '#C39BF7' },
    { key: 'flip-mirror', num: '04', label: 'Flip · Mirror', color: '#F7CB80' },
    { key: 'watermark', num: '05', label: 'Watermark', color: '#7DE3D2' },
    { key: 'filters', num: '06', label: 'Filters', color: '#F7A1BE' },
    { key: 'compress', num: '07', label: 'Compress', color: '#8FB0FF' },
    { key: 'format', num: '08', label: 'Format', color: '#B5EBA5' },
]

export function useTransform(imageId: string) {
    // The image this editing session is anchored to. Loaded once, never
    // swapped out — every transformation targets this, always.
    const [image, setImage] = useState<Image | null>(null)

    // The most recent transform result, shown alongside `image`. Re-applying
    // a transform overwrites this — it never becomes the new base.
    const [transformed, setTransformed] = useState<Image | null>(null)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeStep, setActiveStep] = useState<TransformationSteps>(transformationSteps[0])

    const [pending, setPending] = useState<TransformPayload>({})
    const [applying, setApplying] = useState(false)
    const [applyError, setApplyError] = useState<string | null>(null)

    const fetchImageById = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await getImageById(imageId)
            setImage(res)
            setTransformed(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }, [imageId])

    useEffect(() => {
        fetchImageById()
    }, [fetchImageById])

    const updatePending = useCallback(<K extends keyof TransformPayload>(
        key: K,
        value: TransformPayload[K]
    ) => {
        setPending(prev => {
            if (value === undefined) {
                const { [key]: _omit, ...rest } = prev
                return rest
            }
            return { ...prev, [key]: value }
        })
    }, [])

    const clearPending = useCallback(() => setPending({}), [])

    const hasPendingChanges = Object.values(pending).some(v => v !== undefined)

    const applyTransform = useCallback(async () => {
        if (!image || !hasPendingChanges) return

        try {
            setApplying(true)
            setApplyError(null)
            // Always transform the fixed base image, never `transformed` —
            // this is what makes re-transforming always start from the
            // original instead of stacking onto a previous edit.
            const result = await transformImage(image._id, pending)
            setTransformed(result)
            clearPending()
        } catch (err) {
            setApplyError(err instanceof Error ? err.message : String(err))
        } finally {
            setApplying(false)
        }
    }, [image, pending, hasPendingChanges, clearPending])

    return {
        image,
        transformed,
        error,
        loading,

        transformationSteps,
        activeStep,
        setActiveStep,

        pending,
        updatePending,
        hasPendingChanges,
        applying,
        applyError,
        applyTransform,
    }
}