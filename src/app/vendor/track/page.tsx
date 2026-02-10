"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Search, Package, ArrowRight, Loader2, Calendar, MapPin, CheckCircle, Clock, XCircle } from "lucide-react";

interface BookingResult {
    id: string;
    bookingCode: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventDate: string;
    status: string;
    paymentStatus: string;
    total: number;
    subtotal: number;
    tax: number;
    createdAt: string;
    location?: { name: string; city: string } | null;
    items: {
        id: string;
        itemType: string;
        itemName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        duration: number;
        durationType: string;
    }[];
}

const statusConfig: Record<string, { icon: typeof CheckCircle; label: string; color: string; bg: string }> = {
    PENDING: { icon: Clock, label: "Menunggu Konfirmasi", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    CONFIRMED: { icon: CheckCircle, label: "Dikonfirmasi", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    COMPLETED: { icon: CheckCircle, label: "Selesai", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    CANCELLED: { icon: XCircle, label: "Dibatalkan", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

export default function VendorTrackPage() {
    const { data: session } = useSession();
    const user = session?.user as { vendorId?: string } | undefined;
    const [bookingCode, setBookingCode] = useState("");
    const [booking, setBooking] = useState<BookingResult | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [recentCodes, setRecentCodes] = useState<string[]>([]);

    // Load recent tracked codes from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("vendor_track_history");
        if (saved) setRecentCodes(JSON.parse(saved));
    }, []);

    const saveToHistory = (code: string) => {
        const updated = [code, ...recentCodes.filter(c => c !== code)].slice(0, 5);
        setRecentCodes(updated);
        localStorage.setItem("vendor_track_history", JSON.stringify(updated));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await trackBooking(bookingCode.trim().toUpperCase());
    };

    const trackBooking = async (code: string) => {
        if (!code) {
            setError("Masukkan kode booking");
            return;
        }

        setError("");
        setBooking(null);
        setIsLoading(true);

        try {
            const res = await fetch(`/api/track/${code}`);
            if (!res.ok) {
                setError("Booking tidak ditemukan. Periksa kode booking Anda.");
                setIsLoading(false);
                return;
            }
            const data = await res.json();
            setBooking(data);
            setBookingCode(code);
            saveToHistory(code);
        } catch {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    const sc = statusConfig[booking?.status || ""] || statusConfig.PENDING;
    const StatusIcon = sc.icon;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Track Booking</h1>
                <p className="text-white/50 text-sm mt-1">Cek status booking dengan kode booking</p>
            </div>

            {/* Search */}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <label className="block text-sm text-white/50 mb-2">Kode Booking</label>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                value={bookingCode}
                                onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                                placeholder="HRP-240129-ABC123"
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 font-mono tracking-wider text-sm"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-500/20"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            Track
                        </button>
                    </div>
                    {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

                    {/* Recent Codes */}
                    {recentCodes.length > 0 && !booking && (
                        <div className="mt-4 pt-3 border-t border-white/5">
                            <p className="text-white/30 text-xs mb-2">Terakhir dicari:</p>
                            <div className="flex flex-wrap gap-2">
                                {recentCodes.map(code => (
                                    <button key={code} type="button" onClick={() => trackBooking(code)}
                                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white text-xs font-mono hover:bg-white/10 transition-all">
                                        {code}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </form>

            {/* Result */}
            {booking && (
                <div className="space-y-4 animate-in fade-in">
                    {/* Status Banner */}
                    <div className={`border rounded-2xl p-5 ${sc.bg}`}>
                        <div className="flex items-center gap-3">
                            <StatusIcon className={`w-6 h-6 ${sc.color}`} />
                            <div>
                                <p className={`font-semibold ${sc.color}`}>{sc.label}</p>
                                <p className="text-white/40 text-xs">{booking.bookingCode}</p>
                            </div>
                            <span className={`ml-auto px-3 py-1 rounded-lg text-xs font-medium ${booking.paymentStatus === "PAID" ? "bg-emerald-500/10 text-emerald-400" :
                                    "bg-red-500/10 text-red-400"
                                }`}>
                                💳 {booking.paymentStatus}
                            </span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-4">
                        {/* Event Details */}
                        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-5">
                            <h3 className="font-semibold text-white text-sm mb-3">Detail Event</h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                <div className="flex items-start gap-2">
                                    <Calendar className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-white/40 text-[11px]">Tanggal</p>
                                        <p className="text-white text-sm">
                                            {new Date(booking.eventDate).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                                        </p>
                                    </div>
                                </div>
                                {booking.location && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-white/40 text-[11px]">Lokasi</p>
                                            <p className="text-white text-sm">{booking.location.name}, {booking.location.city}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Items */}
                            <div className="mt-4 pt-3 border-t border-white/5">
                                <p className="text-white/40 text-[11px] mb-2">Items</p>
                                <div className="space-y-2">
                                    {booking.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between py-1.5">
                                            <div>
                                                <p className="text-white text-sm">{item.itemName}</p>
                                                <p className="text-white/30 text-xs">{item.quantity}x • {item.duration} {item.durationType}</p>
                                            </div>
                                            <p className="text-white/70 text-sm">Rp {item.totalPrice.toLocaleString("id-ID")}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                            <h3 className="font-semibold text-white text-sm mb-3">Ringkasan</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-white/50">Subtotal</span>
                                    <span className="text-white">Rp {booking.subtotal.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/50">Tax</span>
                                    <span className="text-white">Rp {booking.tax.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="border-t border-white/5 pt-2 flex justify-between">
                                    <span className="text-white font-semibold">Total</span>
                                    <span className="text-white font-bold">Rp {booking.total.toLocaleString("id-ID")}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-white/30">
                                <p>Dibuat: {new Date(booking.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
