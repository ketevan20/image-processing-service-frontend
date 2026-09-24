import React from 'react'

const Header = () => {
  return (
    <header className="relative h-16 w-full flex items-center gap-6 px-6 md:px-10 border-b border-white/10 backdrop-blur-md bg-black/60 sticky top-0 z-50">
      <a href="/" className="group relative flex items-center gap-2.5">
        <span className="relative w-6 h-6 flex items-center justify-center">
          <span className="absolute inset-0 rotate-45 border border-purple-400/70 transition-transform duration-500 group-hover:rotate-[135deg]" />
          <span className="absolute inset-[5px] rotate-45 bg-linear-to-br from-purple-300 to-fuchsia-400" />
        </span>
        <span className="font-serif text-lg italic tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-purple-200">
          Metamorphe
        </span>
      </a>

      <div className="flex-1" />

      <a href="/login" className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">
        Log in
      </a>
    </header>
  )
}

export default Header