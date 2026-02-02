"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Search,
    ShoppingCart,
    Calendar,
    User,
    MapPin,
    Eye,
    Check,
    X,
    RefreshCw
} from 'lucide-react';

interface BookingItem {
    id: string;
    itemType: string;
    itemName: string;
    quantity: number;
    totalPrice: number;
}

interface Booking {
    id: string;
    bookingCode: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventDate: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
    total: number;
    items: BookingItem[];
    location?: { id: string; name: string };
    createdAt: string;
}

const statusColors: Record<string, string> = {
    'PENDING': 'bg-amber-500/20 text-amber-400',
    'CONFIRMED': 'bg-emerald-500/20 text-emerald-400',
    'COMPLETED': 'bg-blue-500/20 text-blue-400',
    'CANCELLED': 'bg-red-500/20 text-red-400',
};

const paymentColors: Record<string, string> = {
    'UNPAID': 'bg-red-500/20 text-red-400',
    'PAID': 'bg-emerald-500/20 text-emerald-400',
    'REFUNDED': 'bg-purple-500/20 text-purple-400',
};

export default function BookingsAdminPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [actionModal, setActionModal] = useState<{
        show: boolean;
        booking: Booking | null;
        action: 'confirm' | 'reject';
    }>({ show: false, booking: null, action: 'confirm' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/admin/bookings');
            const data = await res.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async () => {
        if (!actionModal.booking) return;

        setIsSubmitting(true);
        try {
            const newStatus = actionModal.action === 'confirm' ? 'CONFIRMED' : 'CANCELLED';
            const res = await fetch(`/api/admin/bookings/${actionModal.booking.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Refresh bookings list
                await fetchBookings();
                setActionModal({ show: false, booking: null, action: 'confirm' });
            } else {
                console.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating booking:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter and search
    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === 'All' || booking.status === filter.toUpperCase();
        const matchesSearch = search === '' ||
            booking.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
            booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
            booking.customerEmail.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'PENDING').length,
        confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
        revenue: bookings.reduce((sum, b) => sum + b.total, 0)
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Bookings</h1>
                    <p className="text-gray-400 mt-1">Manage all booking orders</p>
                </div>
                <button
                    onClick={fetchBookings}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by booking code or customer..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${filter === status
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 p-4">
                    <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
                    <p className="text-amber-400/60 text-sm">Pending Review</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-emerald-400">{stats.confirmed}</p>
                    <p className="text-gray-500 text-sm">Confirmed</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-purple-400">
                        Rp {stats.revenue.toLocaleString('id-ID')}
                    </p>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden">
                {isLoading ? (
                    <div className="px-6 py-16 text-center">
                        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Loading bookings...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <ShoppingCart className="mx-auto text-gray-600 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {search || filter !== 'All' ? 'No Matching Bookings' : 'No Bookings Yet'}
                        </h3>
                        <p className="text-gray-400">
                            {search || filter !== 'All'
                                ? 'Try adjusting your filters or search query.'
                                : 'Bookings will appear here when customers place orders.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Booking</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Customer</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Event Date</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Items</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Total</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-mono font-medium">{booking.bookingCode}</p>
                                                <p className="text-gray-500 text-xs">
                                                    {new Date(booking.createdAt).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2">
                                                <User size={16} className="text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-white">{booking.customerName}</p>
                                                    <p className="text-gray-500 text-xs">{booking.customerEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Calendar size={14} className="text-gray-500" />
                                                {new Date(booking.eventDate).toLocaleDateString('id-ID', {
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                            {booking.location && (
                                                <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                                                    <MapPin size={12} />
                                                    {booking.location.name}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white">{booking.items.length} item(s)</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white font-medium">Rp {booking.total.toLocaleString('id-ID')}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${paymentColors[booking.paymentStatus]}`}>
                                                {booking.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/bookings/${booking.id}`}
                                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                {booking.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => setActionModal({
                                                                show: true,
                                                                booking,
                                                                action: 'confirm'
                                                            })}
                                                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                                            title="Confirm"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => setActionModal({
                                                                show: true,
                                                                booking,
                                                                action: 'reject'
                                                            })}
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {actionModal.show && actionModal.booking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => !isSubmitting && setActionModal({ show: false, booking: null, action: 'confirm' })}
                    />

                    {/* Modal */}
                    <div className="relative bg-dark-800 rounded-2xl border border-white/10 p-6 w-full max-w-md mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${actionModal.action === 'confirm'
                                    ? 'bg-emerald-500/20'
                                    : 'bg-red-500/20'
                                }`}>
                                {actionModal.action === 'confirm' ? (
                                    <Check className="w-8 h-8 text-emerald-400" />
                                ) : (
                                    <X className="w-8 h-8 text-red-400" />
                                )}
                            </div>

                            <h3 className="text-xl font-bold mb-2">
                                {actionModal.action === 'confirm' ? 'Confirm Booking?' : 'Reject Booking?'}
                            </h3>
                            <p className="text-gray-400 mb-2">
                                Booking: <span className="font-mono text-white">{actionModal.booking.bookingCode}</span>
                            </p>
                            <p className="text-gray-500 text-sm mb-6">
                                {actionModal.action === 'confirm'
                                    ? 'This will confirm the booking and notify the customer.'
                                    : 'This will cancel the booking. This action cannot be undone.'}
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setActionModal({ show: false, booking: null, action: 'confirm' })}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={isSubmitting}
                                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${actionModal.action === 'confirm'
                                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                            : 'bg-red-500 hover:bg-red-600 text-white'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        actionModal.action === 'confirm' ? 'Confirm' : 'Reject'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
