"use client";

import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { formatPriceShort, parseFeatures } from "@/lib/utils";
import { useBooking } from "@/contexts/BookingContext";

interface EquipmentCardProps {
    id: string;
    name: string;
    description?: string | null;
    category: string;
    brand?: string | null;
    dailyRate: number;
    availableQty: number;
    image?: string | null;
    features?: string | null;
}

const categoryColors: Record<string, string> = {
    camera: "from-blue-500/20 to-blue-700/20",
    lens: "from-purple-500/20 to-purple-700/20",
    lighting: "from-yellow-500/20 to-yellow-700/20",
    drone: "from-cyan-500/20 to-cyan-700/20",
    accessory: "from-pink-500/20 to-pink-700/20",
};

const categoryIcons: Record<string, string> = {
    camera: "📷",
    lens: "🔭",
    lighting: "💡",
    drone: "🚁",
    accessory: "🎒",
};

export default function EquipmentCard({
    id,
    name,
    description,
    category,
    brand,
    dailyRate,
    availableQty,
    image,
    features,
}: EquipmentCardProps) {
    const { addToCart, removeFromCart, cart } = useBooking();
    const featureList = parseFeatures(features);

    const isInCart = cart.some((item) => item.id === id && item.type === "equipment");

    const handleCartToggle = () => {
        if (isInCart) {
            removeFromCart(id, "equipment");
        } else {
            addToCart({
                id,
                type: "equipment",
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
                    <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[category] || categoryColors.accessory} flex items-center justify-center`}>
                        <span className="text-5xl">{categoryIcons[category] || "📦"}</span>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-medium capitalize">
                        {category}
                    </span>
                </div>

                {/* Availability */}
                <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${availableQty > 0
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                        }`}>
                        {availableQty > 0 ? `${availableQty} available` : "Out of stock"}
                    </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Brand & Name */}
                <div className="mb-3">
                    {brand && (
                        <span className="text-primary-400 text-xs font-medium uppercase tracking-wide">
                            {brand}
                        </span>
                    )}
                    <h3 className="font-semibold text-lg">{name}</h3>
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

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="price-tag">{formatPriceShort(dailyRate)}</span>
                        <span className="price-unit"> /day</span>
                    </div>
                </div>

                {/* Add to Cart */}
                <button
                    onClick={handleCartToggle}
                    disabled={availableQty === 0 && !isInCart}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${isInCart
                        ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                        : availableQty > 0
                            ? "btn-primary"
                            : "bg-white/5 text-white/30 cursor-not-allowed"
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
