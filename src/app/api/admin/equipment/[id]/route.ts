import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const equipment = await prisma.equipment.findUnique({
            where: { id },
            include: {
                location: true
            }
        });

        if (!equipment) {
            return NextResponse.json(
                { error: 'Equipment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(equipment);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        return NextResponse.json(
            { error: 'Failed to fetch equipment' },
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

        const equipment = await prisma.equipment.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                category: body.category,
                brand: body.brand,
                dailyRate: body.dailyRate,
                quantity: body.quantity,
                availableQty: body.availableQty,
                image: body.image,
                features: body.features,
                status: body.status,
                locationId: body.locationId,
            }
        });

        return NextResponse.json(equipment);
    } catch (error) {
        console.error('Error updating equipment:', error);
        return NextResponse.json(
            { error: 'Failed to update equipment' },
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
        await prisma.equipment.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting equipment:', error);
        return NextResponse.json(
            { error: 'Failed to delete equipment' },
            { status: 500 }
        );
    }
}
