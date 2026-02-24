'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Truck,
    Loader2,
    CheckCircle
} from 'lucide-react';

export default function NewTransportPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        vehicleType: 'car',
        capacity: '4',
        dailyRate: '',
        image: '',
        features: '',
        status: 'AVAILABLE'
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
            const response = await fetch('/api/admin/transport', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    dailyRate: parseFloat(formData.dailyRate) || 0,
                    capacity: parseInt(formData.capacity) || 4,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create vehicle');
            }

            router.push('/admin/transport');
            router.refresh();
        } catch {
            setError('Failed to create vehicle. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const vehicleTypes = [
        { value: 'car', label: 'Car' },
        { value: 'van', label: 'Van' },
        { value: 'suv', label: 'SUV' },
        { value: 'minibus', label: 'Minibus' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/transport"
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Add New Vehicle</h1>
                    <p className="text-gray-400 mt-1">Add a vehicle to your fleet</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        {error}
                    </div>
                )}

                {/* Image Section */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Vehicle Image</h2>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border-2 border-dashed border-white/20">
                            <Truck className="text-amber-400" size={32} />
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="Enter image URL or upload"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                            />
                            <p className="text-gray-500 text-sm mt-2">Recommended: 800x500px, JPG or PNG</p>
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-white">Basic Information</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Vehicle Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Toyota HiAce Commuter"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Brief description of the vehicle..."
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Features
                        </label>
                        <input
                            type="text"
                            name="features"
                            value={formData.features}
                            onChange={handleChange}
                            placeholder='e.g. AC, WiFi, USB Charging, GPS'
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                        />
                        <p className="text-gray-500 text-sm mt-1">Comma-separated list of features</p>
                    </div>
                </div>

                {/* Vehicle Type & Specs */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-white">Vehicle Type & Specs</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Vehicle Type <span className="text-red-400">*</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {vehicleTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, vehicleType: type.value }))}
                                    className={`
                                        px-5 py-3 rounded-xl font-medium transition-all
                                        ${formData.vehicleType === type.value
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }
                                    `}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Passenger Capacity <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                min="1"
                                placeholder="e.g. 6"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
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
                                placeholder="e.g. 800000"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Availability</h2>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, status: 'AVAILABLE' }))}
                            className={`flex-1 py-4 rounded-xl font-medium transition-all ${formData.status === 'AVAILABLE'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            ✅ Available
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, status: 'UNAVAILABLE' }))}
                            className={`flex-1 py-4 rounded-xl font-medium transition-all ${formData.status === 'UNAVAILABLE'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            🚫 Unavailable
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Link
                        href="/admin/transport"
                        className="px-6 py-3 rounded-xl text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                Create Vehicle
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
