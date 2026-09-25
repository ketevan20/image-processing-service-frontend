'use client'
import FiltersSection from '@/components/molecules/FiltersSection/FiltersSection'
import GallerySection from '@/components/molecules/GallerySection/GallerySection'
import PaginationSection from '@/components/molecules/PaginationSection/PaginationSection'
import UploadSection from '@/components/molecules/UploadSection/UploadSection'
import { useImages } from '@/hooks/useImages'
import React from 'react'

const Studio = () => {
  const { images, loading, error, filter, setFilter, page, setPage, limit, total, totalPages, deleteImage } = useImages()


  return (
    <div className='w-full min-h-screen flex flex-col justify-between gap-8 text-white p-6 md:py-5 md:px-10'>
      <FiltersSection setFilter={setFilter} filter={filter} total={total}/>
      <UploadSection />
      <GallerySection loading={loading} images={images} filter={filter} deleteImage={deleteImage}/>
      <PaginationSection page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  )
}

export default Studio