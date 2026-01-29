import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
    Search,
    ShoppingCart,
    Calendar,
    User,
    MapPin,
    Eye,
    Check,
    X
} from 'lucide-react';

async function getBookings() {
    return prisma.booking.findMany({
        include: {
            items: true,
            location: true
        },
        orderBy: { createdAt: 'desc' }
    });
}

export default async function BookingsAdminPage() {
    const bookings = await getBookings();

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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Bookings</h1>
                    <p className="text-gray-400 mt-1">Manage all booking orders</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by booking code or customer..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                        <button
                            key={status}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${status === 'All'
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
                    <p className="text-2xl font-bold text-white">{bookings.length}</p>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 p-4">
                    <p className="text-2xl font-bold text-amber-400">{bookings.filter(b => b.status === 'PENDING').length}</p>
                    <p className="text-amber-400/60 text-sm">Pending Review</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-emerald-400">{bookings.filter(b => b.status === 'CONFIRMED').length}</p>
                    <p className="text-gray-500 text-sm">Confirmed</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-purple-400">
                        Rp {bookings.reduce((sum, b) => sum + b.total, 0).toLocaleString('id-ID')}
                    </p>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden">
                {bookings.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <ShoppingCart className="mx-auto text-gray-600 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
                        <p className="text-gray-400">Bookings will appear here when customers place orders.</p>
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
                                {bookings.map((booking) => (
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
                                                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                                            title="Confirm"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
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
        </div>
    );
}
