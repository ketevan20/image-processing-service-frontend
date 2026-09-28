import { ImageFilter } from '@/hooks/useImages';
import React from 'react'

const tabColors = ['bg-rose-400 text-black', 'bg-sky-400 text-black', 'bg-amber-400 text-black']

type FiltersSectionProps = {
  setFilter: (filter: ImageFilter) => void;
  filter: ImageFilter;
  total: number;
}

const FiltersSection = ({ setFilter, filter, total }: FiltersSectionProps) => {
  const filters: ImageFilter[] = ['all', 'originals', 'transformed']

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="font-serif italic text-3xl md:text-4xl text-white">Studio</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-1">{total} images</p>
      </div>

      <div className="flex items-center flex-wrap gap-2 md:gap-1 md:border md:border-white/10 p-1">
        {filters.map((label, i) => (
          <button
            key={label}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors max-md:border max-md:border-white/10 ${filter === label ? tabColors[i] : 'text-gray-400 hover:text-white'
              }`}
            onClick={() => {setFilter(label)}}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FiltersSection