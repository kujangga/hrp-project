"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Check, Instagram, MapPin, Images } from "lucide-react";
import { formatPriceShort, getGradeClass } from "@/lib/utils";
import { useBooking } from "@/contexts/BookingContext";
import PortfolioModal from "./PortfolioModal";

interface PortfolioItem {
    id: string;
    imageUrl: string;
    videoUrl?: string | null;
    caption?: string | null;
    order: number;
}

interface TalentCardProps {
    id: string;
    type: "photographer" | "videographer";
    name: string;
    bio?: string | null;
    grade: string;
    hourlyRate: number;
    dailyRate: number;
    profileImage?: string | null;
    instagram?: string | null;
    location?: { name: string } | null;
    portfolio?: PortfolioItem[];
}

export default function TalentCard({
    id,
    type,
    name,
    bio,
    grade,
    hourlyRate,
    dailyRate,
    profileImage,
    instagram,
    location,
    portfolio = [],
}: TalentCardProps) {
    const { addToCart, removeFromCart, cart } = useBooking();
    const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

    // Check if this item is already in cart
    const isInCart = cart.some((item) => item.id === id && item.type === type);
    const hasPortfolio = portfolio && portfolio.length > 0;

    const handleCartToggle = () => {
        if (isInCart) {
            // Remove from cart
            removeFromCart(id, type);
        } else {
            // Add to cart
            addToCart({
                id,
                type,
                name,
                image: profileImage || undefined,
                grade,
                price: dailyRate,
                priceUnit: "day",
            });
        }
    };

    return (
        <>
            <div className="service-card group overflow-hidden">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                    {profileImage ? (
                        <Image
                            src={profileImage}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white/30">{name.charAt(0)}</span>
                        </div>
                    )}

                    {/* Grade Badge */}
                    <div className="absolute top-4 left-4">
                        <span className={`grade-badge ${getGradeClass(grade)}`}>
                            Grade {grade}
                        </span>
                    </div>

                    {/* In Cart Badge */}
                    {isInCart && (
                        <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                In Cart
                            </span>
                        </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Name & Location */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                            <h3 className="font-semibold text-lg">{name}</h3>
                            {location && (
                                <div className="flex items-center gap-1 text-white/50 text-sm mt-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {location.name}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Portfolio Button */}
                            {hasPortfolio && (
                                <button
                                    onClick={() => setIsPortfolioOpen(true)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-primary-500/20 hover:text-primary-400 transition-colors"
                                    title="View Portfolio"
                                >
                                    <Images className="w-4 h-4 text-white/60 hover:text-primary-400" />
                                </button>
                            )}
                            {/* Instagram Button */}
                            {instagram && (
                                <a
                                    href={`https://instagram.com/${instagram.replace("@", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <Instagram className="w-4 h-4 text-white/60" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    {bio && (
                        <p className="text-white/50 text-sm line-clamp-2 mb-4">{bio}</p>
                    )}

                    {/* Pricing */}
                    <div className="flex items-center gap-3 mb-4">
                        <div>
                            <span className="price-tag">{formatPriceShort(dailyRate)}</span>
                            <span className="price-unit"> /day</span>
                        </div>
                        <span className="text-white/30">|</span>
                        <div className="text-white/50 text-sm">
                            {formatPriceShort(hourlyRate)}/hr
                        </div>
                    </div>

                    {/* Add to Cart Button */}
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

            {/* Portfolio Modal */}
            <PortfolioModal
                isOpen={isPortfolioOpen}
                onClose={() => setIsPortfolioOpen(false)}
                talentName={name}
                type={type}
                portfolio={portfolio}
            />
        </>
    );
}
