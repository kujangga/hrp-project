import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import {
    Plus,
    Search,
    Truck,
    Users,
    MoreVertical
} from 'lucide-react';

async function getTransport() {
    return prisma.transport.findMany({
        include: {
            location: true
        },
        orderBy: { createdAt: 'desc' }
    });
}

export default async function TransportAdminPage() {
    const transport = await getTransport();

    const vehicleColors: Record<string, string> = {
        'van': 'bg-purple-500/20 text-purple-400',
        'suv': 'bg-blue-500/20 text-blue-400',
        'minibus': 'bg-amber-500/20 text-amber-400',
        'car': 'bg-emerald-500/20 text-emerald-400',
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Transport</h1>
                    <p className="text-gray-400 mt-1">Manage your vehicle fleet</p>
                </div>
                <Link
                    href="/admin/transport/new"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/25"
                >
                    <Plus size={20} />
                    Add Vehicle
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search vehicles..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {['All', 'Van', 'SUV', 'Minibus', 'Car'].map((type) => (
                        <button
                            key={type}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${type === 'All'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-white">{transport.length}</p>
                    <p className="text-gray-500 text-sm">Total Vehicles</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-emerald-400">{transport.filter(t => t.status === 'AVAILABLE').length}</p>
                    <p className="text-gray-500 text-sm">Available</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-amber-400">{transport.reduce((sum, t) => sum + t.capacity, 0)}</p>
                    <p className="text-gray-500 text-sm">Total Capacity</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-orange-400">{transport.filter(t => t.vehicleType === 'van').length}</p>
                    <p className="text-gray-500 text-sm">Vans</p>
                </div>
            </div>

            {/* Transport Table */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden">
                {transport.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <Truck className="mx-auto text-gray-600 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-white mb-2">No Vehicles Yet</h3>
                        <p className="text-gray-400 mb-6">Start building your fleet by adding vehicles.</p>
                        <Link
                            href="/admin/transport/new"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium"
                        >
                            <Plus size={20} />
                            Add Vehicle
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Vehicle</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Type</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Capacity</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Rate</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transport.map((vehicle) => (
                                    <tr key={vehicle.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                                                    {vehicle.image ? (
                                                        <Image
                                                            src={vehicle.image}
                                                            alt={vehicle.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-amber-400">
                                                            <Truck size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{vehicle.name}</p>
                                                    <p className="text-gray-500 text-sm truncate max-w-[200px]">{vehicle.description || 'No description'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${vehicleColors[vehicle.vehicleType] || vehicleColors.car}`}>
                                                {vehicle.vehicleType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-white">
                                                <Users size={16} className="text-gray-500" />
                                                {vehicle.capacity} pax
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">Rp {vehicle.dailyRate.toLocaleString('id-ID')}</p>
                                                <p className="text-gray-500 text-xs">per day</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${vehicle.status === 'AVAILABLE'
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {vehicle.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/transport/${vehicle.id}`}
                                                    className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                                                >
                                                    Edit
                                                </Link>
                                                <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
