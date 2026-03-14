import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

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
