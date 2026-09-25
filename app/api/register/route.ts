import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  const res = await fetch(`${process.env.BACKEND_URL}/auth/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json({ message: data.message ?? 'Registration failed' }, { status: res.status })
  }

  const response = NextResponse.json({ user: data.user })

  response.cookies.set('token', data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  })

  return response
}