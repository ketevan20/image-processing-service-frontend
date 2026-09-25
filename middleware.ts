import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/studio', '/library']
const authRoutes = ['/login', '/register']

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (!payload.exp) return true
    return Date.now() >= payload.exp * 1000
  } catch {
    return true 
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.includes(pathname)

  const hasValidToken = !!token && !isTokenExpired(token)

  if (isProtected && !hasValidToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    const response = NextResponse.redirect(loginUrl)
    if (token) response.cookies.delete('token') 
    return response
  }

  if (isAuthRoute && hasValidToken) {
    return NextResponse.redirect(new URL('/studio', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/studio/:path*', '/library/:path*'],
}