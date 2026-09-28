import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const protectedRoutes = ['/studio', '/library']
const authRoutes = ['/login', '/register']

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

async function isTokenValid(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.includes(pathname)
  const isLandingPage = pathname === '/'

  const hasValidToken = !!token && (await isTokenValid(token))

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

  if (isLandingPage && hasValidToken) {
    return NextResponse.redirect(new URL('/studio', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/studio/:path*', '/library/:path*', '/'],
}