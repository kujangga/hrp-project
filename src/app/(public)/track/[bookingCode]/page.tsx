"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    CheckCircle,
    Clock,
    XCircle,
    Calendar,
    MapPin,
    Mail,
    Phone,
    User,
    Package,
    ArrowLeft,
    Camera,
    Video,
    Truck,
    Settings,
    Copy,
    RefreshCw
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

interface BookingData {
    bookingCode: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventDate: string;
    eventDetails: string;
    specialRequests: string;
    location: { id: string; name: string } | null;
    subtotal: number;
    tax: number;
    total: number;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
    items: Array<{
        itemType: string;
        itemName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        duration: number;
        durationType: string;
        photographer?: { id: string; name: string; profileImage?: string; grade: string };
        videographer?: { id: string; name: string; profileImage?: string; grade: string };
        equipment?: { id: string; name: string; image?: string; category: string };
        transport?: { id: string; name: string; image?: string; vehicleType: string };
    }>;
    createdAt: string;
    updatedAt: string;
}

const statusConfig = {
    PENDING: {
        label: "Pending Review",
        color: "text-amber-400",
        bgColor: "bg-amber-500/20",
        borderColor: "border-amber-500/30",
        icon: Clock,
        description: "Your booking is being reviewed by our team"
    },
    CONFIRMED: {
        label: "Confirmed",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/20",
        borderColor: "border-emerald-500/30",
        icon: CheckCircle,
        description: "Your booking has been confirmed"
    },
    COMPLETED: {
        label: "Completed",
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        borderColor: "border-blue-500/30",
        icon: CheckCircle,
        description: "Your event has been completed"
    },
    CANCELLED: {
        label: "Cancelled",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/30",
        icon: XCircle,
        description: "This booking has been cancelled"
    }
};

