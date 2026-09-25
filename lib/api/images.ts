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

    if(!res.ok) {
        throw new Error("Failed to delete image")
    }

    return res.json()
}