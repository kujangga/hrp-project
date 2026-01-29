"use client";

import Image from "next/image";
import { Plus, Check, Users, MapPin } from "lucide-react";
import { formatPriceShort, parseFeatures } from "@/lib/utils";
import { useBooking } from "@/contexts/BookingContext";

interface TransportCardProps {
    id: string;
    name: string;
    description?: string | null;
    vehicleType: string;
    capacity: number;
    dailyRate: number;
    image?: string | null;
    features?: string | null;
    location?: { name: string } | null;
}

const vehicleIcons: Record<string, string> = {
    van: "🚐",
    suv: "🚙",
    minibus: "🚌",
    bus: "🚍",
    car: "🚗",
    truck: "🚛",
};

export default function TransportCard({
    id,
    name,
    description,
    vehicleType,
    capacity,
    dailyRate,
    image,
    features,
    location,
}: TransportCardProps) {
    const { addToCart, removeFromCart, cart } = useBooking();
    const featureList = parseFeatures(features);

    const isInCart = cart.some((item) => item.id === id && item.type === "transport");

    const handleCartToggle = () => {
        if (isInCart) {
            removeFromCart(id, "transport");
        } else {
            addToCart({
                id,
                type: "transport",
                name,
                image: image || undefined,
                price: dailyRate,
                priceUnit: "day",
            });
        }
    };

    return (
        <div className="service-card group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 to-primary-700/20 flex items-center justify-center">
                        <span className="text-6xl">{vehicleIcons[vehicleType] || "🚐"}</span>
                    </div>
                )}

                {/* Vehicle Type Badge */}
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-medium capitalize">
                        {vehicleType}
                    </span>
                </div>

                {/* Capacity Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{capacity}</span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Name & Location */}
                <div className="mb-3">
                    <h3 className="font-semibold text-lg">{name}</h3>
                    {location && (
                        <div className="flex items-center gap-1 text-white/50 text-sm mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {location.name}
                        </div>
                    )}
                </div>

                {/* Description */}
                {description && (
                    <p className="text-white/50 text-sm line-clamp-2 mb-3">{description}</p>
                )}

                {/* Features */}
                {featureList.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {featureList.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="feature-tag">
                                {feature}
                            </span>
                        ))}
                        {featureList.length > 3 && (
                            <span className="feature-tag">+{featureList.length - 3}</span>
                        )}
                    </div>
                )}

                {/* Pricing & Capacity */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="price-tag">{formatPriceShort(dailyRate)}</span>
                        <span className="price-unit"> /day</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{capacity} passengers</span>
                    </div>
                </div>

                {/* Add to Cart */}
                <button
                    onClick={handleCartToggle}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${isInCart
                        ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                        : "btn-primary"
                        }`}
                >
                    {isInCart ? (
                        <>
                            <Check className="w-4 h-4" />
                            Added to Cart
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" />
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
