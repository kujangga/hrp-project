import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Simple in-memory rate limiter (IP-based, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 requests per minute per IP

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    entry.count++;
    if (entry.count > RATE_LIMIT_MAX) {
        return true;
    }
    return false;
}

// Mask PII for public tracking
function maskEmail(email: string): string {
    const [user, domain] = email.split('@');
    if (!user || !domain) return '***@***.com';
    const visible = user.length <= 2 ? user[0] : user.slice(0, 2);
    return `${visible}${'*'.repeat(Math.max(user.length - 2, 1))}@${domain}`;
}

function maskPhone(phone: string): string {
    if (phone.length <= 4) return '****';
    return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4);
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ bookingCode: string }> }
) {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        );
    }

    try {
        const { bookingCode } = await params;

        // Validate booking code format before querying DB
        if (!bookingCode || bookingCode.length < 5 || bookingCode.length > 30) {
            return NextResponse.json(
                { error: 'Invalid booking code format' },
                { status: 400 }
            );
        }

        const booking = await prisma.booking.findUnique({
            where: { bookingCode },
            include: {
                items: {
                    include: {
                        photographer: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                                grade: true
                            }
                        },
                        videographer: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                                grade: true
                            }
                        },
                        equipment: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                category: true
                            }
                        },
                        transport: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                vehicleType: true
                            }
                        }
                    }
                },
                location: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!booking) {
            // Generic message to prevent enumeration
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Return sanitized booking data — mask PII for public access
        const sanitizedBooking = {
            bookingCode: booking.bookingCode,
            customerName: booking.customerName,
            customerEmail: maskEmail(booking.customerEmail),
            customerPhone: maskPhone(booking.customerPhone),
            eventDate: booking.eventDate,
            eventDetails: booking.eventDetails,
            location: booking.location,
            subtotal: booking.subtotal,
            tax: booking.tax,
            total: booking.total,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            items: booking.items.map(item => ({
                itemType: item.itemType,
                itemName: item.itemName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                duration: item.duration,
                durationType: item.durationType,
                photographer: item.photographer,
                videographer: item.videographer,
                equipment: item.equipment,
                transport: item.transport
            })),
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        };

        return NextResponse.json(sanitizedBooking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        return NextResponse.json(
            { error: 'Failed to fetch booking' },
            { status: 500 }
        );
    }
}
