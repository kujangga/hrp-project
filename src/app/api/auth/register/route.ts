import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, companyName, contactPerson, phone, businessType } = body;

        // Validate required fields
        if (!email || !password || !name || !companyName || !contactPerson || !phone) {
            return NextResponse.json(
                { error: "Semua field wajib harus diisi" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email sudah terdaftar" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user + vendor in a transaction
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: "VENDOR",
                vendor: {
                    create: {
                        companyName,
                        contactPerson,
                        phone,
                        businessType: businessType || null,
                    },
                },
            },
            include: {
                vendor: true,
            },
        });

        return NextResponse.json(
            {
                message: "Registrasi berhasil",
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    vendorId: user.vendor?.id,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat registrasi" },
            { status: 500 }
        );
    }
}
