'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Camera,
    Loader2,
    CheckCircle,
    Trash2,
    AlertTriangle
} from 'lucide-react';

interface Photographer {
    id: string;
    name: string;
    bio: string | null;
    phone: string | null;
    instagram: string | null;
    grade: string;
    hourlyRate: number;
    dailyRate: number;
    profileImage: string | null;
    status: string;
    locationId: string | null;
}

export default function EditPhotographerPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        phone: '',
        instagram: '',
        grade: 'C',
        hourlyRate: '',
        dailyRate: '',
        profileImage: '',
        status: 'DRAFT'
    });

    useEffect(() => {
        async function fetchPhotographer() {
            try {
                const response = await fetch(`/api/admin/photographers/${resolvedParams.id}`);
                if (!response.ok) throw new Error('Not found');
                const data: Photographer = await response.json();
                setFormData({
                    name: data.name,
                    bio: data.bio || '',
                    phone: data.phone || '',
                    instagram: data.instagram || '',
                    grade: data.grade,
                    hourlyRate: data.hourlyRate.toString(),
                    dailyRate: data.dailyRate.toString(),
                    profileImage: data.profileImage || '',
                    status: data.status
                });
            } catch (err) {
                setError('Photographer not found');
            } finally {
                setIsLoading(false);
            }
        }
        fetchPhotographer();
    }, [resolvedParams.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            const response = await fetch(`/api/admin/photographers/${resolvedParams.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    hourlyRate: parseFloat(formData.hourlyRate) || 0,
                    dailyRate: parseFloat(formData.dailyRate) || 0
                })
            });

            if (!response.ok) throw new Error('Failed to update');

            router.push('/admin/photographers');
            router.refresh();
        } catch (err) {
            setError('Failed to update photographer. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/photographers/${resolvedParams.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete');

            router.push('/admin/photographers');
            router.refresh();
        } catch (err) {
            setError('Failed to delete photographer. Please try again.');
            setShowDeleteConfirm(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const grades = ['A', 'B', 'C', 'D', 'E'];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-purple-400" size={32} />
            </div>
        );
    }

    if (error && !formData.name) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="p-8 text-center">
                    <AlertTriangle className="mx-auto text-amber-400 mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-white mb-2">Photographer Not Found</h2>
                    <p className="text-gray-400 mb-6">The photographer you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/admin/photographers"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium"
                    >
                        Back to Photographers
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-6 max-w-md mx-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <Trash2 className="text-red-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Delete Photographer</h3>
                                <p className="text-gray-400 text-sm">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete <strong className="text-white">{formData.name}</strong>? All associated data will be permanently removed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Trash2 size={18} />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/photographers"
                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-white">Edit Photographer</h1>
                        <p className="text-gray-400 mt-1">Update photographer details</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete photographer"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        {error}
                    </div>
                )}

                {/* Profile Image Section */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Profile Image</h2>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border-2 border-dashed border-white/20 overflow-hidden">
                            {formData.profileImage ? (
                                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <Camera className="text-purple-400" size={32} />
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                name="profileImage"
                                value={formData.profileImage}
                                onChange={handleChange}
                                placeholder="Enter image URL"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-white">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Instagram Handle
                        </label>
                        <input
                            type="text"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Bio / Description
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Grade & Pricing */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-white">Grade & Pricing</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Grade Classification
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {grades.map((grade) => (
                                <button
                                    key={grade}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, grade }))}
                                    className={`
                                        px-6 py-3 rounded-xl font-medium transition-all
                                        ${formData.grade === grade
                                            ? grade === 'A'
                                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/25'
                                                : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }
                                    `}
                                >
                                    Grade {grade}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Hourly Rate (Rp)
                            </label>
                            <input
                                type="number"
                                name="hourlyRate"
                                value={formData.hourlyRate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Daily Rate (Rp)
                            </label>
                            <input
                                type="number"
                                name="dailyRate"
                                value={formData.dailyRate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Visibility</h2>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, status: 'DRAFT' }))}
                            className={`flex-1 py-4 rounded-xl font-medium transition-all ${formData.status === 'DRAFT'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            💾 Draft
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, status: 'PUBLISHED' }))}
                            className={`flex-1 py-4 rounded-xl font-medium transition-all ${formData.status === 'PUBLISHED'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            🌐 Published
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Link
                        href="/admin/photographers"
                        className="px-6 py-3 rounded-xl text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
