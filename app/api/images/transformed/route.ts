import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const token = (await cookies()).get('token')?.value

    if (!token) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)

    const page = searchParams.get('page') ?? '1'
    const limit = searchParams.get('limit') ?? '12'

    try {
        const res = await fetch(
            `${process.env.BACKEND_URL}/images/transformed?page=${page}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(
                { message: data.message || 'Something went wrong' },
                { status: res.status }
            )
        }

        return NextResponse.json(data)
    } catch (err) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        )
    }
}