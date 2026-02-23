"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Camera, Video, Package, Truck, LogIn, UserCircle, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
    { href: "/photographers", label: "Photographers", icon: Camera },
    { href: "/videographers", label: "Videographers", icon: Video },
    { href: "/equipment", label: "Equipment", icon: Package },
    { href: "/transport", label: "Transport", icon: Truck },
];

function getDashboardPath(role: string) {
    switch (role) {
        case "ADMIN": return "/admin";
        case "TALENT": return "/dashboard";
        case "VENDOR": return "/vendor";
        default: return "/";
    }
}

function getRoleBadge(role: string) {
    switch (role) {
        case "ADMIN": return { label: "Admin", color: "from-red-500 to-orange-500" };
        case "TALENT": return { label: "Talent", color: "from-pink-500 to-rose-500" };
        case "VENDOR": return { label: "Vendor", color: "from-purple-500 to-indigo-500" };
        default: return { label: role, color: "from-gray-500 to-gray-600" };
    }
}

export default function Header() {
    const pathname = usePathname();
    const { getCartCount } = useBooking();
    const { data: session, status } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const cartCount = getCartCount();

    // Close user menu on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const user = session?.user as { name?: string; email?: string; role?: string } | undefined;
    const role = user?.role || "";
    const roleBadge = getRoleBadge(role);

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
                    <div className="flex items-center gap-3">
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

                        {/* Auth Section */}
                        {status === "loading" ? (
                            <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                        ) : session ? (
                            /* Logged In — User Menu */
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
                                >
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${roleBadge.color} flex items-center justify-center text-white text-sm font-bold`}>
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-white text-xs font-medium leading-tight truncate max-w-[100px]">{user?.name}</p>
                                        <p className="text-white/40 text-[10px] leading-tight">{roleBadge.label}</p>
                                    </div>
                                    <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                                </button>

                                {/* Dropdown */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                                        <div className="p-3 border-b border-white/5">
                                            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                                            <p className="text-white/40 text-xs truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-1.5">
                                            <Link
                                                href={getDashboardPath(role)}
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setUserMenuOpen(false);
                                                    signOut({ callbackUrl: "/" });
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors text-sm"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Keluar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Logged Out — Login/Register */
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/70 hover:text-white transition-colors"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
                                >
                                    <UserCircle className="w-4 h-4" />
                                    <span className="hidden sm:inline">Daftar</span>
                                </Link>
                            </div>
                        )}

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
                        {/* Auth - Mobile */}
                        {!session && (
                            <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 py-3 px-4 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                    <LogIn className="w-5 h-5" />
                                    Masuk
                                </Link>
                                <Link href="/register" onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 py-3 px-4 rounded-xl text-purple-400 hover:text-purple-300 hover:bg-purple-500/5 transition-colors">
                                    <UserCircle className="w-5 h-5" />
                                    Daftar sebagai Vendor
                                </Link>
                            </div>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
}
