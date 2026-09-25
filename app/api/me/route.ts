import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const token = (await cookies()).get('token')?.value
  if (!token) return NextResponse.json({ user: null }, { status: 401 })

  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    if (!payload.exp || Date.now() >= payload.exp * 1000) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const res = await fetch(`${process.env.BACKEND_URL}/users/${payload.userId}`, {
      cache: 'no-store',
    })

    if (!res.ok) return NextResponse.json({ user: null }, { status: 401 })

    const user = await res.json()
    return NextResponse.json({ user: { username: user.username } })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}