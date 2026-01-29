import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const photographers = await prisma.photographer.findMany({
            include: {
                location: true,
                portfolios: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(photographers);
    } catch (error) {
        console.error('Error fetching photographers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch photographers' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const photographer = await prisma.photographer.create({
            data: {
                name: body.name,
                bio: body.bio || null,
                phone: body.phone || null,
                instagram: body.instagram || null,
                grade: body.grade || 'C',
                hourlyRate: body.hourlyRate || 0,
                dailyRate: body.dailyRate || 0,
                profileImage: body.profileImage || null,
                status: body.status || 'DRAFT',
                locationId: body.locationId || null,
            }
        });

        return NextResponse.json(photographer, { status: 201 });
    } catch (error) {
        console.error('Error creating photographer:', error);
        return NextResponse.json(
            { error: 'Failed to create photographer' },
            { status: 500 }
        );
    }
}
