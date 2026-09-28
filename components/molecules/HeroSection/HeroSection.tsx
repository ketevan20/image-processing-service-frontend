'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const HeroSection = () => {
  const router = useRouter()

  return (
    <div className='flex-1 w-full h-full p-6 md:p-10 flex flex-col md:flex-row justify-between overflow-hidden relative gap-20 md:gap-0'>
      <div className="relative flex-1 flex flex-col justify-center gap-4 md:gap-6">
        <div className="pointer-events-none absolute -top-10 -left-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

        <p className="relative flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gray-400">
          <span className="h-px w-10 bg-purple-400/60" />
          Image processing service
        </p>

        <h1 className="relative text-4xl sm:text-5xl lg:text-7xl font-serif leading-[0.95] tracking-tight">
          Every image,
          <br />
          in{" "}
          <span className="inline-block pr-1 italic bg-linear-to-r from-purple-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            transformation
          </span>
          .
        </h1>

        <p className="relative text-gray-400 max-w-md text-sm lg:text-base leading-relaxed">
          Upload an image once. Resize, crop, rotate, watermark, filter and
          re-encode it — then fetch any version from a single address.
        </p>

        <button
          onClick={() => router.push('/register')}
          className="group relative self-start mt-4 inline-flex items-center gap-3 px-5 md:px-7 py-3 md:py-3.5 text-xs uppercase tracking-[0.2em] border border-purple-400/60 hover:bg-purple-400 hover:text-black transition-colors duration-300">
          Begin metamorphosis
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      <div className='flex-1 max-h-full flex items-center justify-center relative min-h-70 md:min-h-0'>
        <div className='relative w-[70%] sm:w-[60%] md:w-[50%] h-[calc(100%-60px)] md:h-[calc(100%-100px)]'>
          <video
            autoPlay muted loop playsInline
            poster="/videos/poster.jpg"
            className="w-full h-full object-cover overflow-hidden"
          >
            <source src="/blob-tracker-01.mp4" type="video/mp4" className='max-w-full max-h-full object-cover' />
          </video>
          <div className='w-4 h-4 md:w-6 md:h-6 border-l border-t border-white absolute left-0 top-0 -translate-x-full -translate-y-full'></div>
          <div className='w-4 h-4 md:w-6 md:h-6 border-r border-t border-white absolute right-0 top-0 translate-x-full -translate-y-full'></div>
          <div className='w-4 h-4 md:w-6 md:h-6 border-l border-b border-white absolute left-0 bottom-0 -translate-x-full translate-y-full'></div>
          <div className='w-4 h-4 md:w-6 md:h-6 border-r border-b border-white absolute right-0 bottom-0 translate-x-full translate-y-full'></div>
        </div>

        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-gray-400" aria-hidden="true">
          <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="41.5" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.6" />
        </svg>
      </div>

    </div>
  )
}

export default HeroSection