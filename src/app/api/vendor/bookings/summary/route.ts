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

        const total = bookings.length;
        const pending = bookings.filter(b => b.status === "PENDING").length;
        const confirmed = bookings.filter(b => b.status === "CONFIRMED").length;
        const totalSpent = bookings.reduce((sum, b) => sum + b.total, 0);
        const recent = bookings.slice(0, 5);

        return NextResponse.json({ total, pending, confirmed, totalSpent, recent });
    } catch {
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}
