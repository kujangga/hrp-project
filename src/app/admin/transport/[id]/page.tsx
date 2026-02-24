'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Truck,
    Loader2,
    CheckCircle,
    Trash2,
    AlertTriangle
} from 'lucide-react';

interface Transport {
    id: string;
    name: string;
    description: string | null;
    vehicleType: string;
    capacity: number;
    dailyRate: number;
    image: string | null;
    features: string | null;
    status: string;
    locationId: string | null;
}

export default function EditTransportPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

    useEffect(() => {
        async function fetchTransport() {
            try {
                const response = await fetch(`/api/admin/transport/${resolvedParams.id}`);
                if (!response.ok) throw new Error('Not found');
                const data: Transport = await response.json();
                setFormData({
                    name: data.name,
                    description: data.description || '',
                    vehicleType: data.vehicleType,
                    capacity: data.capacity.toString(),
                    dailyRate: data.dailyRate.toString(),
                    image: data.image || '',
                    features: data.features || '',
                    status: data.status
                });
            } catch {
                setError('Vehicle not found');
            } finally {
                setIsLoading(false);
            }
        }
        fetchTransport();
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
            const response = await fetch(`/api/admin/transport/${resolvedParams.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    dailyRate: parseFloat(formData.dailyRate) || 0,
                    capacity: parseInt(formData.capacity) || 4,
                })
            });

            if (!response.ok) throw new Error('Failed to update');

            router.push('/admin/transport');
            router.refresh();
        } catch {
            setError('Failed to update vehicle. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/transport/${resolvedParams.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete');

            router.push('/admin/transport');
            router.refresh();
        } catch {
            setError('Failed to delete vehicle. Please try again.');
            setShowDeleteConfirm(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const vehicleTypes = [
        { value: 'car', label: 'Car' },
        { value: 'van', label: 'Van' },
        { value: 'suv', label: 'SUV' },
        { value: 'minibus', label: 'Minibus' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-amber-400" size={32} />
            </div>
        );
    }

    if (error && !formData.name) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="p-8 text-center">
                    <AlertTriangle className="mx-auto text-amber-400 mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-white mb-2">Vehicle Not Found</h2>
                    <p className="text-gray-400 mb-6">The vehicle you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/admin/transport"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium"
                    >
                        Back to Transport
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
                                <h3 className="text-lg font-semibold text-white">Delete Vehicle</h3>
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
                        href="/admin/transport"
                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-white">Edit Vehicle</h1>
                        <p className="text-gray-400 mt-1">Update vehicle details</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete vehicle"
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

                {/* Image Section */}
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Vehicle Image</h2>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border-2 border-dashed border-white/20 overflow-hidden">
                            {formData.image ? (
                                <img src={formData.image} alt="Vehicle" className="w-full h-full object-cover" />
                            ) : (
                                <Truck className="text-amber-400" size={32} />
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="Enter image URL"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                            />
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
                            Vehicle Type
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
                                Passenger Capacity
                            </label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
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
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
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
