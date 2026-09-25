'use client'

import React, { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

type ConfirmModalProps = {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, loading, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative w-full max-w-sm bg-[#0e0908] border border-white/10 p-6">
        <div className="flex items-start gap-3 mb-2">
          <span className="w-8 h-8 shrink-0 flex items-center justify-center border border-rose-400/30 bg-rose-400/10 text-rose-400">
            <AlertTriangle size={14} strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-sm text-white">{title}</h2>
            {description && (
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white border border-white/10 hover:border-white/25 transition-colors disabled:opacity-40"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-black bg-rose-400 hover:bg-rose-300 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {loading && (
              <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal