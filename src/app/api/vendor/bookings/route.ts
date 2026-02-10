import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { vendorId?: string | null };

    if (!user.vendorId) {
        return NextResponse.json({ error: "Not a vendor" }, { status: 403 });
    }

    try {
        const bookings = await prisma.booking.findMany({
            where: { vendorId: user.vendorId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                bookingCode: true,
                customerName: true,
                eventDate: true,
                total: true,
                status: true,
                createdAt: true,
            },
        });

        return NextResponse.json(bookings);
    } catch {
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}
