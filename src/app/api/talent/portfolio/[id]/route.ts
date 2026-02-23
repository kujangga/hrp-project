import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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
        return NextResponse.json({ error: "Photographer not found" }, { status: 404 });
    }

    const { id } = await params;

    // Verify the portfolio item belongs to this photographer
    const portfolio = await prisma.portfolio.findFirst({
        where: {
            id,
            photographerId: photographer.id,
        },
    });

    if (!portfolio) {
        return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }

    try {
        await prisma.portfolio.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 });
    }
}
