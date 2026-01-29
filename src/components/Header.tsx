"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Camera, Video, Package, Truck } from "lucide-react";
import { useState } from "react";
import { useBooking } from "@/contexts/BookingContext";

const navLinks = [
    { href: "/photographers", label: "Photographers", icon: Camera },
    { href: "/videographers", label: "Videographers", icon: Video },
    { href: "/equipment", label: "Equipment", icon: Package },
    { href: "/transport", label: "Transport", icon: Truck },
];

export default function Header() {
    const pathname = usePathname();
    const { getCartCount } = useBooking();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const cartCount = getCartCount();

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.12_0.05_275/0.95)] to-[oklch(0.12_0.05_275/0.8)] backdrop-blur-xl border-b border-white/10" />

            <div className="relative section-container">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">HRP</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`nav-link flex items-center gap-2 ${isActive ? "text-white" : ""
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Cart Button */}
                        <Link
                            href="/cart"
                            className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden absolute top-full left-0 right-0 bg-[oklch(0.15_0.05_275/0.98)] backdrop-blur-xl border-b border-white/10 py-4 px-6">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-colors ${isActive
                                            ? "bg-white/10 text-white"
                                            : "text-white/70 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </div>
        </header>
    );
}
