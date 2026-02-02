"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    User,
    Mail,
    Phone,
    Package,
    Camera,
    Video,
    Truck,
    Settings,
    Check,
    X,
    Clock,
    RefreshCw
} from 'lucide-react';

interface BookingItem {
    id: string;
    itemType: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    duration: number;
    durationType: string;
    photographer?: { id: string; name: string; grade: string; profileImage?: string };
    videographer?: { id: string; name: string; grade: string; profileImage?: string };
    equipment?: { id: string; name: string; category: string; image?: string };
    transport?: { id: string; name: string; vehicleType: string; image?: string };
}

interface Booking {
    id: string;
    bookingCode: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventDate: string;
    eventDetails?: string;
    specialRequests?: string;
    location?: { id: string; name: string };
    subtotal: number;
    tax: number;
    total: number;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
    items: BookingItem[];
    createdAt: string;
    updatedAt: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
    PENDING: { label: 'Pending', color: 'text-amber-400', bgColor: 'bg-amber-500/20', icon: Clock },
    CONFIRMED: { label: 'Confirmed', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', icon: Check },
    COMPLETED: { label: 'Completed', color: 'text-blue-400', bgColor: 'bg-blue-500/20', icon: Check },
    CANCELLED: { label: 'Cancelled', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: X },
};

const paymentConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    UNPAID: { label: 'Unpaid', color: 'text-red-400', bgColor: 'bg-red-500/20' },
    PAID: { label: 'Paid', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
    REFUNDED: { label: 'Refunded', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
};

export default function BookingDetailPage() {
    const params = useParams();
    const bookingId = params.id as string;

    const [booking, setBooking] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');

    const fetchBooking = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/admin/bookings/${bookingId}`);
            if (!res.ok) {
                setError('Booking not found');
                return;
            }
            const data = await res.json();
            setBooking(data);
        } catch (err) {
            console.error('Error fetching booking:', err);
            setError('Failed to load booking');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingId]);

    const updateStatus = async (newStatus: string) => {
        if (!booking) return;
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admin/bookings/${bookingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, paymentStatus: booking.paymentStatus })
            });
            if (res.ok) {
                await fetchBooking();
            }
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    const updatePaymentStatus = async (newPaymentStatus: string) => {
        if (!booking) return;
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admin/bookings/${bookingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: booking.status, paymentStatus: newPaymentStatus })
            });
            if (res.ok) {
                await fetchBooking();
            }
        } catch (err) {
            console.error('Error updating payment status:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    const getItemIcon = (type: string) => {
        switch (type) {
            case 'photographer': return Camera;
            case 'videographer': return Video;
            case 'equipment': return Settings;
            case 'transport': return Truck;
            default: return Package;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading booking...</p>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="text-center py-20">
                <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <Link href="/admin/bookings" className="btn-primary inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Bookings
                </Link>
            </div>
        );
    }

    const status = statusConfig[booking.status];
    const StatusIcon = status.icon;
    const payment = paymentConfig[booking.paymentStatus];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/bookings"
                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white font-mono">{booking.bookingCode}</h1>
                        <p className="text-gray-400 text-sm">
                            Created {new Date(booking.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchBooking}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Status Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
                {/* Booking Status */}
                <div className="rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-300">Booking Status</h3>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor}`}>
                            <StatusIcon className={`w-4 h-4 ${status.color}`} />
                            <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => (
                            <button
                                key={s}
                                onClick={() => updateStatus(s)}
                                disabled={isUpdating || booking.status === s}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${booking.status === s
                                    ? `${statusConfig[s].bgColor} ${statusConfig[s].color} border border-current`
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}
                            >
                                {statusConfig[s].label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payment Status */}
                <div className="rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-300">Payment Status</h3>
                        <div className={`px-3 py-1 rounded-full ${payment.bgColor}`}>
                            <span className={`text-sm font-medium ${payment.color}`}>{payment.label}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['UNPAID', 'PAID', 'REFUNDED'].map((p) => (
                            <button
                                key={p}
                                onClick={() => updatePaymentStatus(p)}
                                disabled={isUpdating || booking.paymentStatus === p}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${booking.paymentStatus === p
                                    ? `${paymentConfig[p].bgColor} ${paymentConfig[p].color} border border-current`
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}
                            >
                                {paymentConfig[p].label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-5">
                    <h3 className="font-semibold text-white mb-4">Customer Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="text-white font-medium">{booking.customerName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <a href={`mailto:${booking.customerEmail}`} className="text-purple-400 hover:text-purple-300">
                                    {booking.customerEmail}
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <a href={`tel:${booking.customerPhone}`} className="text-purple-400 hover:text-purple-300">
                                    {booking.customerPhone}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Details */}
                <div className="rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-5">
                    <h3 className="font-semibold text-white mb-4">Event Details</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Event Date</p>
                                <p className="text-white font-medium">
                                    {new Date(booking.eventDate).toLocaleDateString('id-ID', {
                                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        {booking.location && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="text-white font-medium">{booking.location.name}</p>
                                </div>
                            </div>
                        )}
                        {booking.eventDetails && (
                            <div className="pt-3 border-t border-white/10">
                                <p className="text-sm text-gray-500 mb-1">Event Description</p>
                                <p className="text-white/80">{booking.eventDetails}</p>
                            </div>
                        )}
                        {booking.specialRequests && (
                            <div className="pt-3 border-t border-white/10">
                                <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                                <p className="text-white/80">{booking.specialRequests}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-5">
                <h3 className="font-semibold text-white mb-4">Order Items</h3>
                <div className="space-y-3">
                    {booking.items.map((item) => {
                        const ItemIcon = getItemIcon(item.itemType);
                        const talent = item.photographer || item.videographer;

                        return (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                    <ItemIcon className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white">{item.itemName}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1)}
                                        {talent && ` • Grade ${talent.grade}`}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        {item.quantity}x • {item.duration} {item.durationType}
                                    </p>
                                    <p className="font-medium text-white">
                                        Rp {item.totalPrice.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Totals */}
                <div className="border-t border-white/10 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-white">Rp {booking.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tax (11%)</span>
                        <span className="text-white">Rp {booking.tax.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10">
                        <span className="font-semibold text-white">Total</span>
                        <span className="text-xl font-bold text-purple-400">
                            Rp {booking.total.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            {booking.status === 'PENDING' && (
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => updateStatus('CONFIRMED')}
                        disabled={isUpdating}
                        className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600"
                    >
                        <Check className="w-5 h-5" />
                        Confirm Booking
                    </button>
                    <button
                        onClick={() => updateStatus('CANCELLED')}
                        disabled={isUpdating}
                        className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                        <X className="w-5 h-5" />
                        Reject Booking
                    </button>
                </div>
            )}
        </div>
    );
}
