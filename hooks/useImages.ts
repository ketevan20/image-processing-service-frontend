'use client'
import { useEffect, useState } from 'react'
import { bulkDeleteImages, deleteImageById, getImages, getOriginalImages, getTransformedImages, uploadImage, } from '@/lib/api/images'
import type { Image, ImagesResponse } from '@/types/image'

export type ImageFilter = 'all' | 'originals' | 'transformed'

export function useImages() {
  const [images, setImages] = useState<Image[]>([])
  const [filter, setFilter] = useState<ImageFilter>('all')
  const [page, setPage] = useState(1)
  const [limit] = useState(12)

  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const fetchImages = async () => {
    try {
      setLoading(true)
      setError(null)

      let response: ImagesResponse

      switch (filter) {
        case 'originals':
          response = await getOriginalImages(page, limit)
          break

        case 'transformed':
          response = await getTransformedImages(page, limit)
          break

        default:
          response = await getImages(page, limit)
      }

      setImages(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch images'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [filter, page, limit])

  const deleteImage = async (id: string) => {
    try {
      setDeletingId(id)
      setError(null)

      await deleteImageById(id)

      await fetchImages()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to delete image'
      )
    } finally {
      setDeletingId(null)
    }
  }

  const bulkDelete = async (ids: string[]): Promise<boolean> => {
    try {
      setBulkDeleting(true)
      setError(null)

      await bulkDeleteImages(ids)

      if (page > 1 && ids.length >= images.length) {
        setPage(page - 1)
      } else {
        await fetchImages()
      }
      return true
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete images'
      )
      return false
    } finally {
      setBulkDeleting(false)
    }
  }

  const addImage = async (image: File) => {
    try {
      setLoading(true)
      setError(null)

      await uploadImage(image)

      await fetchImages()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to upload image'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilter: ImageFilter) => {
    setFilter(newFilter)
    setPage(1)
  }

  return {
    images,
    loading,
    deletingId,
    error,

    filter,
    setFilter: handleFilterChange,

    page,
    setPage,

    limit,
    total,
    totalPages,

    deleteImage,
    
    bulkDelete,
    bulkDeleting,

    addImage
  }
}