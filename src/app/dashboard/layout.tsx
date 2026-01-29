'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Images,
    Calendar,
    User,
    Menu,
    X,
    LogOut,
    ChevronRight,
    Bell,
    Camera
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Portfolio', href: '/dashboard/portfolio', icon: Images },
    { name: 'Availability', href: '/dashboard/availability', icon: Calendar },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0a0a12]">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-full w-72 
                bg-gradient-to-b from-[#12121a] to-[#0a0a12]
                border-r border-white/5
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
                            <Camera className="text-white" size={20} />
                        </div>
                        <div>
                            <span className="text-white font-semibold text-lg">HRP</span>
                            <span className="text-pink-400 text-xs block -mt-1">Photographer Portal</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-3 py-6 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    group flex items-center gap-3 px-4 py-3 rounded-xl
                                    transition-all duration-200 relative
                                    ${isActive
                                        ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/10 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }
                                `}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-pink-500 to-rose-500 rounded-r-full" />
                                )}
                                <item.icon size={20} className={isActive ? 'text-pink-400' : 'group-hover:text-pink-400 transition-colors'} />
                                <span className="font-medium">{item.name}</span>
                                {isActive && (
                                    <ChevronRight size={16} className="ml-auto text-pink-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Quick Stats */}
                <div className="absolute bottom-20 left-0 right-0 px-4">
                    <div className="rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20 p-4">
                        <p className="text-gray-400 text-sm mb-2">Your Grade</p>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-black">
                                Grade A
                            </span>
                            <span className="text-gray-500 text-sm">Premium Tier</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-medium">
                            P
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">Photographer</p>
                            <p className="text-gray-500 text-xs truncate">View public profile</p>
                        </div>
                        <button className="text-gray-400 hover:text-red-400 transition-colors p-2">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Top Header */}
                <header className="sticky top-0 z-30 h-16 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="h-full px-4 lg:px-8 flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white transition-colors p-2"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Breadcrumb */}
                        <div className="hidden lg:flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Portal</span>
                            <ChevronRight size={14} className="text-gray-600" />
                            <span className="text-white capitalize">
                                {pathname === '/dashboard' ? 'Dashboard' : pathname.split('/').pop()}
                            </span>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
                            </button>
                            <div className="w-px h-6 bg-white/10" />
                            <Link
                                href="/"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                View Site →
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
