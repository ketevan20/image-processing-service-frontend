import { transformationSteps } from '@/hooks/useTransform'
import { isStepSet } from '@/lib/api/isStepSet'
import { Image } from '@/types/image'
import { TransformPayload } from '@/types/transform'
import { Download } from 'lucide-react'
import React from 'react'
import CropOverlay from '../CropOverlay/CropOverlay'

type EditingOverviewProps = {
    image: Image | null
    transformed: Image | null
    pending: TransformPayload
    cropActive: boolean
    onCropChange: (crop: TransformPayload['crop']) => void
}

const EditingOverview = ({ image, transformed, pending, cropActive, onCropChange }: EditingOverviewProps) => {
    const [imgEl, setImgEl] = React.useState<HTMLImageElement | null>(null)
    const activeSteps = transformationSteps.filter((step) => isStepSet(step.key, pending))

    const download = async (img: Image) => {
        try {
            const response = await fetch(img.url)
            if (!response.ok) throw new Error(`Download failed: ${response.status}`)
            const blob = await response.blob()
            const blobUrl = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = blobUrl

            const ext = img.mimeType?.split('/')[1] ?? 'jpg'
            const baseName = (img.originalName || 'image').replace(/\.[^.]+$/, '')
            a.download = `${baseName}.${ext}`

            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(blobUrl)
        } catch (error) {
            console.error('Download failed:', error)
        }
    }

    const Slot = ({ label, img, isOriginal }: { label: string; img: Image | null; isOriginal?: boolean }) => (
        <div className='flex-1 min-w-0 min-h-0 flex flex-col'>
            <div className='flex items-center justify-between px-3 py-2 shrink-0'>
                <p className='text-[11px] uppercase tracking-widest text-white/40'>{label}</p>
                <button
                    onClick={() => img && download(img)}
                    disabled={!img}
                    title='Download'
                    className='flex items-center justify-center w-7 h-7 border border-white/10 text-white/60 transition-colors hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed'
                >
                    <Download size={12} />
                </button>
            </div>

            {/* Fixed height on mobile/tablet (stable regardless of content reflow),
                vh only kicks in at lg where the layout is overflow-hidden and non-scrolling. */}
            <div
                className='flex-1 h-64 sm:h-72 lg:h-[42vh] flex items-center justify-center relative overflow-hidden shrink-0'
                style={{
                    backgroundColor: '#0a0a0a',
                    backgroundImage: `
                        radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 60%),
                        linear-gradient(45deg, #131313 25%, transparent 25%),
                        linear-gradient(-45deg, #131313 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #131313 75%),
                        linear-gradient(-45deg, transparent 75%, #131313 75%)
                    `,
                    backgroundSize: '100% 100%, 24px 24px, 24px 24px, 24px 24px, 24px 24px',
                    backgroundPosition: '0 0, 0 0, 0 12px, 12px -12px, -12px 0px',
                }}
            >
                {img ? (
                    <>
                        <img
                            ref={isOriginal ? setImgEl : undefined}
                            draggable={false}
                            src={img.url}
                            alt={img.originalName}
                            className='max-w-[85%] max-h-[85%] object-contain shadow-2xl shadow-black/60 border border-white/10'
                        />
                        {isOriginal && cropActive && imgEl && (
                            <CropOverlay imgEl={imgEl} value={pending.crop} onCommit={onCropChange} />
                        )}
                    </>
                ) : (
                    <p className='text-white/20 text-sm p-4'>No changes applied yet</p>
                )}
            </div>
        </div>
    )

    return (
        <div className='flex-1 min-h-0 max-h-full flex flex-col min-w-0'>
            <div className='flex-1 min-h-0 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/10 overflow-y-auto sm:overflow-visible'>
                {Slot({ label: 'Original', img: image, isOriginal: true })}
                {Slot({ label: 'Edited', img: transformed })}
            </div>

            <div className='flex items-center gap-2 border-t border-white/10 px-4 py-3 overflow-x-auto scrollbar-none shrink-0'>
                <p className='text-[11px] uppercase tracking-widest text-white/40 shrink-0'>Pipeline</p>
                {activeSteps.length === 0 ? (
                    <span
                        className='text-white/40 flex items-center gap-1.5  py-1 border border-transparent text-[11px] shrink-0'
                    >
                        <span className='w-1.5 h-1.5 shrink-0' />
                        No Changes quoued
                    </span>

                ) : (
                    activeSteps.map((step) => (
                        <span
                            key={step.key}
                            className='flex items-center gap-1.5 px-2 py-1 border text-[11px] shrink-0'
                            style={{ borderColor: `${step.color}55`, backgroundColor: `${step.color}1a`, color: step.color }}
                        >
                            <span className='w-1.5 h-1.5 shrink-0' style={{ backgroundColor: step.color }} />
                            {step.label}
                        </span>
                    ))
                )}
            </div>
        </div>
    )
}

export default EditingOverview