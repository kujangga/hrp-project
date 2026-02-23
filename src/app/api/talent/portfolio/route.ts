import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function getPhotographerForUser(userId: string) {
    return prisma.photographer.findFirst({
        where: { userId },
    });
}

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role?: string };

    if (user.role !== "TALENT") {
        return NextResponse.json({ error: "Not a talent" }, { status: 403 });
    }

    const photographer = await getPhotographerForUser(user.id);

    if (!photographer) {
        return NextResponse.json({ error: "Photographer not found" }, { status: 404 });
    }

    const portfolios = await prisma.portfolio.findMany({
        where: { photographerId: photographer.id },
        orderBy: { order: "asc" },
    });

    return NextResponse.json(portfolios);
}

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role?: string };

    if (user.role !== "TALENT") {
        return NextResponse.json({ error: "Not a talent" }, { status: 403 });
    }

    const photographer = await getPhotographerForUser(user.id);

    if (!photographer) {
        return NextResponse.json({ error: "Photographer not found" }, { status: 404 });
    }

    try {
        const body = await request.json();
        const { imageUrl, caption } = body;

        if (!imageUrl) {
            return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
        }

        // Count existing portfolios
        const count = await prisma.portfolio.count({
            where: { photographerId: photographer.id },
        });

        if (count >= 5) {
            return NextResponse.json({ error: "Maximum 5 portfolio items allowed" }, { status: 400 });
        }

        const portfolio = await prisma.portfolio.create({
            data: {
                photographerId: photographer.id,
                imageUrl,
                caption: caption || "New Photo",
                order: count,
            },
        });

        return NextResponse.json(portfolio, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 });
    }
}
