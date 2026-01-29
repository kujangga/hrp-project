"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useBooking } from "@/contexts/BookingContext";
import { formatPrice, formatPriceShort, generateBookingCode } from "@/lib/utils";
import { ShoppingBag, ShoppingCart, User, Mail, Phone, Calendar, MapPin, FileText, CreditCard, Loader2, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, getCartTotal, clearCart } = useBooking();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        eventDate: "",
        eventLocation: "",
        eventDetails: "",
        specialRequests: "",
        paymentMethod: "bank_transfer",
    });

    const total = getCartTotal();
    const tax = total * 0.11;
    const grandTotal = total + tax;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Generate booking code
        const bookingCode = generateBookingCode();

        // Store booking data in localStorage for confirmation page
        const bookingData = {
            bookingCode,
            ...formData,
            items: cart,
            subtotal: total,
            tax,
            total: grandTotal,
            createdAt: new Date().toISOString(),
        };
        localStorage.setItem("hrp-last-booking", JSON.stringify(bookingData));

        // Clear cart
        clearCart();

        // Redirect to confirmation
        router.push(`/confirmation/${bookingCode}`);
    };

    // Show empty cart message instead of redirecting during render
    if (cart.length === 0) {
        return (
            <div className="section-container py-20">
                <div className="max-w-md mx-auto text-center">
                    <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-12 h-12 text-white/30" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3">Your Cart is Empty</h1>
                    <p className="text-white/50 mb-8">
                        Add some items to your cart before proceeding to checkout.
                    </p>
                    <Link href="/photographers" className="btn-primary inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Browse Services
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="section-container py-12">
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-white/60 mb-8">Complete your booking by filling in the details below.</p>

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Customer Information */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary-400" />
                                </div>
                                <h2 className="text-lg font-semibold">Customer Information</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your full name"
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="customerPhone"
                                        value={formData.customerPhone}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="+62 812 3456 7890"
                                        className="input-field"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-white/60 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        name="customerEmail"
                                        value={formData.customerEmail}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="your@email.com"
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-accent-cyan" />
                                </div>
                                <h2 className="text-lg font-semibold">Event Details</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Event Date *</label>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleInputChange}
                                        required
                                        min={new Date().toISOString().split("T")[0]}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Event Location *</label>
                                    <input
                                        type="text"
                                        name="eventLocation"
                                        value={formData.eventLocation}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter venue or location"
                                        className="input-field"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-white/60 mb-2">Event Description *</label>
                                    <textarea
                                        name="eventDetails"
                                        value={formData.eventDetails}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        placeholder="Describe your event (e.g., Wedding, Corporate Event, Product Shoot...)"
                                        className="input-field resize-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-white/60 mb-2">Special Requests (Optional)</label>
                                    <textarea
                                        name="specialRequests"
                                        value={formData.specialRequests}
                                        onChange={handleInputChange}
                                        rows={2}
                                        placeholder="Any specific requirements or notes..."
                                        className="input-field resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-accent-gold/20 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-accent-gold" />
                                </div>
                                <h2 className="text-lg font-semibold">Payment Method</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                {[
                                    { id: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
                                    { id: "credit_card", label: "Credit/Debit Card", icon: "💳" },
                                    { id: "ewallet", label: "E-Wallet (GoPay, OVO, Dana)", icon: "📱" },
                                    { id: "virtual_account", label: "Virtual Account", icon: "🔢" },
                                ].map((method) => (
                                    <label
                                        key={method.id}
                                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.paymentMethod === method.id
                                            ? "border-primary-500 bg-primary-500/10"
                                            : "border-white/10 hover:border-white/20 bg-white/5"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.id}
                                            checked={formData.paymentMethod === method.id}
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                        <span className="text-xl">{method.icon}</span>
                                        <span className="font-medium">{method.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <ShoppingBag className="w-5 h-5 text-white/50" />
                                <h3 className="font-semibold text-lg">Order Summary</h3>
                            </div>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={`${item.type}-${item.id}`} className="flex gap-3">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 bg-white/10 flex items-center justify-center text-lg">
                                                    {item.type === "photographer" ? "📷" : item.type === "videographer" ? "🎬" : item.type === "equipment" ? "📦" : "🚐"}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{item.name}</p>
                                            <p className="text-xs text-white/50">
                                                {item.quantity}x • {item.duration} day{item.duration > 1 ? "s" : ""}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium text-right">
                                            {formatPriceShort(item.price * item.quantity * item.duration)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Tax (11%)</span>
                                    <span>{formatPrice(tax)}</span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex justify-between">
                                    <span className="font-semibold">Total</span>
                                    <span className="text-xl font-bold text-accent-gold">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Complete Booking
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-white/40 text-center mt-4">
                                By completing this booking, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
