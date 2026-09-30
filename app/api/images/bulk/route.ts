import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
    const token = (await cookies()).get('token')?.value

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()

        const res = await fetch(`${process.env.BACKEND_URL}/images/bulk`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ imageIds: body.imageIds }),
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(
                { message: data.message || 'Something went wrong' },
                { status: res.status }
            )
        }

        return NextResponse.json(data)
    } catch (err) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}