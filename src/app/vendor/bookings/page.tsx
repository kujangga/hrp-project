"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Calendar, ArrowRight } from "lucide-react";

interface Booking {
    id: string;
    bookingCode: string;
    customerName: string;
    eventDate: string;
    total: number;
    status: string;
    createdAt: string;
}

export default function VendorBookingsPage() {
    const { data: session } = useSession();
    const user = session?.user as { vendorId?: string } | undefined;
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (user?.vendorId) {
            fetch("/api/vendor/bookings")
                .then(res => res.ok ? res.json() : [])
                .then(data => {
                    setBookings(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user?.vendorId]);

    const statuses = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

    const filtered = bookings.filter(b => {
        const matchStatus = filter === "ALL" || b.status === filter;
        const matchSearch = !search || b.bookingCode.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const statusColor = (s: string) => {
        switch (s) {
            case "CONFIRMED": return "bg-emerald-500/10 text-emerald-400";
            case "PENDING": return "bg-amber-500/10 text-amber-400";
            case "COMPLETED": return "bg-blue-500/10 text-blue-400";
            case "CANCELLED": return "bg-red-500/10 text-red-400";
            default: return "bg-white/10 text-white/60";
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Bookings</h1>
                    <p className="text-white/50 text-sm mt-1">Daftar semua booking Anda</p>
                </div>
                <Link href="/photographers" className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/20">
                    + Booking Baru
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Cari booking code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {statuses.map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === s
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-white/5 text-white/50 border border-white/5 hover:text-white"
                                }`}
                        >
                            {s === "ALL" ? "Semua" : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-white/30">Memuat data...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-3" />
                        <p className="text-white/40">Tidak ada booking ditemukan</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {filtered.map((booking) => (
                            <Link key={booking.id} href={`/vendor/bookings/${booking.id}`}
                                className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-white/30" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-white text-sm font-semibold">{booking.bookingCode}</p>
                                        <span className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${statusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p className="text-white/40 text-xs">
                                        {new Date(booking.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-white font-semibold text-sm">Rp {booking.total.toLocaleString("id-ID")}</p>
                                    <p className="text-white/30 text-xs">{new Date(booking.createdAt).toLocaleDateString("id-ID")}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
