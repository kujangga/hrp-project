"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Clock, CheckCircle, DollarSign, ArrowRight, Plus } from "lucide-react";

interface BookingSummary {
    total: number;
    pending: number;
    confirmed: number;
    totalSpent: number;
    recent: {
        id: string;
        bookingCode: string;
        customerName: string;
        eventDate: string;
        total: number;
        status: string;
        createdAt: string;
    }[];
}

export default function VendorDashboard() {
    const { data: session } = useSession();
    const user = session?.user as { name?: string; vendorId?: string } | undefined;
    const [summary, setSummary] = useState<BookingSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.vendorId) {
            fetch("/api/vendor/bookings/summary")
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    setSummary(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user?.vendorId]);

    const stats = [
        { label: "Total Bookings", value: summary?.total || 0, icon: ShoppingBag, color: "from-purple-500 to-indigo-500" },
        { label: "Pending", value: summary?.pending || 0, icon: Clock, color: "from-amber-500 to-orange-500" },
        { label: "Confirmed", value: summary?.confirmed || 0, icon: CheckCircle, color: "from-emerald-500 to-green-500" },
        { label: "Total Spent", value: `Rp ${((summary?.totalSpent || 0) / 1_000_000).toFixed(1)}M`, icon: DollarSign, color: "from-cyan-500 to-blue-500" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">
                    Selamat datang, {user?.name?.split(" ")[0] || "Vendor"} 👋
                </h1>
                <p className="text-white/50 mt-1">Kelola semua booking dan profil Anda di sini.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white/5 border border-white/5 rounded-2xl p-5">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-white">{loading ? "—" : stat.value}</p>
                            <p className="text-white/40 text-sm mt-1">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Link href="/photographers" className="group bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-semibold mb-1">Buat Booking Baru</h3>
                            <p className="text-white/40 text-sm">Browse dan pilih fotografer, videografer, dan lainnya</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                            <Plus className="w-5 h-5 text-purple-400" />
                        </div>
                    </div>
                </Link>
                <Link href="/vendor/bookings" className="group bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-semibold mb-1">Lihat Semua Bookings</h3>
                            <p className="text-white/40 text-sm">Track status dan riwayat booking Anda</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <ArrowRight className="w-5 h-5 text-white/50" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <h2 className="font-semibold text-white">Booking Terbaru</h2>
                    <Link href="/vendor/bookings" className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                        Lihat Semua <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-white/30">Memuat data...</div>
                ) : !summary?.recent?.length ? (
                    <div className="p-8 text-center">
                        <ShoppingBag className="w-10 h-10 text-white/10 mx-auto mb-3" />
                        <p className="text-white/40 text-sm">Belum ada booking</p>
                        <Link href="/photographers" className="text-purple-400 text-sm hover:text-purple-300 mt-2 inline-block">
                            Mulai booking pertama →
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {summary.recent.map((booking) => (
                            <Link key={booking.id} href={`/vendor/bookings/${booking.id}`} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium">{booking.bookingCode}</p>
                                    <p className="text-white/40 text-xs">{new Date(booking.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${booking.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400" :
                                        booking.status === "PENDING" ? "bg-amber-500/10 text-amber-400" :
                                            booking.status === "COMPLETED" ? "bg-blue-500/10 text-blue-400" :
                                                "bg-red-500/10 text-red-400"
                                    }`}>
                                    {booking.status}
                                </span>
                                <p className="text-white text-sm font-medium">Rp {(booking.total / 1_000_000).toFixed(1)}M</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
