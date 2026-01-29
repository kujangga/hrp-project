'use client';

import { useState } from 'react';
import {
    User,
    Camera,
    MapPin,
    Phone,
    Instagram,
    DollarSign,
    Save,
    Loader2,
    Eye
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: 'John Photography',
        bio: 'Professional wedding and portrait photographer with 5+ years of experience. Specializing in candid moments and natural lighting.',
        phone: '+62 812 3456 7890',
        instagram: '@johnphotography',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    });

    // Read-only fields set by admin
    const adminFields = {
        grade: 'A',
        hourlyRate: 750000,
        dailyRate: 5000000,
        location: 'Jakarta',
        status: 'PUBLISHED'
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
    };

    const gradeColors: Record<string, string> = {
        'A': 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black',
        'B': 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
        'C': 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
        'D': 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
        'E': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Profile</h1>
                    <p className="text-gray-400 mt-1">Manage your public profile information</p>
                </div>
                <Link
                    href={`/photographers/${formData.name.toLowerCase().replace(' ', '-')}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <Eye size={18} />
                    View Public
                </Link>
            </div>

            {/* Profile Preview Card */}
            <div className="rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20 p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500/20 to-rose-500/20">
                            {formData.profileImage ? (
                                <img
                                    src={formData.profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-pink-400">
                                    <Camera size={32} />
                                </div>
                            )}
                        </div>
                        <span className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold ${gradeColors[adminFields.grade]}`}>
                            {adminFields.grade}
                        </span>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-semibold text-white">{formData.name}</h2>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {adminFields.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <DollarSign size={14} />
                                Rp {adminFields.dailyRate.toLocaleString('id-ID')}/day
                            </span>
                        </div>
                        <div className="mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${adminFields.status === 'PUBLISHED'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                {adminFields.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editable Fields */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 space-y-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <User size={20} className="text-pink-400" />
                    Personal Information
                </h2>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Profile Image URL
                    </label>
                    <input
                        type="text"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Display Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all"
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
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all resize-none"
                    />
                    <p className="text-gray-500 text-xs mt-1">{formData.bio.length}/500 characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Phone size={14} className="inline mr-1" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Instagram size={14} className="inline mr-1" />
                            Instagram Handle
                        </label>
                        <input
                            type="text"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Admin-Managed Fields (Read-Only) */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">Managed by Admin</h2>
                <p className="text-gray-400 text-sm">These fields are managed by HRP admin. Contact admin for changes.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    <div className="rounded-xl bg-white/5 p-4">
                        <p className="text-gray-500 text-xs mb-1">Grade</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${gradeColors[adminFields.grade]}`}>
                            Grade {adminFields.grade}
                        </span>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                        <p className="text-gray-500 text-xs mb-1">Location</p>
                        <p className="text-white font-medium">{adminFields.location}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                        <p className="text-gray-500 text-xs mb-1">Hourly Rate</p>
                        <p className="text-white font-medium">Rp {adminFields.hourlyRate.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                        <p className="text-gray-500 text-xs mb-1">Daily Rate</p>
                        <p className="text-white font-medium">Rp {adminFields.dailyRate.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