const paymentConfig = {
    UNPAID: { label: "Unpaid", color: "text-red-400", bgColor: "bg-red-500/20" },
    PAID: { label: "Paid", color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
    REFUNDED: { label: "Refunded", color: "text-purple-400", bgColor: "bg-purple-500/20" }
};

export default function TrackingDetailPage() {
    const params = useParams();
    const bookingCode = params.bookingCode as string;
    const [booking, setBooking] = useState<BookingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const fetchBooking = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/track/${bookingCode}`);
            if (!res.ok) {
                setError("Booking not found");
                return;
            }
            const data = await res.json();
            setBooking(data);
            setError("");
        } catch {
            setError("Failed to fetch booking details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingCode]);

    const handleCopy = () => {
        navigator.clipboard.writeText(bookingCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getItemIcon = (type: string) => {
        switch (type) {
            case "photographer": return Camera;
            case "videographer": return Video;
            case "equipment": return Settings;
            case "transport": return Truck;
            default: return Package;
        }
    };

    if (isLoading) {
        return (
            <div className="section-container py-20 text-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60">Loading booking details...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="section-container py-20 text-center">
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Booking Not Found</h1>
                <p className="text-white/60 mb-8">
                    We couldn&apos;t find a booking with code: <span className="font-mono text-white">{bookingCode}</span>
                </p>
                <Link href="/track" className="btn-primary inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Try Again
                </Link>
            </div>
        );
    }

    const status = statusConfig[booking.status];
    const StatusIcon = status.icon;
    const payment = paymentConfig[booking.paymentStatus];

    // Status timeline steps
    const steps = [
        { id: "PENDING", label: "Pending", completed: true },
        { id: "CONFIRMED", label: "Confirmed", completed: booking.status !== "PENDING" && booking.status !== "CANCELLED" },
        { id: "COMPLETED", label: "Completed", completed: booking.status === "COMPLETED" }
    ];

    return (
        <div className="section-container py-12">
            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/track"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Track Another Booking
                </Link>

                {/* Header with Status */}
                <div className={`glass-card p-6 mb-8 ${status.borderColor} border-2`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl ${status.bgColor} flex items-center justify-center`}>
                                <StatusIcon className={`w-7 h-7 ${status.color}`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold font-mono tracking-wider">{booking.bookingCode}</h1>
                                    <button
                                        onClick={handleCopy}
                                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                        title="Copy code"
                                    >
                                        <Copy className={`w-4 h-4 ${copied ? "text-green-400" : "text-white/40"}`} />
                                    </button>
                                </div>
                                <p className={`text-sm ${status.color}`}>{status.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                                {status.label}
                            </span>
                            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${payment.bgColor} ${payment.color}`}>
                                {payment.label}
                            </span>
                            <button
                                onClick={fetchBooking}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                title="Refresh status"
                            >
                                <RefreshCw className="w-4 h-4 text-white/60" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Timeline */}
                {booking.status !== "CANCELLED" && (
                    <div className="glass-card p-6 mb-8">
                        <h3 className="font-semibold mb-6">Booking Progress</h3>
                        <div className="flex items-center justify-between relative">
                            {/* Progress Line */}
                            <div className="absolute top-5 left-0 right-0 h-1 bg-white/10 rounded-full" />
                            <div
                                className="absolute top-5 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                style={{ width: booking.status === "COMPLETED" ? "100%" : booking.status === "CONFIRMED" ? "50%" : "0%" }}
                            />

                            {steps.map((step, index) => (
                                <div key={step.id} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step.completed
                                            ? "bg-gradient-to-r from-purple-500 to-pink-500 border-transparent"
                                            : "bg-dark-800 border-white/20"
                                        }`}>
                                        {step.completed ? (
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        ) : (
                                            <span className="text-sm text-white/40">{index + 1}</span>
                                        )}
                                    </div>
                                    <span className={`mt-2 text-sm ${step.completed ? "text-white" : "text-white/40"}`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Event Details */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold mb-4">Event Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-white/50" />
                                <div>
                                    <p className="text-sm text-white/50">Event Date</p>
                                    <p className="font-medium">{formatDate(booking.eventDate)}</p>
                                </div>
                            </div>
                            {booking.location && (
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-white/50" />
                                    <div>
                                        <p className="text-sm text-white/50">Location</p>
                                        <p className="font-medium">{booking.location.name}</p>
                                    </div>
                                </div>
                            )}
                            {booking.eventDetails && (
                                <div className="pt-3 border-t border-white/10">
                                    <p className="text-sm text-white/50 mb-1">Event Details</p>
                                    <p className="text-white/80">{booking.eventDetails}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold mb-4">Your Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-white/50" />
                                <div>
                                    <p className="text-sm text-white/50">Name</p>
                                    <p className="font-medium">{booking.customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-white/50" />
                                <div>
                                    <p className="text-sm text-white/50">Email</p>
                                    <p className="font-medium">{booking.customerEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-white/50" />
                                <div>
                                    <p className="text-sm text-white/50">Phone</p>
                                    <p className="font-medium">{booking.customerPhone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="glass-card p-6 mb-8">
                    <h3 className="font-semibold mb-4">Order Items</h3>
                    <div className="space-y-4">
                        {booking.items.map((item, idx) => {
                            const ItemIcon = getItemIcon(item.itemType);
                            const talent = item.photographer || item.videographer;

                            return (
                                <div key={idx} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-b-0">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <ItemIcon className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{item.itemName}</p>
                                        <p className="text-sm text-white/50">
                                            {item.quantity}x • {item.duration} {item.durationType}{item.duration > 1 ? "s" : ""}
                                            {talent && ` • Grade ${talent.grade}`}
                                        </p>
                                    </div>
                                    <p className="font-medium text-right">{formatPrice(item.totalPrice)}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Total */}
                    <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/60">Subtotal</span>
                            <span>{formatPrice(booking.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/60">Tax (11%)</span>
                            <span>{formatPrice(booking.tax)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-white/10">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold text-accent-gold">{formatPrice(booking.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="glass-card p-6 bg-purple-500/5 border-purple-500/20">
                    <h3 className="font-semibold mb-2">Need Help?</h3>
                    <p className="text-sm text-white/60 mb-4">
                        If you have any questions about your booking, please contact our support team.
                    </p>
                    <a
                        href="mailto:support@hrp.com"
                        className="btn-secondary inline-flex items-center gap-2"
                    >
                        <Mail className="w-4 h-4" />
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
