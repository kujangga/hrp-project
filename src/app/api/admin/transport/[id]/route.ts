import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const transport = await prisma.transport.findUnique({
            where: { id },
            include: {
                location: true
            }
        });

        if (!transport) {
            return NextResponse.json(
                { error: 'Transport not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(transport);
    } catch (error) {
        console.error('Error fetching transport:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transport' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const transport = await prisma.transport.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                vehicleType: body.vehicleType,
                capacity: body.capacity,
                dailyRate: body.dailyRate,
                image: body.image,
                features: body.features,
                status: body.status,
                locationId: body.locationId,
            }
        });

        return NextResponse.json(transport);
    } catch (error) {
        console.error('Error updating transport:', error);
        return NextResponse.json(
            { error: 'Failed to update transport' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.transport.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting transport:', error);
        return NextResponse.json(
            { error: 'Failed to delete transport' },
            { status: 500 }
        );
    }
}
