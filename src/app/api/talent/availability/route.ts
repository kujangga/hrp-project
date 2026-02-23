import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function getPhotographerForUser(userId: string) {
    return prisma.photographer.findFirst({
        where: { userId },
    });
}

export async function GET(request: Request) {
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

    // Parse optional month/year from query params
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString());

    // Get the range: first day of previous month to last day of next month
    const startDate = new Date(year, month - 2, 1); // previous month
    const endDate = new Date(year, month + 1, 0, 23, 59, 59); // end of next month

    const availability = await prisma.availability.findMany({
        where: {
            photographerId: photographer.id,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: { date: "asc" },
    });

    return NextResponse.json(availability);
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
        const { date, isAvailable } = body;

        if (!date) {
            return NextResponse.json({ error: "date is required" }, { status: 400 });
        }

        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);

        // Upsert: create or update availability for this date
        const result = await prisma.availability.upsert({
            where: {
                photographerId_date: {
                    photographerId: photographer.id,
                    date: dateObj,
                },
            },
            update: {
                isAvailable: isAvailable !== undefined ? isAvailable : true,
            },
            create: {
                photographerId: photographer.id,
                date: dateObj,
                isAvailable: isAvailable !== undefined ? isAvailable : false,
            },
        });

        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
    }
}
