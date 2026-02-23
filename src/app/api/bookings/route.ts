import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            bookingCode,
            vendorId,
            customerName,
            customerEmail,
            customerPhone,
            eventDate,
            eventLocation,
            eventDetails,
            specialRequests,
            items,
            subtotal,
            tax,
            total
        } = body;

        // Find or create location
        let locationId = null;
        if (eventLocation) {
            const location = await prisma.location.findFirst({
                where: { name: eventLocation }
            });
            if (location) {
                locationId = location.id;
            }
        }

        // Validate vendorId — it may be stale from a previous session/seed
        let validVendorId = null;
        if (vendorId) {
            const vendor = await prisma.vendor.findUnique({
                where: { id: vendorId }
            });
            if (vendor) {
                validVendorId = vendor.id;
            }
        }

        // Create booking with items
        const booking = await prisma.booking.create({
            data: {
                bookingCode,
                vendorId: validVendorId,
                customerName,
                customerEmail,
                customerPhone,
                eventDate: new Date(eventDate),
                eventDetails: eventDetails || null,
                specialRequests: specialRequests || null,
                locationId,
                subtotal,
                tax,
                total,
                status: 'PENDING',
                paymentStatus: 'UNPAID',
                items: {
                    create: await Promise.all(items.map(async (item: {
                        id: string;
                        type: string;
                        name: string;
                        price: number;
                        quantity: number;
                        duration: number;
                        priceUnit: string;
                    }) => {
                        const itemData: {
                            itemType: string;
                            itemName: string;
                            quantity: number;
                            unitPrice: number;
                            totalPrice: number;
                            duration: number;
                            durationType: string;
                            photographerId?: string;
                            videographerId?: string;
                            equipmentId?: string;
                            transportId?: string;
                        } = {
                            itemType: item.type,
                            itemName: item.name,
                            quantity: item.quantity,
                            unitPrice: item.price,
                            totalPrice: item.price * item.quantity * item.duration,
                            duration: item.duration,
                            durationType: item.priceUnit || 'day',
                        };

                        // Validate and set the appropriate relation based on item type
                        if (item.type === 'photographer' && item.id) {
                            const exists = await prisma.photographer.findUnique({ where: { id: item.id } });
                            if (exists) itemData.photographerId = item.id;
                        } else if (item.type === 'videographer' && item.id) {
                            const exists = await prisma.videographer.findUnique({ where: { id: item.id } });
                            if (exists) itemData.videographerId = item.id;
                        } else if (item.type === 'equipment' && item.id) {
                            const exists = await prisma.equipment.findUnique({ where: { id: item.id } });
                            if (exists) itemData.equipmentId = item.id;
                        } else if (item.type === 'transport' && item.id) {
                            const exists = await prisma.transport.findUnique({ where: { id: item.id } });
                            if (exists) itemData.transportId = item.id;
                        }

                        return itemData;
                    }))
                }
            },
            include: {
                items: true,
                location: true
            }
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}
