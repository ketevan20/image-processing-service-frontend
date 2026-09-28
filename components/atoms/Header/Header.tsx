'use client'

import { usePathname, useRouter } from 'next/navigation'
import { User, LogOut } from 'lucide-react'
import React, { useEffect, useRef, useState, useCallback } from 'react'

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const isAuthPage = pathname === '/login' || pathname === '/register'

  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const checkAuth = useCallback(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/me', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (!cancelled) setUsername(data.user?.username ?? null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return checkAuth()
  }, [pathname, checkAuth])

  // Re-check auth when the page is restored from bfcache (browser back/forward),
  // since that skips normal React effect re-runs and can leave stale auth state visible.
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) checkAuth()
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [checkAuth])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSignOut = async () => {
    await fetch('/api/logout', { method: 'POST' })
    setUsername(null)
    setMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky h-16 w-full flex items-center gap-6 px-6 md:px-10 border-b border-white/10 backdrop-blur-md bg-black/60 top-0 z-50">
      <a href={username ? '/studio' : '/'} className="group relative flex items-center gap-2.5">        <span className="relative w-6 h-6 flex items-center justify-center">
        <span className="absolute inset-0 rotate-45 border border-purple-400/70 transition-transform duration-500 group-hover:rotate-135" />
        <span className="absolute inset-1.25 rotate-45 bg-linear-to-br from-purple-300 to-fuchsia-400" />
      </span>
        <span className="font-serif text-lg italic tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-purple-200">
          Metamorphe
        </span>
      </a>

      <div className="flex-1" />

      {!isAuthPage && !loading && (
        username ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 flex items-center justify-center border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
              aria-label="Account menu"
            >
              <User size={15} strokeWidth={1.5} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-44 bg-black border border-white/10 py-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-gray-600 border-b border-white/10">
                  {username}
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <LogOut size={13} strokeWidth={1.5} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <a href="/login" className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">
            Log in
          </a>
        )
      )}
    </header>
  )
}

export default Header