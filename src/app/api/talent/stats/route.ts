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
        include: { location: true },
    });

    if (!photographer) {
        return NextResponse.json({ error: "Photographer not found" }, { status: 404 });
    }

    // Count portfolio items
    const portfolioCount = await prisma.portfolio.count({
        where: { photographerId: photographer.id },
    });

    // Count bookings for this photographer
    const totalBookings = await prisma.bookingItem.count({
        where: {
            photographerId: photographer.id,
        },
    });

    // Count upcoming bookings (event date in the future)
    const now = new Date();
    const upcomingBookingItems = await prisma.bookingItem.findMany({
        where: {
            photographerId: photographer.id,
            booking: {
                eventDate: { gte: now },
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        },
        include: {
            booking: {
                include: { location: true },
            },
        },
        orderBy: {
            booking: { eventDate: "asc" },
        },
        take: 5,
    });

    const upcomingBookings = upcomingBookingItems.length;

    // Get next booking details
    const nextBooking = upcomingBookingItems.length > 0
        ? {
            date: upcomingBookingItems[0].booking.eventDate,
            client: upcomingBookingItems[0].booking.customerName,
            location: upcomingBookingItems[0].booking.location?.name || "TBD",
            status: upcomingBookingItems[0].booking.status,
        }
        : null;

    return NextResponse.json({
        name: photographer.name,
        grade: photographer.grade,
        profileImage: photographer.profileImage,
        portfolioItems: portfolioCount,
        totalBookings,
        upcomingBookings,
        nextBooking,
    });
}
