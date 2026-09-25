import React from 'react'
import { UploadCloud } from 'lucide-react'

const UploadSection = () => {
  return (
    <div className="relative border border-dashed border-white/20 hover:border-purple-400/50 transition-colors h-40 flex flex-col items-center justify-center gap-3 cursor-pointer">
      <UploadCloud size={22} strokeWidth={1.25} className="text-gray-500" />
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
        Drop an image, or click to browse
      </p>
      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-700">
        JPG · PNG · WEBP — up to 10MB
      </p>
      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
    </div>
  )
}

export default UploadSection