import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import {
    Plus,
    Search,
    Package,
    MoreVertical
} from 'lucide-react';

async function getEquipment() {
    return prisma.equipment.findMany({
        include: {
            location: true
        },
        orderBy: { createdAt: 'desc' }
    });
}

export default async function EquipmentAdminPage() {
    const equipment = await getEquipment();

    const categoryColors: Record<string, string> = {
        'camera': 'bg-purple-500/20 text-purple-400',
        'lens': 'bg-blue-500/20 text-blue-400',
        'lighting': 'bg-amber-500/20 text-amber-400',
        'drone': 'bg-cyan-500/20 text-cyan-400',
        'accessory': 'bg-gray-500/20 text-gray-400',
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Equipment</h1>
                    <p className="text-gray-400 mt-1">Manage your equipment inventory</p>
                </div>
                <Link
                    href="/admin/equipment/new"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
                >
                    <Plus size={20} />
                    Add Equipment
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search equipment..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {['All', 'Camera', 'Lens', 'Lighting', 'Drone', 'Accessory'].map((cat) => (
                        <button
                            key={cat}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${cat === 'All'
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-white">{equipment.length}</p>
                    <p className="text-gray-500 text-sm">Total Equipment</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-emerald-400">{equipment.filter(e => e.status === 'AVAILABLE').length}</p>
                    <p className="text-gray-500 text-sm">Available</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-amber-400">{equipment.filter(e => e.status === 'UNAVAILABLE').length}</p>
                    <p className="text-gray-500 text-sm">Unavailable</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-cyan-400">{equipment.filter(e => e.category === 'camera').length}</p>
                    <p className="text-gray-500 text-sm">Cameras</p>
                </div>
            </div>

            {/* Equipment Grid */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden">
                {equipment.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <Package className="mx-auto text-gray-600 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-white mb-2">No Equipment Yet</h3>
                        <p className="text-gray-400 mb-6">Start building your inventory by adding equipment.</p>
                        <Link
                            href="/admin/equipment/new"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium"
                        >
                            <Plus size={20} />
                            Add Equipment
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Equipment</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Category</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Rate</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Quantity</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {equipment.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-cyan-400">
                                                            <Package size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{item.name}</p>
                                                    <p className="text-gray-500 text-sm">{item.brand || 'No brand'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${categoryColors[item.category] || categoryColors.accessory}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">Rp {item.dailyRate.toLocaleString('id-ID')}</p>
                                                <p className="text-gray-500 text-xs">per day</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white">{item.availableQty} / {item.quantity}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'AVAILABLE'
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/equipment/${item.id}`}
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
