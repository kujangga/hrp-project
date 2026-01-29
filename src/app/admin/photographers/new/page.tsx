'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Camera,
    Upload,
    Loader2,
    CheckCircle
} from 'lucide-react';

export default function NewPhotographerPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/admin/photographers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    hourlyRate: parseFloat(formData.hourlyRate) || 0,
                    dailyRate: parseFloat(formData.dailyRate) || 0
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create photographer');
            }

            router.push('/admin/photographers');
            router.refresh();
        } catch (err) {
            setError('Failed to create photographer. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const grades = ['A', 'B', 'C', 'D', 'E'];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/photographers"
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Add New Photographer</h1>
                    <p className="text-gray-400 mt-1">Create a new photographer profile</p>
                </div>
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
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border-2 border-dashed border-white/20">
                            <Camera className="text-purple-400" size={32} />
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                name="profileImage"
                                value={formData.profileImage}
                                onChange={handleChange}
                                placeholder="Enter image URL or upload"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                            <p className="text-gray-500 text-sm mt-2">Recommended: 400x400px, JPG or PNG</p>
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
                                placeholder="e.g. John Doe"
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
                                placeholder="+62 812 xxxx xxxx"
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
                            placeholder="@username"
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
                            placeholder="Brief description about the photographer's experience and style..."
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Grade & Pricing */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-white">Grade & Pricing</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Grade Classification <span className="text-red-400">*</span>
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
                        <p className="text-gray-500 text-sm mt-3">
                            Grade A = Premium tier, Grade E = Entry level
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Hourly Rate (Rp) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="hourlyRate"
                                value={formData.hourlyRate}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 500000"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Daily Rate (Rp) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="dailyRate"
                                value={formData.dailyRate}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 3000000"
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
                            💾 Save as Draft
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, status: 'PUBLISHED' }))}
                            className={`flex-1 py-4 rounded-xl font-medium transition-all ${formData.status === 'PUBLISHED'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            🌐 Publish Immediately
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
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                Create Photographer
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
