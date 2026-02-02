"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Package, ArrowRight, Home } from "lucide-react";

export default function TrackingLandingPage() {
    const router = useRouter();
    const [bookingCode, setBookingCode] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const code = bookingCode.trim().toUpperCase();
        if (!code) {
            setError("Please enter a booking code");
            return;
        }

        setIsLoading(true);

        // Validate booking exists before redirecting
        try {
            const res = await fetch(`/api/track/${code}`);
            if (!res.ok) {
                setError("Booking not found. Please check your booking code.");
                setIsLoading(false);
                return;
            }
            router.push(`/track/${code}`);
        } catch {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <Package className="w-10 h-10 text-purple-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3">Track Your Booking</h1>
                    <p className="text-white/60">
                        Enter your booking code to check the status of your order
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="glass-card p-6">
                        <label htmlFor="bookingCode" className="block text-sm font-medium text-white/70 mb-2">
                            Booking Code
                        </label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                id="bookingCode"
                                value={bookingCode}
                                onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                                placeholder="e.g. HRP-240129-ABC123"
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono text-lg tracking-wider"
                                disabled={isLoading}
                            />
                        </div>
                        {error && (
                            <p className="mt-3 text-sm text-red-400">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                Track Booking
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Help Text */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-sm text-white/40">
                        Your booking code was sent to your email after checkout.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
