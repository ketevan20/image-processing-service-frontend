import { Image } from "@/types/image"
import { TransformPayload } from "@/types/transform"

export async function getImages(page = 1, limit = 12) {
    const res = await fetch(
        `/api/images?page=${page}&limit=${limit}`
    )

    if (!res.ok) {
        throw new Error('Failed to fetch images')
    }

    return res.json()
}

export async function getOriginalImages(page = 1, limit = 12) {
    const res = await fetch(
        `/api/images/originals?page=${page}&limit=${limit}`
    )

    if (!res.ok) {
        throw new Error('Failed to fetch images')
    }

    return res.json()
}

export async function getTransformedImages(page = 1, limit = 12) {
    const res = await fetch(
        `/api/images/transformed?page=${page}&limit=${limit}`
    )

    if (!res.ok) {
        throw new Error('Failed to fetch images')
    }

    return res.json()
}

export async function deleteImageById(id: string) {
    const res = await fetch(
        `/api/images/${id}`, {
        method: 'DELETE'
    }
    )

    if (!res.ok) {
        throw new Error("Failed to delete image")
    }

    return res.json()
}

export async function uploadImage(image: File) {
    const formData = new FormData()
    formData.append('file', image)

    const res = await fetch('/api/images', {
        method: 'POST',
        body: formData,
    })

    if (!res.ok) {
        const data = await res.json().catch(() => null)

        throw new Error(data?.message || 'Failed to upload image')
    }

    return res.json()
}

export async function getImageById(id: string) {
    const res = await fetch(
        `/api/images/${id}`, { method: "GET" }
    )

    if (!res.ok) {
        throw new Error('Failed to fetch images')
    }

    return res.json()
}

export async function transformImage(id: string, payload: TransformPayload): Promise<Image> {
    const res = await fetch(`/api/images/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.log('Transform failed:', res.status, data) 
        throw new Error(data.message || 'Failed to transform image', { cause: res.status })
    }

    return res.json()
}