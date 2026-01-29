import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Camera,
    MapPin,
    Star
} from 'lucide-react';

async function getPhotographers() {
    return prisma.photographer.findMany({
        include: {
            location: true,
            portfolios: {
                take: 1,
                orderBy: { order: 'asc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export default async function PhotographersPage() {
    const photographers = await getPhotographers();

    const gradeColors: Record<string, string> = {
        'A': 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black',
        'B': 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
        'C': 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
        'D': 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
        'E': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Photographers</h1>
                    <p className="text-gray-400 mt-1">Manage your photographer talent pool</p>
                </div>
                <Link
                    href="/admin/photographers/new"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25"
                >
                    <Plus size={20} />
                    Add Photographer
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search photographers..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                </div>

                {/* Grade Filter */}
                <div className="flex gap-2">
                    {['All', 'A', 'B', 'C', 'D', 'E'].map((grade) => (
                        <button
                            key={grade}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${grade === 'All'
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {grade === 'All' ? 'All Grades' : `Grade ${grade}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-white">{photographers.length}</p>
                    <p className="text-gray-500 text-sm">Total Photographers</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-emerald-400">{photographers.filter(p => p.status === 'PUBLISHED').length}</p>
                    <p className="text-gray-500 text-sm">Published</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-amber-400">{photographers.filter(p => p.status === 'DRAFT').length}</p>
                    <p className="text-gray-500 text-sm">Draft</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-purple-400">{photographers.filter(p => p.grade === 'A').length}</p>
                    <p className="text-gray-500 text-sm">Grade A</p>
                </div>
            </div>

            {/* Photographers Table */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden">
                {photographers.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <Camera className="mx-auto text-gray-600 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-white mb-2">No Photographers Yet</h3>
                        <p className="text-gray-400 mb-6">Start building your talent pool by adding your first photographer.</p>
                        <Link
                            href="/admin/photographers/new"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium"
                        >
                            <Plus size={20} />
                            Add Photographer
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Photographer</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Grade</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Location</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Rates</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {photographers.map((photographer) => (
                                    <tr key={photographer.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                                                    {photographer.profileImage ? (
                                                        <Image
                                                            src={photographer.profileImage}
                                                            alt={photographer.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-purple-400">
                                                            <Camera size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{photographer.name}</p>
                                                    <p className="text-gray-500 text-sm">{photographer.phone || 'No phone'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${gradeColors[photographer.grade]}`}>
                                                Grade {photographer.grade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <MapPin size={14} />
                                                <span className="text-sm">{photographer.location?.name || 'Not set'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">Rp {photographer.dailyRate.toLocaleString('id-ID')}</p>
                                                <p className="text-gray-500 text-xs">per day</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${photographer.status === 'PUBLISHED'
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-amber-500/20 text-amber-400'
                                                }`}>
                                                {photographer.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/photographers/${photographer.id}`}
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
