'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Plus,
    Upload,
    Trash2,
    GripVertical,
    Camera,
    X,
    Loader2,
} from 'lucide-react';

interface PortfolioItem {
    id: string;
    imageUrl: string;
    caption: string | null;
    order: number;
}

export default function PortfolioPage() {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newItem, setNewItem] = useState({ imageUrl: '', caption: '' });
    const [isUploading, setIsUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const res = await fetch('/api/talent/portfolio');
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch {
            // ignore
        }
        setLoading(false);
    };

    const deleteItem = async (id: string) => {
        if (!confirm('Are you sure you want to delete this portfolio item?')) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/talent/portfolio/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setItems(items.filter(item => item.id !== id));
            }
        } catch {
            // ignore
        }
        setDeletingId(null);
    };

    const handleUpload = async () => {
        if (!newItem.imageUrl) return;

        setIsUploading(true);

        try {
            const res = await fetch('/api/talent/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageUrl: newItem.imageUrl,
                    caption: newItem.caption || 'New Photo',
                }),
            });

            if (res.ok) {
                const created = await res.json();
                setItems([...items, created]);
                setNewItem({ imageUrl: '', caption: '' });
                setShowUploadModal(false);
            }
        } catch {
            // ignore
        }
        setIsUploading(false);
    };

    const maxItems = 5;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-6 max-w-lg w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white">Add Portfolio Item</h3>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Image URL <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newItem.imageUrl}
                                    onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all"
                                />
                                <p className="text-gray-500 text-xs mt-2">
                                    Enter a direct image URL (Unsplash, Cloudinary, etc.)
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Caption
                                </label>
                                <input
                                    type="text"
                                    value={newItem.caption}
                                    onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
                                    placeholder="e.g. Wedding at Bali"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all"
                                />
                            </div>

                            {newItem.imageUrl && (
                                <div className="rounded-xl overflow-hidden border border-white/10">
                                    <img
                                        src={newItem.imageUrl}
                                        alt="Preview"
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+URL';
                                        }}
                                    />
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={!newItem.imageUrl || isUploading}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium hover:from-pink-600 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={18} />
                                            Add to Portfolio
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Portfolio</h1>
                    <p className="text-gray-400 mt-1">Showcase your best work to attract clients</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    disabled={items.length >= maxItems}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={20} />
                    Add Photo
                </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                    <p className="text-2xl font-bold text-white">{items.length}/{maxItems}</p>
                    <p className="text-gray-500 text-sm">Total Items</p>
                </div>
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">{maxItems - items.length}</p>
                    <p className="text-amber-400/60 text-sm">Slots Available</p>
                </div>
            </div>

            {/* Info Banner */}
            {items.length < maxItems && (
                <div className="rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/5 border border-pink-500/20 p-4">
                    <p className="text-pink-300 text-sm">
                        💡 You can add up to {maxItems} portfolio items. {maxItems - items.length} slot(s) remaining.
                    </p>
                </div>
            )}

            {/* Portfolio Grid */}
            {items.length === 0 ? (
                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-12 text-center">
                    <Camera className="mx-auto text-gray-600 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-white mb-2">No Portfolio Items Yet</h3>
                    <p className="text-gray-400 mb-6">Upload your best work to showcase to potential clients.</p>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium"
                    >
                        <Plus size={20} />
                        Add Your First Photo
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3]">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.caption || 'Portfolio'}
                                    fill
                                    className="object-cover"
                                />

                                {/* Drag Handle */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="p-2 rounded-lg bg-black/50 text-white cursor-grab">
                                        <GripVertical size={16} />
                                    </div>
                                </div>

                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        disabled={deletingId === item.id}
                                        className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                        title="Delete"
                                    >
                                        {deletingId === item.id ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Caption */}
                            <div className="p-4">
                                <p className="text-white font-medium truncate">{item.caption || 'Untitled'}</p>
                                <p className="text-gray-500 text-sm">Order: {item.order + 1}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tips */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="text-white font-medium mb-2">Portfolio Tips</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Use high-quality images (recommended: 1920x1280px or larger)</li>
                    <li>• Showcase variety - different styles, settings, and subjects</li>
                    <li>• Your portfolio is visible to all clients on the platform</li>
                    <li>• Maximum {maxItems} portfolio items per photographer</li>
                </ul>
            </div>
        </div>
    );
}
