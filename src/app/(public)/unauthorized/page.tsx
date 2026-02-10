"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center px-6">
            <div className="max-w-md text-center">
                <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-10 h-10 text-red-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">Akses Ditolak</h1>
                <p className="text-white/50 mb-2">
                    Anda tidak memiliki izin untuk mengakses halaman ini.
                </p>
                <p className="text-white/40 text-sm mb-8">
                    Hanya akun dengan role yang sesuai yang dapat mengakses area ini.
                    Jika Anda ingin melakukan booking, silakan login sebagai Vendor.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Kembali ke Home
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-medium hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
