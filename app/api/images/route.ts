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
            `${process.env.BACKEND_URL}/images?page=${page}&limit=${limit}`,
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

export async function POST(request: Request) {
    const token = (await cookies()).get('token')?.value

    if (!token) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        const formData = await request.formData();

        const res = await fetch(`${process.env.BACKEND_URL}/images`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

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
