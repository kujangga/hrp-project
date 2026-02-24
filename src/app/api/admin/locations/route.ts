import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const locations = await prisma.location.findMany({
            where: { type: 'city' },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch locations' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Find or create parent country
        let country = await prisma.location.findFirst({
            where: { type: 'country' }
        });
        if (!country) {
            country = await prisma.location.create({
                data: { name: 'Indonesia', type: 'country' }
            });
        }

        const location = await prisma.location.create({
            data: {
                name: body.name,
                type: 'city',
                parentId: country.id,
            }
        });

        return NextResponse.json(location, { status: 201 });
    } catch (error) {
        console.error('Error creating location:', error);
        return NextResponse.json(
            { error: 'Failed to create location' },
            { status: 500 }
        );
    }
}
