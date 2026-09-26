import { transformationSteps } from '@/hooks/useTransform'
import { isStepSet } from '@/lib/api/isStepSet'
import { Image } from '@/types/image'
import { TransformPayload } from '@/types/transform'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import React from 'react'

type EditingOverviewProps = {
    image: Image | null
    canGoBefore: boolean
    canGoAfter: boolean
    onBefore: () => void
    onAfter: () => void
    pending: TransformPayload
}

const EditingOverview = ({ image, canGoBefore, canGoAfter, onBefore, onAfter, pending }: EditingOverviewProps) => {
    const activeSteps = transformationSteps.filter((step) => isStepSet(step.key, pending))

    const handleDownload = async () => {
        if (!image) return

        try {
            const response = await fetch(image.url)

            if (!response.ok) {
                throw new Error(`Download failed: ${response.status}`)
            }

            const blob = await response.blob()
            const blobUrl = URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = blobUrl
            a.download = image.originalName || 'image'
            document.body.appendChild(a)
            a.click()
            a.remove()

            URL.revokeObjectURL(blobUrl)
        } catch (error) {
            console.error('Download failed:', error)
        }
    }

    return (
        <div className='flex-1 max-h-full flex flex-col min-w-0'>
            <div
                className='flex-1 h-[32vh] sm:h-[38vh] lg:h-[45vh] flex items-center justify-center relative overflow-hidden'
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
                {image ? (
                    <img
                        src={image.url}
                        alt={image.originalName}
                        className='max-w-[90%] max-h-[85%] sm:max-w-[80%] sm:max-h-[80%] lg:max-w-[70%] lg:max-h-[75%] object-contain shadow-2xl shadow-black/60 border border-white/10'
                    />
                ) : (
                    <p className='text-white/20 text-sm'>No image loaded</p>
                )}
            </div>

            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 px-3 sm:px-4 py-3'>
                <div className='flex items-center gap-2 min-w-0 overflow-hidden order-2 sm:order-1'>
                    <p className='text-[11px] uppercase tracking-widest text-white/40 shrink-0'>Pipeline</p>

                    <div className='flex items-center gap-1.5 overflow-x-auto scrollbar-none'>
                        {activeSteps.length === 0 ? (
                            <span className='text-[11px] text-white/25'>No changes queued</span>
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

                <div className='flex items-center justify-between sm:justify-start gap-2 shrink-0 order-1 sm:order-2'>
                    <div className='flex items-center border border-white/10'>
                        <button
                            onClick={onBefore}
                            disabled={!canGoBefore}
                            className='flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs text-white/70 border-r border-white/10 transition-colors hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed'
                        >
                            <ChevronLeft size={14} />
                            <span className='hidden xs:inline'>Before</span>
                        </button>
                        <button
                            onClick={onAfter}
                            disabled={!canGoAfter}
                            className='flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs text-white/70 transition-colors hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed'
                        >
                            <span className='hidden xs:inline'>After</span>
                            <ChevronRight size={14} />
                        </button>
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={!image}
                        title='Download image'
                        className='flex items-center justify-center w-9 h-9 border border-white/10 text-white/70 transition-colors hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed'
                    >
                        <Download size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditingOverview