"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard, ShoppingBag, User, LogOut, Menu, X, Camera, ChevronRight, Building2, Search
} from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
    { href: "/vendor", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/vendor/bookings", label: "Bookings", icon: ShoppingBag },
    { href: "/vendor/track", label: "Track Booking", icon: Search },
    { href: "/vendor/profile", label: "Profile", icon: User },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = session?.user as { name?: string; email?: string; role?: string } | undefined;

    return (
        <div className="min-h-screen bg-[#0a0a12]">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0d0d1a] border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <Camera className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="text-white font-bold text-lg">HRP</span>
                            <span className="text-purple-400 text-[10px] block leading-none">Vendor Portal</span>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="p-4 space-y-1">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {link.label}
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || "V"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-white/40 text-xs truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-colors text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Top Bar */}
                <header className="h-16 flex items-center gap-4 px-6 border-b border-white/5 bg-[#0a0a12]/80 backdrop-blur-xl sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-white/40">
                        <Building2 className="w-4 h-4" />
                        <span>Vendor Dashboard</span>
                    </div>
                    <div className="ml-auto">
                        <Link href="/photographers" className="text-sm text-white/40 hover:text-white transition-colors">
                            ← Kembali ke katalog
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
