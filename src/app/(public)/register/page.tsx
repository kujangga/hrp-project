"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, Camera,
    Building2, User, Phone, Briefcase
} from "lucide-react";

const businessTypes = [
    { value: "", label: "Pilih tipe bisnis (opsional)" },
    { value: "wedding_organizer", label: "Wedding Organizer" },
    { value: "production_house", label: "Production House" },
    { value: "agency", label: "Agency / Management" },
    { value: "corporate", label: "Corporate / Perusahaan" },
    { value: "freelance", label: "Freelance / Individu" },
];

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/vendor";

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        companyName: "",
        contactPerson: "",
        phone: "",
        businessType: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (formData.password.length < 6) {
            setError("Password minimal 6 karakter");
            setIsLoading(false);
            return;
        }

        try {
            // Register
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Gagal registrasi");
                setIsLoading(false);
                return;
            }

            // Auto-login after registration
            const signInResult = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (signInResult?.error) {
                // Registration success but login failed — redirect to login
                router.push("/login");
                return;
            }

            router.push(callbackUrl);
            router.refresh();
        } catch {
            setError("Terjadi kesalahan. Silakan coba lagi.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a12] flex">
            {/* Left - Decorative */}
            <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-[#0a0a12] to-purple-900/30" />
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

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
                        Daftar Sebagai<br />
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Vendor Partner
                        </span>
                    </h1>
                    <p className="text-white/50 text-lg max-w-md mb-10">
                        Bergabung dengan ratusan vendor yang sudah mempercayakan kebutuhan kreatif mereka kepada HRP.
                    </p>

                    <div className="space-y-4">
                        {[
                            { icon: "✓", text: "Akses ke 1,200+ fotografer & videografer profesional" },
                            { icon: "✓", text: "Booking equipment & transport dalam satu platform" },
                            { icon: "✓", text: "Dashboard untuk track semua order Anda" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-400 text-xs font-bold">{item.icon}</span>
                                </div>
                                <span className="text-white/60 text-sm">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right - Register Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-lg">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <Camera className="text-white" size={20} />
                            </div>
                            <span className="text-white font-bold text-xl">HRP</span>
                        </Link>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">Buat Akun Vendor</h2>
                    <p className="text-white/50 mb-8">
                        Sudah punya akun?{" "}
                        <Link href={`/login${callbackUrl !== "/vendor" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                            Masuk
                        </Link>
                    </p>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Row 1: Account Info */}
                        <div className="pb-4 border-b border-white/5">
                            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">Informasi Akun</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-white/60 mb-2">Nama Lengkap *</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            type="text" name="name" value={formData.name} onChange={handleChange}
                                            required placeholder="Nama lengkap Anda"
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            type="email" name="email" value={formData.email} onChange={handleChange}
                                            required placeholder="email@perusahaan.com"
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Password *</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                                            required placeholder="Min. 6 karakter"
                                            className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all text-sm"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Company Info */}
                        <div>
                            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">Informasi Perusahaan</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Nama Perusahaan *</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                                            required placeholder="PT / CV / Nama Bisnis"
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Contact Person *</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange}
                                            required placeholder="Nama PIC"
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">No. Telepon *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                            required placeholder="+62 812 3456 7890"
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Tipe Bisnis</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <select
                                            name="businessType" value={formData.businessType} onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all text-sm appearance-none"
                                        >
                                            {businessTypes.map((t) => (
                                                <option key={t.value} value={t.value} className="bg-[#1a1a2e] text-white">
                                                    {t.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
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
                                    Mendaftar...
                                </>
                            ) : (
                                <>
                                    Daftar Sekarang
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <p className="text-white/30 text-xs text-center">
                            Dengan mendaftar, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi kami.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
