"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, Camera } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email atau password salah");
                setIsLoading(false);
                return;
            }

            // Fetch session to determine redirect
            const sessionRes = await fetch("/api/auth/session");
            const session = await sessionRes.json();
            const role = session?.user?.role;

            if (role === "ADMIN") {
                router.push("/admin");
            } else if (role === "PHOTOGRAPHER") {
                router.push("/dashboard");
            } else if (role === "VENDOR") {
                router.push(callbackUrl === "/" ? "/vendor" : callbackUrl);
            } else {
                router.push("/");
            }

            router.refresh();
        } catch {
            setError("Terjadi kesalahan. Silakan coba lagi.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a12] flex">
            {/* Left - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#0a0a12] to-indigo-900/30" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col justify-center px-16">
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                            <Camera className="text-white" size={24} />
                        </div>
                        <div>
                            <span className="text-white font-bold text-2xl">HRP</span>
                            <span className="text-purple-400 text-xs block">Platform</span>
                        </div>
                    </Link>

                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Kelola Booking<br />
                        <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            Lebih Profesional
                        </span>
                    </h1>
                    <p className="text-white/50 text-lg max-w-md">
                        Akses layanan fotografer, videografer, equipment, dan transportasi terbaik untuk kebutuhan bisnis Anda.
                    </p>

                    <div className="mt-12 grid grid-cols-3 gap-4">
                        {[
                            { value: "1,200+", label: "Fotografer" },
                            { value: "500+", label: "Videografer" },
                            { value: "50+", label: "Kota" },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                                <p className="text-white font-bold text-xl">{stat.value}</p>
                                <p className="text-white/40 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <Camera className="text-white" size={20} />
                            </div>
                            <span className="text-white font-bold text-xl">HRP</span>
                        </Link>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">Masuk ke Akun</h2>
                    <p className="text-white/50 mb-8">
                        Belum punya akun?{" "}
                        <Link href={`/register${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                            Daftar sebagai Vendor
                        </Link>
                    </p>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm text-white/60 mb-2 font-medium">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="nama@perusahaan.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-white/60 mb-2 font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Masukkan password"
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    Masuk
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <p className="text-white/30 text-sm text-center">
                            Login sebagai Admin atau Photographer? Gunakan akun yang sudah diberikan oleh administrator.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
