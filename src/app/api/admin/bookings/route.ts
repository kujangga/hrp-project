import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                items: {
                    include: {
                        photographer: true,
                        videographer: true,
                        equipment: true,
                        transport: true
                    }
                },
                location: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}
