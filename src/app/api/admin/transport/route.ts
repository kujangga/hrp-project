import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const transport = await prisma.transport.findMany({
            include: {
                location: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(transport);
    } catch (error) {
        console.error('Error fetching transport:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transport' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const body = await request.json();

        const transport = await prisma.transport.create({
            data: {
                name: body.name,
                description: body.description || null,
                vehicleType: body.vehicleType || 'car',
                capacity: body.capacity || 4,
                dailyRate: body.dailyRate || 0,
                image: body.image || null,
                features: body.features || null,
                status: body.status || 'AVAILABLE',
                locationId: body.locationId || null,
            }
        });

        return NextResponse.json(transport, { status: 201 });
    } catch (error) {
        console.error('Error creating transport:', error);
        return NextResponse.json(
            { error: 'Failed to create transport' },
            { status: 500 }
        );
    }
}
