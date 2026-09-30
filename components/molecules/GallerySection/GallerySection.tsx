'use client'

import React, { useState } from 'react'
import { Wand2, Trash2 } from 'lucide-react'
import { Image } from '@/types/image'
import Loader from '@/components/atoms/Loader/Loader'
import ConfirmModal from '@/components/atoms/ConfirmModal/ConfirmModal'
import Link from 'next/link'

const accents = [
  { grad: 'from-rose-500/15 via-pink-500/5', badge: 'bg-rose-400/15 text-rose-300 border-rose-400/30', ring: 'hover:border-rose-400/50' },
  { grad: 'from-sky-500/15 via-blue-500/5', badge: 'bg-sky-400/15 text-sky-300 border-sky-400/30', ring: 'hover:border-sky-400/50' },
  { grad: 'from-emerald-500/15 via-green-500/5', badge: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30', ring: 'hover:border-emerald-400/50' },
  { grad: 'from-amber-500/15 via-orange-500/5', badge: 'bg-amber-400/15 text-amber-300 border-amber-400/30', ring: 'hover:border-amber-400/50' },
]

type GallerySectionProps = {
  images: Image[];
  filter: string;
  loading: boolean;
  deleteImage: (id: string) => void;
  deletingId: string | null;
  bulkDelete: (ids: string[]) => Promise<boolean>;
  bulkDeleting: boolean;
}

const GallerySection = ({ images, filter, loading, deleteImage, deletingId, bulkDelete, bulkDeleting }: GallerySectionProps) => {
  const [pendingDelete, setPendingDelete] = useState<Image | null>(null)
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [confirmBulk, setConfirmBulk] = useState(false)

  const toggleSelect = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const exitSelectMode = () => {
    setSelectMode(false)
    setSelected(new Set())
  }

  if (images.length === 0) {
    return (
      <div className="flex-1 border border-white/10 h-64 flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
          {filter === 'transformed' ? 'No transformed images yet' : "Nothing here yet — upload your first image"}
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button
          onClick={selectMode ? exitSelectMode : () => setSelectMode(true)}
          className="text-[10px] uppercase tracking-[0.15em] text-gray-400 hover:text-white border border-white/10 px-3 py-1.5"
        >
          {selectMode ? 'Cancel' : 'Select'}
        </button>

        {selectMode && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelected(new Set(images.map(i => i._id)))}
              className="text-[10px] uppercase tracking-[0.15em] text-gray-400 hover:text-white"
            >
              Select all
            </button>
            <button
              disabled={selected.size === 0}
              onClick={() => setConfirmBulk(true)}
              className="text-[10px] uppercase tracking-[0.15em] text-rose-300 border border-rose-400/30 px-3 py-1.5 disabled:opacity-30"
            >
              Delete ({selected.size})
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => {
          const accent = accents[i % accents.length]

          return (
            <div
              key={img._id}
              onClick={selectMode ? () => toggleSelect(img._id) : undefined}
              className={`h-fit group relative border ${selected.has(img._id) ? 'border-rose-400/70' : 'border-white/10'
                } ${accent.ring} transition-colors ${selectMode ? 'cursor-pointer' : ''}`}
            >
              <div className={`relative aspect-square bg-linear-to-br ${accent.grad} to-transparent`}>
                <img
                  src={img.url}
                  alt={img.originalName}
                  className="w-full h-full object-cover"
                />

                {selectMode && (
                  <span
                    className={`absolute top-2 right-2 w-4 h-4 border flex items-center justify-center text-[10px] ${selected.has(img._id)
                      ? 'bg-rose-400 border-rose-400 text-black'
                      : 'bg-black/60 border-white/40'
                      }`}
                  >
                    {selected.has(img._id) && '✓'}
                  </span>
                )}

                {
                  !selectMode && (
                    <div className="flex md:hidden absolute bottom-2 right-2 gap-1.5">
                      <Link
                        href={`/studio/${img._id}`}
                        className="w-7 h-7 flex items-center justify-center bg-black/60 border border-white/20 text-gray-300 active:text-white active:border-white/50"
                      >
                        <Wand2 size={12} strokeWidth={1.5} />
                      </Link>

                      <button
                        onClick={() => setPendingDelete(img)}
                        className="w-7 h-7 flex items-center justify-center bg-black/60 border border-white/20 text-gray-300 active:text-rose-400 active:border-rose-400/60"
                      >
                        <Trash2 size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                  )
                }
              </div>

              {
                !selectMode && (
                  <div className="hidden absolute inset-0 md:flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                    <Link
                      href={`/studio/${img._id}`}
                      className="w-8 h-8 flex items-center justify-center border border-white/20 text-gray-300 hover:text-white hover:border-white/50"
                    >
                      <Wand2 size={13} strokeWidth={1.5} />
                    </Link>

                    <button
                      onClick={() => setPendingDelete(img)}
                      className="w-8 h-8 flex items-center justify-center border border-white/20 text-gray-300 hover:text-rose-400 hover:border-rose-400/60"
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                )
              }

              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-xs text-gray-300 truncate">
                  {img.originalName}
                </span>

                <span className="text-[10px] uppercase tracking-[0.15em] text-gray-600 shrink-0 ml-2">
                  {img.mimeType.split('/')[1]}
                </span>
              </div>

              {img.parentImage !== null && (
                <span
                  className={`absolute top-2 left-2 text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 border ${accent.badge}`}
                >
                  Transformed
                </span>
              )}
            </div>
          )
        })}
      </div>

      <ConfirmModal
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.originalName}"?`}
        description="This can't be undone. Any transformed versions derived from this image may be affected."
        confirmLabel="Delete"
        loading={pendingDelete?._id === deletingId}
        onConfirm={async () => {
          if (!pendingDelete) return
          await deleteImage(pendingDelete._id)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
      />

      <ConfirmModal
        open={confirmBulk}
        title={`Delete ${selected.size} image${selected.size === 1 ? '' : 's'}?`}
        description="This can't be undone. Any transformed versions derived from these images may be affected."
        confirmLabel="Delete"
        loading={bulkDeleting}
        onConfirm={async () => {
          const ok = await bulkDelete(Array.from(selected))
          if (ok) {
            setConfirmBulk(false)
            exitSelectMode()
          }
        }}
        onCancel={() => setConfirmBulk(false)}
      />
    </div>
  )
}

export default GallerySection