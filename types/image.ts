export interface Image {
  _id: string
  key: string
  originalName: string
  url: string
  mimeType: string
  size: number
  owner: string
  parentImage: string | null
  transformations: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export interface ImagesResponse {
  data: Image[]
  total: number
  page: number
  totalPages: number
}