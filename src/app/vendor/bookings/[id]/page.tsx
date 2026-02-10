"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Clock, ShoppingBag, Loader2, Camera, Video, Package, Truck } from "lucide-react";

interface BookingItem {
    id: string;
    itemType: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    duration: number;
    durationType: string;
    photographer?: { name: string } | null;
    videographer?: { name: string } | null;
    equipment?: { name: string } | null;
    transport?: { name: string; vehicleType: string } | null;
}

interface BookingDetail {
    id: string;
    bookingCode: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventDate: string;
    eventDetails: string | null;
    specialRequests: string | null;
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    location: { name: string; city: string } | null;
    items: BookingItem[];
}

const typeIcon = (type: string) => {
    switch (type) {
        case "photographer": return Camera;
        case "videographer": return Video;
        case "equipment": return Package;
        case "transport": return Truck;
        default: return ShoppingBag;
    }
};

const statusColor = (s: string) => {
    switch (s) {
        case "CONFIRMED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "PENDING": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        case "COMPLETED": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        case "CANCELLED": return "bg-red-500/10 text-red-400 border-red-500/20";
        default: return "bg-white/10 text-white/60 border-white/10";
    }
};

const paymentColor = (s: string) => {
    switch (s) {
        case "PAID": return "bg-emerald-500/10 text-emerald-400";
        case "UNPAID": return "bg-red-500/10 text-red-400";
        case "REFUNDED": return "bg-amber-500/10 text-amber-400";
        default: return "bg-white/10 text-white/60";
    }
};

export default function VendorBookingDetailPage() {
    const params = useParams();
    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (params.id) {
            fetch(`/api/vendor/bookings/${params.id}`)
                .then(res => {
                    if (!res.ok) throw new Error("Not found");
                    return res.json();
                })
                .then(data => {
                    setBooking(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Booking tidak ditemukan");
                    setLoading(false);
                });
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="text-center py-20">
                <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40 mb-4">{error || "Booking tidak ditemukan"}</p>
                <Link href="/vendor/bookings" className="text-purple-400 hover:text-purple-300 text-sm">
                    ← Kembali ke daftar booking
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <Link href="/vendor/bookings" className="text-white/40 hover:text-white text-sm flex items-center gap-1 mb-2 transition-colors">
                        <ArrowLeft className="w-3 h-3" /> Kembali
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-white">{booking.bookingCode}</h1>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusColor(booking.status)}`}>
                            {booking.status}
                        </span>
                    </div>
                    <p className="text-white/40 text-sm mt-1">
                        Dibuat {new Date(booking.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${paymentColor(booking.paymentStatus)}`}>
                    💳 {booking.paymentStatus}
                </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Event Details */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <h2 className="font-semibold text-white mb-4">Detail Event</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-white/30 mt-0.5" />
                                <div>
                                    <p className="text-white/40 text-xs">Tanggal Event</p>
                                    <p className="text-white text-sm font-medium">
                                        {new Date(booking.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                    </p>
                                </div>
                            </div>
                            {booking.location && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-white/30 mt-0.5" />
                                    <div>
                                        <p className="text-white/40 text-xs">Lokasi</p>
                                        <p className="text-white text-sm font-medium">{booking.location.name}, {booking.location.city}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {booking.eventDetails && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <p className="text-white/40 text-xs mb-1">Deskripsi Event</p>
                                <p className="text-white/70 text-sm">{booking.eventDetails}</p>
                            </div>
                        )}
                        {booking.specialRequests && (
                            <div className="mt-3">
                                <p className="text-white/40 text-xs mb-1">Permintaan Khusus</p>
                                <p className="text-white/70 text-sm italic">{booking.specialRequests}</p>
                            </div>
                        )}
                    </div>

                    {/* Booked Items */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-5 border-b border-white/5">
                            <h2 className="font-semibold text-white">Item yang Dibooking</h2>
                        </div>
                        <div className="divide-y divide-white/5">
                            {booking.items.map((item) => {
                                const Icon = typeIcon(item.itemType);
                                return (
                                    <div key={item.id} className="flex items-center gap-4 p-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-5 h-5 text-white/30" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium">{item.itemName}</p>
                                            <p className="text-white/40 text-xs">
                                                {item.quantity}x • {item.duration} {item.durationType} • Rp {item.unitPrice.toLocaleString("id-ID")}/{item.durationType}
                                            </p>
                                        </div>
                                        <p className="text-white font-semibold text-sm">
                                            Rp {item.totalPrice.toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                        <h3 className="font-semibold text-white text-sm mb-3">Informasi Kontak</h3>
                        <div className="space-y-2 text-sm">
                            <p className="text-white">{booking.customerName}</p>
                            <p className="text-white/50">{booking.customerEmail}</p>
                            <p className="text-white/50">{booking.customerPhone}</p>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                        <h3 className="font-semibold text-white text-sm mb-3">Ringkasan Harga</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/50">Subtotal</span>
                                <span className="text-white">Rp {booking.subtotal.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">Tax (11%)</span>
                                <span className="text-white">Rp {booking.tax.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="border-t border-white/5 pt-2 flex justify-between">
                                <span className="text-white font-semibold">Total</span>
                                <span className="text-white font-bold text-lg">Rp {booking.total.toLocaleString("id-ID")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Track Link */}
                    <Link href={`/track/${booking.bookingCode}`}
                        className="block w-full text-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white text-sm hover:bg-white/10 transition-all">
                        🔎 Track Booking
                    </Link>
                </div>
            </div>
        </div>
    );
}
