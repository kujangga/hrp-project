'use client';

import { useEffect, useState } from 'react';
import {
    Camera,
    Calendar,
    Eye,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
    name: string;
    grade: string;
    profileImage: string | null;
    portfolioItems: number;
    totalBookings: number;
    upcomingBookings: number;
    nextBooking: {
        date: string;
        client: string;
        location: string;
        status: string;
    } | null;
}

export default function PhotographerDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/talent/stats')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                <p>Failed to load dashboard data. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">
                        Welcome back, <span className="text-pink-400">{stats.name}</span>
                    </h1>
                    <p className="text-gray-400 mt-1">Here&apos;s what&apos;s happening with your profile</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/portfolio"
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg shadow-pink-500/25"
                    >
                        Manage Portfolio
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                            <Camera size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">{stats.portfolioItems}</p>
                            <p className="text-gray-400 text-sm">Portfolio Items</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm">
                        <span className="text-emerald-400">{stats.portfolioItems} uploaded</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-amber-400">{5 - stats.portfolioItems} slots left</span>
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <Calendar size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">{stats.upcomingBookings}</p>
                            <p className="text-gray-400 text-sm">Upcoming Bookings</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link href="/dashboard/availability" className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
                            View calendar →
                        </Link>
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <Eye size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">—</p>
                            <p className="text-gray-400 text-sm">Profile Views</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-gray-500 text-sm">
                        <TrendingUp size={14} />
                        <span>Coming soon</span>
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                            <CheckCircle size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                            <p className="text-gray-400 text-sm">Total Bookings</p>
                        </div>
                    </div>
                    <div className="mt-4 text-gray-500 text-sm">
                        All time
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Next Booking */}
                <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/20 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock className="text-purple-400" size={20} />
                        Next Booking
                    </h2>

                    {stats.nextBooking ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">{stats.nextBooking.client}</p>
                                    <p className="text-gray-400 text-sm">{stats.nextBooking.location}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-purple-400 font-medium">
                                        {new Date(stats.nextBooking.date).toLocaleDateString('id-ID', {
                                            weekday: 'short',
                                            day: 'numeric',
                                            month: 'short'
                                        })}
                                    </p>
                                    <p className="text-gray-500 text-sm">{stats.nextBooking.status}</p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/availability"
                                className="block w-full py-3 rounded-xl bg-purple-500/20 text-purple-400 text-center font-medium hover:bg-purple-500/30 transition-colors"
                            >
                                View All Bookings
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <Calendar className="mx-auto text-gray-600 mb-3" size={40} />
                            <p className="text-gray-400">No upcoming bookings</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>

                    <div className="space-y-3">
                        <Link
                            href="/dashboard/portfolio"
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:bg-pink-500/30 transition-colors">
                                <Camera size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">Upload New Work</p>
                                <p className="text-gray-500 text-sm">Add photos to your portfolio</p>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/availability"
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                                <Calendar size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">Update Availability</p>
                                <p className="text-gray-500 text-sm">Block or open dates</p>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/30 transition-colors">
                                <Eye size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">Edit Profile</p>
                                <p className="text-gray-500 text-sm">Update your public information</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tips Card */}
            <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="text-amber-400" size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-1">Tip: Complete your portfolio</h3>
                        <p className="text-gray-400 text-sm">
                            Photographers with 5 portfolio items get 3x more bookings.
                            You have {stats.portfolioItems} items - {stats.portfolioItems >= 5 ? "great job!" : `add ${5 - stats.portfolioItems} more to maximize visibility!`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
