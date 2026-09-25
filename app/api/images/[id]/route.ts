import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
    const { id } = await params;

    const token = (await cookies()).get('token')?.value

    if (!token) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        const res = await fetch(
            `${process.env.BACKEND_URL}/images/${id}`,
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

export async function DELETE(request: Request, { params }: Params) {
    const { id } = await params;

    const token = (await cookies()).get('token')?.value

    if (!token) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        const res = await fetch(
            `${process.env.BACKEND_URL}/images/${id}`,
            {
                method: 'DELETE',
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