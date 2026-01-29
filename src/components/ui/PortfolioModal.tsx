"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface PortfolioItem {
    id: string;
    imageUrl: string;
    videoUrl?: string | null;
    caption?: string | null;
    order: number;
}

interface PortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
    talentName: string;
    type: "photographer" | "videographer";
    portfolio: PortfolioItem[];
}

export default function PortfolioModal({
    isOpen,
    onClose,
    talentName,
    type,
    portfolio,
}: PortfolioModalProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    if (!isOpen) return null;

    const sortedPortfolio = [...portfolio].sort((a, b) => a.order - b.order);

    const handleImageClick = (index: number) => {
        setSelectedIndex(index);
        setIsLightboxOpen(true);
    };

    const handleVideoClick = (videoUrl: string) => {
        window.open(videoUrl, "_blank", "noopener,noreferrer");
    };

    const handlePrev = () => {
        setSelectedIndex((prev) =>
            prev === 0 ? sortedPortfolio.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setSelectedIndex((prev) =>
            prev === sortedPortfolio.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-10 lg:inset-20 z-50 flex items-center justify-center"
                    >
                        <div className="w-full max-w-4xl max-h-full overflow-y-auto bg-dark-800 rounded-2xl border border-white/10 shadow-2xl">
                            {/* Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-dark-800/95 backdrop-blur-sm">
                                <div>
                                    <h2 className="text-2xl font-bold">{talentName}</h2>
                                    <p className="text-white/60 text-sm">
                                        {type === "photographer" ? "Photo Portfolio" : "Video Portfolio"}
                                        <span className="text-white/40 ml-2">
                                            ({sortedPortfolio.length} {type === "photographer" ? "images" : "videos"})
                                        </span>
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Portfolio Grid */}
                            <div className="p-6">
                                {sortedPortfolio.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {sortedPortfolio.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                                                onClick={() =>
                                                    type === "videographer" && item.videoUrl
                                                        ? handleVideoClick(item.videoUrl)
                                                        : handleImageClick(index)
                                                }
                                            >
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.caption || `Portfolio ${index + 1}`}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />

                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                                {/* Video Play Button */}
                                                {type === "videographer" && item.videoUrl && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary-500/80 transition-colors">
                                                            <Play className="w-6 h-6 text-white fill-white ml-1" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Caption */}
                                                {item.caption && (
                                                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-sm font-medium text-white truncate">
                                                            {item.caption}
                                                        </p>
                                                        {type === "videographer" && item.videoUrl && (
                                                            <div className="flex items-center gap-1 text-xs text-white/60 mt-1">
                                                                <ExternalLink className="w-3 h-3" />
                                                                Click to watch
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-white/50">No portfolio items yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Lightbox for full-size image view (photographers only) */}
                    {isLightboxOpen && type === "photographer" && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/95 z-[60]"
                                onClick={() => setIsLightboxOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-4 z-[60] flex items-center justify-center"
                            >
                                <button
                                    onClick={() => setIsLightboxOpen(false)}
                                    className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors z-10"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {/* Navigation Arrows */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrev();
                                    }}
                                    className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNext();
                                    }}
                                    className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Main Image */}
                                <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
                                    <Image
                                        src={sortedPortfolio[selectedIndex].imageUrl}
                                        alt={sortedPortfolio[selectedIndex].caption || "Portfolio image"}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Caption */}
                                {sortedPortfolio[selectedIndex].caption && (
                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm">
                                        <p className="text-white font-medium">
                                            {sortedPortfolio[selectedIndex].caption}
                                        </p>
                                        <p className="text-white/50 text-sm text-center">
                                            {selectedIndex + 1} / {sortedPortfolio.length}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </>
                    )}
                </>
            )}
        </AnimatePresence>
    );
}
