import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationSectionProps = {
  page: number
  totalPages: number
  setPage: (page: number) => void
}

const PaginationSection = ({page, totalPages, setPage}: PaginationSectionProps) => {
  const isFirstPage = page === 1
  const isLastPage = page === totalPages

  return (
    <div className="flex items-center justify-between border-t border-white/10 pt-6">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage(page - 1)}
          disabled={isFirstPage}
          className="w-8 h-8 flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:border-white/25 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1

          return (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`w-8 h-8 flex items-center justify-center text-xs border ${pageNumber === page
                  ? 'border-purple-400/60 text-white bg-purple-400/10'
                  : 'border-white/10 text-gray-500 hover:text-white hover:border-white/25'
                }`}
            >
              {pageNumber}
            </button>
          )
        })}

        <button
          onClick={() => setPage(page + 1)}
          disabled={isLastPage}
          className="w-8 h-8 flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:border-white/25 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default PaginationSection