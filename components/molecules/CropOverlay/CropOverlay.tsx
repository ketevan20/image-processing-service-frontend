'use client'
import { TransformPayload } from '@/types/transform'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

type Box = { x: number; y: number; w: number; h: number } // fractions 0-1 of the image
type Handle = 'move' | 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se'

const MIN_PX = 24
const DEFAULT_BOX: Box = { x: 0.1, y: 0.1, w: 0.8, h: 0.8 }
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

const HANDLES: { id: Handle; left: string; top: string; cursor: string }[] = [
    { id: 'nw', left: '0%', top: '0%', cursor: 'nwse-resize' },
    { id: 'n', left: '50%', top: '0%', cursor: 'ns-resize' },
    { id: 'ne', left: '100%', top: '0%', cursor: 'nesw-resize' },
    { id: 'e', left: '100%', top: '50%', cursor: 'ew-resize' },
    { id: 'se', left: '100%', top: '100%', cursor: 'nwse-resize' },
    { id: 's', left: '50%', top: '100%', cursor: 'ns-resize' },
    { id: 'sw', left: '0%', top: '100%', cursor: 'nesw-resize' },
    { id: 'w', left: '0%', top: '50%', cursor: 'ew-resize' },
]

type Props = {
    imgEl: HTMLImageElement
    value: TransformPayload['crop']
    onCommit: (crop: TransformPayload['crop']) => void
}

const CropOverlay = ({ imgEl, value, onCommit }: Props) => {
    const [rect, setRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
    const [box, setBox] = useState<Box>(DEFAULT_BOX)
    const drag = useRef<{ handle: Handle; startX: number; startY: number; start: Box } | null>(null)

    // Track where the <img> actually renders inside the stage
    const measure = useCallback(() => {
        setRect({
            left: imgEl.offsetLeft,
            top: imgEl.offsetTop,
            width: imgEl.offsetWidth,
            height: imgEl.offsetHeight,
        })
    }, [imgEl])

    useLayoutEffect(() => {
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(imgEl)
        if (imgEl.parentElement) ro.observe(imgEl.parentElement)
        imgEl.addEventListener('load', measure)
        return () => {
            ro.disconnect()
            imgEl.removeEventListener('load', measure)
        }
    }, [imgEl, measure])

    // Keep the box in sync with pending.crop (typed inputs, "Clear", coming back to this step)
    useEffect(() => {
        if (drag.current) return
        const nw = imgEl.naturalWidth
        const nh = imgEl.naturalHeight
        if (!value || !nw || !nh) {
            setBox(DEFAULT_BOX)
            return
        }
        const x = (value.x ?? 0) / nw
        const y = (value.y ?? 0) / nh
        setBox({
            x,
            y,
            w: (value.width ?? nw - (value.x ?? 0)) / nw,
            h: (value.height ?? nh - (value.y ?? 0)) / nh,
        })
    }, [value, imgEl])

    const onPointerDown = (handle: Handle) => (e: React.PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.setPointerCapture(e.pointerId)
        drag.current = { handle, startX: e.clientX, startY: e.clientY, start: box }
    }

    const onPointerMove = (e: React.PointerEvent) => {
        const d = drag.current
        if (!d || !rect) return
        const dx = (e.clientX - d.startX) / rect.width
        const dy = (e.clientY - d.startY) / rect.height
        const minW = MIN_PX / rect.width
        const minH = MIN_PX / rect.height
        let { x, y, w, h } = d.start

        if (d.handle === 'move') {
            x = clamp(x + dx, 0, 1 - w)
            y = clamp(y + dy, 0, 1 - h)
        } else {
            if (d.handle.includes('w')) { const nx = clamp(x + dx, 0, x + w - minW); w = x + w - nx; x = nx }
            if (d.handle.includes('e')) { w = clamp(w + dx, minW, 1 - x) }
            if (d.handle.includes('n')) { const ny = clamp(y + dy, 0, y + h - minH); h = y + h - ny; y = ny }
            if (d.handle.includes('s')) { h = clamp(h + dy, minH, 1 - y) }
        }
        setBox({ x, y, w, h })
    }

    const onPointerUp = () => {
        if (!drag.current) return
        drag.current = null
        const nw = imgEl.naturalWidth
        const nh = imgEl.naturalHeight
        onCommit({
            x: Math.round(box.x * nw),
            y: Math.round(box.y * nh),
            width: Math.round(box.w * nw),
            height: Math.round(box.h * nh),
        })
    }

    if (!rect) return null

    return (
        <div
            className='absolute touch-none'
            style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        >
            <div
                onPointerDown={onPointerDown('move')}
                className='absolute border border-white cursor-move'
                style={{
                    left: `${box.x * 100}%`,
                    top: `${box.y * 100}%`,
                    width: `${box.w * 100}%`,
                    height: `${box.h * 100}%`,
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)', // dims everything outside the crop
                }}
            >
                {/* rule-of-thirds grid */}
                <div className='absolute inset-y-0 left-1/3 w-px bg-white/40 pointer-events-none' />
                <div className='absolute inset-y-0 left-2/3 w-px bg-white/40 pointer-events-none' />
                <div className='absolute inset-x-0 top-1/3 h-px bg-white/40 pointer-events-none' />
                <div className='absolute inset-x-0 top-2/3 h-px bg-white/40 pointer-events-none' />

                {HANDLES.map((h) => (
                    <div
                        key={h.id}
                        onPointerDown={onPointerDown(h.id)}
                        className='absolute w-3.5 h-3.5 bg-white'
                        style={{ left: h.left, top: h.top, transform: 'translate(-50%, -50%)', cursor: h.cursor }}
                    />
                ))}
            </div>
        </div>
    )
}

export default CropOverlay