import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const videographer = await prisma.videographer.findUnique({
            where: { id },
            include: {
                location: true,
                portfolios: true
            }
        });

        if (!videographer) {
            return NextResponse.json(
                { error: 'Videographer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(videographer);
    } catch (error) {
        console.error('Error fetching videographer:', error);
        return NextResponse.json(
            { error: 'Failed to fetch videographer' },
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

        const videographer = await prisma.videographer.update({
            where: { id },
            data: {
                name: body.name,
                bio: body.bio,
                phone: body.phone,
                instagram: body.instagram,
                grade: body.grade,
                hourlyRate: body.hourlyRate,
                dailyRate: body.dailyRate,
                profileImage: body.profileImage,
                status: body.status,
                locationId: body.locationId,
            }
        });

        return NextResponse.json(videographer);
    } catch (error) {
        console.error('Error updating videographer:', error);
        return NextResponse.json(
            { error: 'Failed to update videographer' },
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
        await prisma.videographer.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting videographer:', error);
        return NextResponse.json(
            { error: 'Failed to delete videographer' },
            { status: 500 }
        );
    }
}
