"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Copy, ArrowRight, Calendar, MapPin, Mail, Phone, User, Download } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { CartItem } from "@/contexts/BookingContext";

interface BookingData {
    bookingCode: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventDate: string;
    eventLocation: string;
    eventDetails: string;
    specialRequests: string;
    paymentMethod: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    createdAt: string;
}

export default function ConfirmationPage() {
    const params = useParams();
    const bookingCode = params.bookingCode as string;
    const [booking, setBooking] = useState<BookingData | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const savedBooking = localStorage.getItem("hrp-last-booking");
        if (savedBooking) {
            const data = JSON.parse(savedBooking);
            if (data.bookingCode === bookingCode) {
                setBooking(data);
            }
        }
    }, [bookingCode]);

    const handleCopy = () => {
        navigator.clipboard.writeText(bookingCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!booking) {
        return (
            <div className="section-container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
                <p className="text-white/60 mb-8">
                    We could not find the booking details. Please check your email for confirmation.
                </p>
                <Link href="/" className="btn-primary inline-flex items-center gap-2">
                    Return to Home
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="section-container py-12">
            <div className="max-w-3xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3">Booking Confirmed!</h1>
                    <p className="text-white/60 text-lg">
                        Thank you for your booking. We have sent a confirmation email to{" "}
                        <span className="text-white">{booking.customerEmail}</span>
                    </p>
                </div>

                {/* Booking Code */}
                <div className="glass-card p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/50 mb-1">Your Booking Code</p>
                            <p className="text-3xl font-bold tracking-wider gradient-text">{bookingCode}</p>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                        >
                            <Copy className="w-4 h-4" />
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <p className="text-sm text-white/40 mt-4">
                        Use this code to track your booking status or when contacting our support team.
                    </p>
                </div>

                {/* Booking Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Event Details */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold mb-4">Event Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-white/50" />
                                <span>{formatDate(booking.eventDate)}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-white/50" />
                                <span>{booking.eventLocation}</span>
                            </div>
                            <div className="pt-2 border-t border-white/10">
                                <p className="text-sm text-white/70">{booking.eventDetails}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold mb-4">Customer Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <User className="w-4 h-4 text-white/50" />
                                <span>{booking.customerName}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-white/50" />
                                <span>{booking.customerEmail}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-white/50" />
                                <span>{booking.customerPhone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="glass-card p-6 mb-8">
                    <h3 className="font-semibold mb-4">Order Summary</h3>

                    <div className="space-y-4 mb-6">
                        {booking.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-white/50">
                                        {item.quantity}x • {item.duration} day{item.duration > 1 ? "s" : ""} • {item.type}
                                    </p>
                                </div>
                                <span className="font-medium">
                                    {formatPrice(item.price * item.quantity * item.duration)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/60">Subtotal</span>
                            <span>{formatPrice(booking.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/60">Tax (11%)</span>
                            <span>{formatPrice(booking.tax)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-white/10">
                            <span className="font-semibold">Total Paid</span>
                            <span className="text-xl font-bold text-accent-gold">{formatPrice(booking.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="glass-card p-6 mb-8 bg-primary-500/5 border-primary-500/20">
                    <h3 className="font-semibold mb-4">What&apos;s Next?</h3>
                    <ul className="space-y-3 text-sm text-white/70">
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-400">1</span>
                            <span>You will receive a confirmation email with your booking details shortly.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-400">2</span>
                            <span>Our team will contact you within 24 hours to confirm the booking.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-400">3</span>
                            <span>The assigned photographer/videographer will reach out to discuss details.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-400">4</span>
                            <span>Equipment and transport will be arranged for your event date.</span>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/" className="btn-primary flex items-center gap-2">
                        Return to Home
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button className="btn-secondary flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Receipt
                    </button>
                </div>
            </div>
        </div>
    );
}
