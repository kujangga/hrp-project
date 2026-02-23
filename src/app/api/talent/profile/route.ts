import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role?: string };

    if (user.role !== "TALENT") {
        return NextResponse.json({ error: "Not a talent" }, { status: 403 });
    }

    const photographer = await prisma.photographer.findFirst({
        where: { userId: user.id },
        include: {
            location: true,
            portfolios: { orderBy: { order: "asc" } },
        },
    });

    if (!photographer) {
        return NextResponse.json({ error: "Photographer profile not found" }, { status: 404 });
    }

    return NextResponse.json(photographer);
}

export async function PUT(request: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role?: string };

    if (user.role !== "TALENT") {
        return NextResponse.json({ error: "Not a talent" }, { status: 403 });
    }

    const photographer = await prisma.photographer.findFirst({
        where: { userId: user.id },
    });

    if (!photographer) {
        return NextResponse.json({ error: "Photographer profile not found" }, { status: 404 });
    }

    try {
        const body = await request.json();
        const { name, bio, phone, instagram, profileImage } = body;

        const updated = await prisma.photographer.update({
            where: { id: photographer.id },
            data: {
                ...(name !== undefined && { name }),
                ...(bio !== undefined && { bio }),
                ...(phone !== undefined && { phone }),
                ...(instagram !== undefined && { instagram }),
                ...(profileImage !== undefined && { profileImage }),
            },
            include: { location: true },
        });

        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
