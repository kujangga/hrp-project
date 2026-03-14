import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { id } = await params;
        const photographer = await prisma.photographer.findUnique({
            where: { id },
            include: {
                location: true,
                portfolios: true
            }
        });

        if (!photographer) {
            return NextResponse.json(
                { error: 'Photographer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(photographer);
    } catch (error) {
        console.error('Error fetching photographer:', error);
        return NextResponse.json(
            { error: 'Failed to fetch photographer' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        const photographer = await prisma.photographer.update({
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

        return NextResponse.json(photographer);
    } catch (error) {
        console.error('Error updating photographer:', error);
        return NextResponse.json(
            { error: 'Failed to update photographer' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { id } = await params;
        await prisma.photographer.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting photographer:', error);
        return NextResponse.json(
            { error: 'Failed to delete photographer' },
            { status: 500 }
        );
    }
}
