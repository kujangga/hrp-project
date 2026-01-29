"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Camera, Video, Package, Truck } from "lucide-react";
import { useBooking, CartItem } from "@/contexts/BookingContext";
import { formatPrice, formatPriceShort, getGradeClass } from "@/lib/utils";

const typeIcons = {
    photographer: Camera,
    videographer: Video,
    equipment: Package,
    transport: Truck,
};

const typeColors = {
    photographer: "from-primary-500/20 to-primary-700/20 text-primary-400",
    videographer: "from-accent-pink/20 to-primary-500/20 text-accent-pink",
    equipment: "from-accent-cyan/20 to-primary-500/20 text-accent-cyan",
    transport: "from-accent-gold/20 to-primary-500/20 text-accent-gold",
};

function CartItemCard({ item }: { item: CartItem }) {
    const { removeFromCart, updateQuantity, updateDuration } = useBooking();
    const Icon = typeIcons[item.type];
    const itemTotal = item.price * item.quantity * item.duration;

    return (
        <div className="glass-card p-5 flex gap-5">
            {/* Image */}
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[item.type]} flex items-center justify-center`}>
                        <Icon className="w-8 h-8" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium uppercase text-white/50 tracking-wide">
                                {item.type}
                            </span>
                            {item.grade && (
                                <span className={`grade-badge text-[10px] py-0.5 px-2 ${getGradeClass(item.grade)}`}>
                                    Grade {item.grade}
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                        <p className="text-white/50 text-sm">
                            {formatPriceShort(item.price)} / {item.priceUnit}
                        </p>
                    </div>
                    <button
                        onClick={() => removeFromCart(item.id, item.type)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Quantity & Duration Controls */}
                <div className="flex items-center gap-6 mt-4">
                    {/* Quantity */}
                    {(item.type === "equipment" || item.type === "transport") && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/50">Qty:</span>
                            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                                <button
                                    onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Duration */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-white/50">Days:</span>
                        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                            <button
                                onClick={() => updateDuration(item.id, item.type, item.duration - 1)}
                                disabled={item.duration <= 1}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-30"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.duration}</span>
                            <button
                                onClick={() => updateDuration(item.id, item.type, item.duration + 1)}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Item Total */}
                    <div className="ml-auto text-right">
                        <span className="price-tag">{formatPriceShort(itemTotal)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CartPage() {
    const { cart, getCartTotal, clearCart } = useBooking();
    const total = getCartTotal();
    const tax = total * 0.11; // 11% tax
    const grandTotal = total + tax;

    // Group items by type
    const groupedItems = cart.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
    }, {} as Record<string, CartItem[]>);

    if (cart.length === 0) {
        return (
            <div className="section-container py-20">
                <div className="max-w-md mx-auto text-center">
                    <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-12 h-12 text-white/30" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3">Your Cart is Empty</h1>
                    <p className="text-white/50 mb-8">
                        Start adding photographers, videographers, equipment, or transport to your booking.
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
                    <p className="text-white/60">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
                </div>
                <button
                    onClick={clearCart}
                    className="flex items-center gap-2 text-sm text-white/50 hover:text-red-400 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {Object.entries(groupedItems).map(([type, items]) => {
                        const Icon = typeIcons[type as keyof typeof typeIcons];
                        return (
                            <div key={type}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon className="w-5 h-5 text-white/50" />
                                    <h2 className="font-semibold capitalize">{type}s</h2>
                                    <span className="text-white/40">({items.length})</span>
                                </div>
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <CartItemCard key={`${item.type}-${item.id}`} item={item} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24">
                        <h3 className="font-semibold text-lg mb-6">Order Summary</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Subtotal</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Tax (11%)</span>
                                <span>{formatPrice(tax)}</span>
                            </div>
                            <div className="border-t border-white/10 pt-4 flex justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="text-xl font-bold text-accent-gold">{formatPrice(grandTotal)}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            href="/photographers"
                            className="btn-secondary w-full flex items-center justify-center gap-2 mt-3"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
