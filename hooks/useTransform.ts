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
    const [chain, setChain] = useState<Image[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeStep, setActiveStep] = useState<TransformationSteps>(transformationSteps[0])

    // Transform values queued across all steps, sent together on Apply.
    const [pending, setPending] = useState<TransformPayload>({})
    const [applying, setApplying] = useState(false)
    const [applyError, setApplyError] = useState<string | null>(null)

    const image = chain[currentIndex] ?? null

    const fetchImageById = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await getImageById(imageId)
            setChain([res])
            setCurrentIndex(0)
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }, [imageId])

    useEffect(() => {
        fetchImageById()
    }, [fetchImageById])

    const goBefore = useCallback(async () => {
        const current = chain[currentIndex]
        if (!current?.parentImage) return

        if (currentIndex > 0) {
            setCurrentIndex(i => i - 1)
            return
        }

        try {
            setLoading(true)
            setError(null)
            const parent = await getImageById(current.parentImage)
            setChain(prev => [parent, ...prev])
            setCurrentIndex(0)
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }, [chain, currentIndex])

    const goAfter = useCallback(() => {
        setCurrentIndex(i => (i < chain.length - 1 ? i + 1 : i))
    }, [chain.length])

    const pushTransformedImage = useCallback((newImage: Image) => {
        setChain(prev => [...prev.slice(0, currentIndex + 1), newImage])
        setCurrentIndex(i => i + 1)
    }, [currentIndex])

    // Merge one field of the pending payload. Generic keeps callers type-safe:
    // updatePending('rotate', 90) and updatePending('watermark', {...}) both check out.
    const updatePending = useCallback(<K extends keyof TransformPayload>(
        key: K,
        value: TransformPayload[K]
    ) => {
        setPending(prev => {
            if (value === undefined) {
                // Drop the key entirely rather than keeping it set to undefined,
                // so hasPendingChanges (and the sidebar's per-step dot) stay accurate.
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
            const result = await transformImage(image._id, pending)
            pushTransformedImage(result)
            clearPending()
        } catch (err) {
            setApplyError(err instanceof Error ? err.message : String(err))
        } finally {
            setApplying(false)
        }
    }, [image, pending, hasPendingChanges, pushTransformedImage, clearPending])

    const canGoBefore = !!image?.parentImage
    const canGoAfter = currentIndex < chain.length - 1

    return {
        image,
        error,
        loading,
        canGoBefore,
        canGoAfter,
        goBefore,
        goAfter,

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