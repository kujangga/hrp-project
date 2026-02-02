import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ bookingCode: string }> }
) {
    try {
        const { bookingCode } = await params;

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
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Return sanitized booking data (hide internal IDs, admin-only fields)
        const sanitizedBooking = {
            bookingCode: booking.bookingCode,
            customerName: booking.customerName,
            customerEmail: booking.customerEmail,
            customerPhone: booking.customerPhone,
            eventDate: booking.eventDate,
            eventDetails: booking.eventDetails,
            specialRequests: booking.specialRequests,
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
