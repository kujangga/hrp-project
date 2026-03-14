import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const videographers = await prisma.videographer.findMany({
            include: {
                location: true,
                portfolios: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(videographers);
    } catch (error) {
        console.error('Error fetching videographers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch videographers' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const body = await request.json();

        const videographer = await prisma.videographer.create({
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

        return NextResponse.json(videographer, { status: 201 });
    } catch (error) {
        console.error('Error creating videographer:', error);
        return NextResponse.json(
            { error: 'Failed to create videographer' },
            { status: 500 }
        );
    }
}
