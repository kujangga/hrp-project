import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
    Camera,
    Video,
    Package,
    Truck,
    ShoppingCart,
    TrendingUp,
    Users,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

async function getStats() {
    const [
        photographerCount,
        videographerCount,
        equipmentCount,
        transportCount,
        bookingCount,
        pendingBookings,
        recentBookings
    ] = await Promise.all([
        prisma.photographer.count(),
        prisma.videographer.count(),
        prisma.equipment.count(),
        prisma.transport.count(),
        prisma.booking.count(),
        prisma.booking.count({ where: { status: 'PENDING' } }),
        prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                items: true
            }
        })
    ]);

    return {
        photographerCount,
        videographerCount,
        equipmentCount,
        transportCount,
        bookingCount,
        pendingBookings,
        recentBookings
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const statCards = [
        {
            label: 'Photographers',
            value: stats.photographerCount,
            icon: Camera,
            href: '/admin/photographers',
            color: 'from-purple-500 to-indigo-600',
            trend: '+12%',
            trendUp: true
        },
        {
            label: 'Videographers',
            value: stats.videographerCount,
            icon: Video,
            href: '/admin/videographers',
            color: 'from-pink-500 to-rose-600',
            trend: '+8%',
            trendUp: true
        },
        {
            label: 'Equipment',
            value: stats.equipmentCount,
            icon: Package,
            href: '/admin/equipment',
            color: 'from-cyan-500 to-blue-600',
            trend: '+5%',
            trendUp: true
        },
        {
            label: 'Transport',
            value: stats.transportCount,
            icon: Truck,
            href: '/admin/transport',
            color: 'from-amber-500 to-orange-600',
            trend: '-2%',
            trendUp: false
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome back! Here&apos;s your platform overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {statCards.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
                    >
                        {/* Background Gradient */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />

                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                    <stat.icon size={24} className="text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    {stat.trend}
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-gray-400">{stat.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Bookings */}
                <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="text-purple-400" size={20} />
                            <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
                        </div>
                        <Link href="/admin/bookings" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                            View All →
                        </Link>
                    </div>

                    <div className="divide-y divide-white/5">
                        {stats.recentBookings.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <ShoppingCart className="mx-auto text-gray-600 mb-3" size={40} />
                                <p className="text-gray-400">No bookings yet</p>
                            </div>
                        ) : (
                            stats.recentBookings.map((booking) => (
                                <div key={booking.id} className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-medium">{booking.bookingCode}</p>
                                            <p className="text-gray-500 text-sm">{booking.customerName} • {booking.items.length} items</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`
                                                px-3 py-1 rounded-full text-xs font-medium
                                                ${booking.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' : ''}
                                                ${booking.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                                                ${booking.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-400' : ''}
                                                ${booking.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' : ''}
                                            `}>
                                                {booking.status}
                                            </span>
                                            <p className="text-gray-500 text-xs mt-1">
                                                Rp {booking.total.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                    {/* Pending Bookings Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                                <Calendar size={28} className="text-white" />
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-white">{stats.pendingBookings}</p>
                                <p className="text-amber-400/80">Pending Bookings</p>
                            </div>
                        </div>
                        <Link
                            href="/admin/bookings?status=pending"
                            className="mt-4 block w-full py-3 rounded-xl bg-amber-500/20 text-amber-400 text-center font-medium hover:bg-amber-500/30 transition-colors"
                        >
                            Review Now
                        </Link>
                    </div>

                    {/* Total Revenue Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20 p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <TrendingUp size={28} className="text-white" />
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-white">{stats.bookingCount}</p>
                                <p className="text-emerald-400/80">Total Bookings</p>
                            </div>
                        </div>
                    </div>

                    {/* Active Talents */}
                    <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/20 p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <Users size={28} className="text-white" />
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-white">{stats.photographerCount + stats.videographerCount}</p>
                                <p className="text-purple-400/80">Active Talents</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
