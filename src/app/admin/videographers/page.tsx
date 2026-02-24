import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import {
    Plus,
    Video,
    MapPin,
    MoreVertical
} from 'lucide-react';
import AdminFilterBar from '@/components/admin/AdminFilterBar';

interface PageProps {
    searchParams: Promise<{ grade?: string; search?: string }>;
}

async function getVideographers(filters: { grade?: string; search?: string }) {
    const where: Record<string, unknown> = {};

    if (filters.grade) {
        where.grade = filters.grade;
    }

    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { bio: { contains: filters.search, mode: 'insensitive' } },
            { phone: { contains: filters.search } },
        ];
    }

    return prisma.videographer.findMany({
        where,
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

export default async function VideographersPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const videographers = await getVideographers(params);

    const gradeColors: Record<string, string> = {
        'A': 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black',
        'B': 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
        'C': 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
        'D': 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
        'E': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
    };

    const gradeOptions = [
        { label: 'All Grades', value: '' },
        { label: 'Grade A', value: 'A' },
        { label: 'Grade B', value: 'B' },
        { label: 'Grade C', value: 'C' },
        { label: 'Grade D', value: 'D' },
        { label: 'Grade E', value: 'E' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Videographers</h1>
                    <p className="text-gray-400 mt-1">Manage your videographer talent pool</p>
                </div>
                <Link
                    href="/admin/videographers/new"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg shadow-pink-500/25"
                >
                    <Plus size={20} />
                    Add Videographer
                </Link>
            </div>

            {/* Filters Bar */}
            <Suspense fallback={<div className="h-14 rounded-xl bg-white/5 animate-pulse" />}>
                <AdminFilterBar
                    searchPlaceholder="Search videographers..."
                    filterOptions={gradeOptions}
                    filterParamName="grade"
                    currentFilter={params.grade}
                    currentSearch={params.search}
                    accentColor="pink"
                />
            </Suspense>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-white">{videographers.length}</p>
                    <p className="text-gray-500 text-sm">{params.grade || params.search ? 'Matching' : 'Total'} Videographers</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-emerald-400">{videographers.filter(v => v.status === 'PUBLISHED').length}</p>
                    <p className="text-gray-500 text-sm">Published</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-amber-400">{videographers.filter(v => v.status === 'DRAFT').length}</p>
                    <p className="text-gray-500 text-sm">Draft</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-2xl font-bold text-pink-400">{videographers.filter(v => v.grade === 'A').length}</p>
                    <p className="text-gray-500 text-sm">Grade A</p>
                </div>
            </div>

            {/* Videographers Table */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden">
                {videographers.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <Video className="mx-auto text-gray-600 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {params.grade || params.search ? 'No Matching Videographers' : 'No Videographers Yet'}
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {params.grade || params.search
                                ? 'Try adjusting your filters.'
                                : 'Start building your talent pool by adding your first videographer.'}
                        </p>
                        {!params.grade && !params.search && (
                            <Link
                                href="/admin/videographers/new"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium"
                            >
                                <Plus size={20} />
                                Add Videographer
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Videographer</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Grade</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Location</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Rates</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {videographers.map((videographer) => (
                                    <tr key={videographer.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-pink-500/20 to-rose-500/20">
                                                    {videographer.profileImage ? (
                                                        <Image
                                                            src={videographer.profileImage}
                                                            alt={videographer.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-pink-400">
                                                            <Video size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{videographer.name}</p>
                                                    <p className="text-gray-500 text-sm">{videographer.phone || 'No phone'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${gradeColors[videographer.grade]}`}>
                                                Grade {videographer.grade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <MapPin size={14} />
                                                <span className="text-sm">{videographer.location?.name || 'Not set'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">Rp {videographer.dailyRate.toLocaleString('id-ID')}</p>
                                                <p className="text-gray-500 text-xs">per day</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${videographer.status === 'PUBLISHED'
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-amber-500/20 text-amber-400'
                                                }`}>
                                                {videographer.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/videographers/${videographer.id}`}
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
