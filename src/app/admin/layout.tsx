'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Camera,
    Video,
    Package,
    Truck,
    ShoppingCart,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronRight,
    Bell
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Photographers', href: '/admin/photographers', icon: Camera },
    { name: 'Videographers', href: '/admin/videographers', icon: Video },
    { name: 'Equipment', href: '/admin/equipment', icon: Package },
    { name: 'Transport', href: '/admin/transport', icon: Truck },
    { name: 'Bookings', href: '/admin/bookings', icon: ShoppingCart },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const user = session?.user as { name?: string; email?: string } | undefined;
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
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                            <span className="text-white font-bold text-lg">H</span>
                        </div>
                        <div>
                            <span className="text-white font-semibold text-lg">HRP</span>
                            <span className="text-purple-400 text-xs block -mt-1">Admin Panel</span>
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
                            (item.href !== '/admin' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    group flex items-center gap-3 px-4 py-3 rounded-xl
                                    transition-all duration-200 relative
                                    ${isActive
                                        ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/10 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }
                                `}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-r-full" />
                                )}
                                <item.icon size={20} className={isActive ? 'text-purple-400' : 'group-hover:text-purple-400 transition-colors'} />
                                <span className="font-medium">{item.name}</span>
                                {isActive && (
                                    <ChevronRight size={16} className="ml-auto text-purple-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                            <p className="text-gray-500 text-xs truncate">{user?.email || ''}</p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="text-gray-400 hover:text-red-400 transition-colors p-2"
                            title="Logout"
                        >
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

                        {/* Breadcrumb placeholder */}
                        <div className="hidden lg:flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Admin</span>
                            <ChevronRight size={14} className="text-gray-600" />
                            <span className="text-white capitalize">
                                {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()}
                            </span>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
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
