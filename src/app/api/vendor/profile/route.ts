import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; vendorId?: string | null };

    if (!user.vendorId) {
        return NextResponse.json({ error: "Not a vendor" }, { status: 403 });
    }

    const vendor = await prisma.vendor.findUnique({
        where: { id: user.vendorId },
    });

    if (!vendor) {
        return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json(vendor);
}

export async function PUT(request: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; vendorId?: string | null };

    if (!user.vendorId) {
        return NextResponse.json({ error: "Not a vendor" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { companyName, contactPerson, phone, address, city, businessType, npwp } = body;

        const updatedVendor = await prisma.vendor.update({
            where: { id: user.vendorId },
            data: {
                ...(companyName && { companyName }),
                ...(contactPerson && { contactPerson }),
                ...(phone && { phone }),
                ...(address !== undefined && { address }),
                ...(city !== undefined && { city }),
                ...(businessType !== undefined && { businessType }),
                ...(npwp !== undefined && { npwp }),
            },
        });

        return NextResponse.json(updatedVendor);
    } catch {
        return NextResponse.json({ error: "Failed to update vendor profile" }, { status: 500 });
    }
}
