import React from 'react'
import { UploadCloud } from 'lucide-react'

type UploadSectionProps = {
  uploadImage: (image: File) => void
}

const UploadSection = ({ uploadImage }: UploadSectionProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadImage(file)
    e.target.value = ''
  }

  return (
    <div className="relative border border-dashed border-white/20 hover:border-purple-400/50 transition-colors h-30 flex flex-col items-center justify-center gap-3 cursor-pointer">
      <UploadCloud
        size={22}
        strokeWidth={1.25}
        className="text-gray-500"
      />

      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
        click to browse an image
      </p>

      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-700">
        JPG · PNG · WEBP — up to 10MB
      </p>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  )
}

export default UploadSection