import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { vendorId?: string | null };

    if (!user.vendorId) {
        return NextResponse.json({ error: "Not a vendor" }, { status: 403 });
    }

    const { id } = await params;

    try {
        const booking = await prisma.booking.findFirst({
            where: {
                id,
                vendorId: user.vendorId,
            },
            include: {
                items: {
                    include: {
                        photographer: { select: { id: true, name: true } },
                        videographer: { select: { id: true, name: true } },
                        equipment: { select: { id: true, name: true } },
                        transport: { select: { id: true, name: true, vehicleType: true } },
                    },
                },
                location: true,
            },
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json(booking);
    } catch {
        return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
    }
}
