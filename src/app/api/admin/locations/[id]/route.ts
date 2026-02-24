import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.location.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting location:', error);
        return NextResponse.json(
            { error: 'Failed to delete location' },
            { status: 500 }
        );
    }
}
