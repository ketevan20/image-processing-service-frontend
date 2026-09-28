import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export const dynamic = 'force-dynamic'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function GET() {
  const token = (await cookies()).get('token')?.value
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }

  try {
    const { payload } = await jwtVerify(token, secret)

    const res = await fetch(`${process.env.BACKEND_URL}/users/${payload.userId}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
    }

    const user = await res.json()
    return NextResponse.json(
      { user: { username: user.username } },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch {
    return NextResponse.json({ user: null }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }
}