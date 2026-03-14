"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGES = [
    {
        src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop",
        name: "Ubud Rice Terrace",
        location: "Bali, Indonesia",
        rotate: -6,
    },
    {
        src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop",
        name: "Fushimi Inari",
        location: "Kyoto, Japan",
        rotate: 3,
    },
    {
        src: "https://images.unsplash.com/photo-1705905343745-6d901a93e946?q=80&w=600&auto=format&fit=crop",
        name: "Borobudur Temple",
        location: "Magelang, Indonesia",
        rotate: -3,
    },
    {
        src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
        name: "Eiffel Tower",
        location: "Paris, France",
        rotate: 5,
    },
    {
        src: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop",
        name: "Manhattan Skyline",
        location: "New York, USA",
        rotate: -4,
    },
];

const AVATARS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
];

export default function HeroSection() {
    const [expertCount, setExpertCount] = useState(1240);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    useEffect(() => {
        const interval = setInterval(() => {
            setExpertCount(prev => prev + Math.floor(Math.random() * 2));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative min-h-[90vh] flex items-center overflow-hidden bg-dark-900">
            {/* Cinematic Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/90 to-dark-900/60 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4')] bg-cover bg-center opacity-20 blur-sm" />
                <div className="hero-glow top-0 left-0" />
                <div className="hero-glow bottom-0 right-0 !bg-accent-cyan/10" />
            </div>

            <div className="section-container relative z-30 w-full py-20 lg:py-0">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                        >
                            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                            <span className="text-xs font-bold tracking-widest text-primary-200 uppercase">
                                Talent • Crew • Logistics
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
                        >
                            Production <br />
                            <span className="gradient-text">Redefined.</span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-white/60 max-w-lg leading-relaxed"
                        >
                            The premium marketplace for booking top-tier photographers, videographers, equipment, and production logistics. Verified professionals, instant booking.
                        </motion.p>


                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center gap-6 pt-4"
                        >
                            <div className="flex items-center">
                                <div className="flex -space-x-3">
                                    {AVATARS.map((src, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-dark-900 relative overflow-hidden">
                                            <Image src={src} alt="User" fill className="object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-dark-900 bg-primary-600 flex items-center justify-center text-xs font-bold text-white relative z-10">
                                        +2k
                                    </div>
                                </div>
                                <div className="ml-4 flex flex-col">
                                    <span className="text-2xl font-bold text-white leading-none">
                                        {expertCount.toLocaleString()}+
                                    </span>
                                    <span className="text-xs text-white/50 uppercase tracking-wide font-medium">Experts Ready</span>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-white/10 hidden sm:block" />

                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                <ShieldCheck className="w-4 h-4 text-green-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-white/40 leading-none">Guarantee</span>
                                    <span className="text-xs font-bold text-white leading-none">24h Replacement</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Scattered Gallery */}
                    {/* Right Column: Stacked Landscape Gallery */}
                    <div className="relative h-[600px] hidden lg:block perspective-1000 w-full z-20">
                        {HERO_IMAGES.map((img, index) => {
                            // Define positioning for specific overlapping "messy desk" look
                            const stackPositions = [
                                { top: "0%", left: "0%", rotate: -6 },       // Top Left
                                { top: "10%", right: "5%", rotate: 6 },      // Top Right
                                { top: "35%", left: "20%", rotate: -3 },     // Center-ish
                                { bottom: "15%", left: "5%", rotate: 4 },    // Bottom Left
                                { bottom: "5%", right: "10%", rotate: -5 },  // Bottom Right
                            ][index];

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8, y: 100 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{
                                        delay: 0.4 + (index * 0.1),
                                        duration: 0.8,
                                        type: "spring"
                                    }}
                                    className="absolute w-[300px] h-[200px]" // Fixed Landscape Size
                                    style={{
                                        zIndex: index + 10, // Base z-index
                                        top: stackPositions.top,
                                        left: stackPositions.left,
                                        right: stackPositions.right,
                                        bottom: stackPositions.bottom,
                                    }}
                                    whileHover={{
                                        scale: 1.15,
                                        zIndex: 100, // Autofocus: Bring to front
                                        rotate: 0,   // Straighten up
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <motion.div
                                        animate={{ rotate: stackPositions.rotate }}
                                        whileHover={{ rotate: 0 }} // Sync rotation removal
                                        className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative cursor-pointer group bg-dark-800"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />

                                        <Image
                                            src={img.src}
                                            alt={img.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />

                                        {/* Label Badge */}
                                        <div className="absolute bottom-3 left-3 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="bg-accent-cyan/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg flex flex-col">
                                                <span className="text-xs font-bold text-dark-900 leading-tight">
                                                    {img.name}
                                                </span>
                                                <span className="text-[10px] font-medium text-dark-800/80 leading-tight">
                                                    {img.location}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}

                        {/* Decorative Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px] -z-10 animate-pulse" />
                    </div>
                </div>
            </div>
            {/* End of section container */}

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto text-dark-900">
                    <path fill="#0f0f0f" fillOpacity="0" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    {/* Since body is dark, let's make the wave fade to the section color below, but for now just transparent to blend */}
                </svg>
            </div>
        </div >
    );
}
