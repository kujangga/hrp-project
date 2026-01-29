import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const equipment = await prisma.equipment.findMany({
            include: {
                location: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(equipment);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        return NextResponse.json(
            { error: 'Failed to fetch equipment' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const equipment = await prisma.equipment.create({
            data: {
                name: body.name,
                description: body.description || null,
                category: body.category || 'accessory',
                brand: body.brand || null,
                dailyRate: body.dailyRate || 0,
                quantity: body.quantity || 1,
                availableQty: body.availableQty || body.quantity || 1,
                image: body.image || null,
                features: body.features || null,
                status: body.status || 'AVAILABLE',
                locationId: body.locationId || null,
            }
        });

        return NextResponse.json(equipment, { status: 201 });
    } catch (error) {
        console.error('Error creating equipment:', error);
        return NextResponse.json(
            { error: 'Failed to create equipment' },
            { status: 500 }
        );
    }
}
