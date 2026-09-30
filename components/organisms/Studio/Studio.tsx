'use client'
import FiltersSection from '@/components/molecules/FiltersSection/FiltersSection'
import GallerySection from '@/components/molecules/GallerySection/GallerySection'
import PaginationSection from '@/components/molecules/PaginationSection/PaginationSection'
import UploadSection from '@/components/molecules/UploadSection/UploadSection'
import { useImages } from '@/hooks/useImages'
import { AlertCircle } from 'lucide-react'
import React from 'react'

const Studio = () => {
  const { images, loading, error, deletingId, filter, setFilter, page, setPage, limit, total, totalPages, deleteImage, addImage, bulkDelete, bulkDeleting } = useImages()


  return (
    <div className='w-full min-h-[calc(100vh-64px)] flex flex-col justify-between gap-8 text-white p-6 md:py-5 md:px-10'>
      {error && (
        <div className='flex items-center gap-2 px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm'>
          <AlertCircle size={16} className='shrink-0' />
          <p>{error}</p>
        </div>
      )}

      <FiltersSection setFilter={setFilter} filter={filter} total={total}/>
      <UploadSection uploadImage={addImage}/>
      <GallerySection deletingId={deletingId} loading={loading} images={images} filter={filter} deleteImage={deleteImage} bulkDelete={bulkDelete} bulkDeleting={bulkDeleting}/>
      <PaginationSection page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  )
}

export default Studio