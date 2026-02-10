"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Building2, Mail, Save, Loader2, CheckCircle } from "lucide-react";

interface VendorProfile {
    companyName: string;
    contactPerson: string;
    phone: string;
    address: string;
    city: string;
    businessType: string;
    npwp: string;
}

const businessTypes = [
    { value: "", label: "Pilih tipe bisnis" },
    { value: "wedding_organizer", label: "Wedding Organizer" },
    { value: "production_house", label: "Production House" },
    { value: "agency", label: "Agency / Management" },
    { value: "corporate", label: "Corporate / Perusahaan" },
    { value: "freelance", label: "Freelance / Individu" },
];

export default function VendorProfilePage() {
    const { data: session } = useSession();
    const user = session?.user as { name?: string; email?: string } | undefined;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [formData, setFormData] = useState<VendorProfile>({
        companyName: "",
        contactPerson: "",
        phone: "",
        address: "",
        city: "",
        businessType: "",
        npwp: "",
    });

    useEffect(() => {
        fetch("/api/vendor/profile")
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    setFormData({
                        companyName: data.companyName || "",
                        contactPerson: data.contactPerson || "",
                        phone: data.phone || "",
                        address: data.address || "",
                        city: data.city || "",
                        businessType: data.businessType || "",
                        npwp: data.npwp || "",
                    });
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setSaved(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch("/api/vendor/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch {
            // ignore
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64 text-white/30"><Loader2 className="w-6 h-6 animate-spin" /></div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Profile</h1>
                <p className="text-white/50 text-sm mt-1">Kelola informasi perusahaan dan kontak Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                {/* Account Info */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-white/40" /> Informasi Akun
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-white/50 mb-1.5">Nama</label>
                            <input type="text" value={user?.name || ""} readOnly className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/50 text-sm cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm text-white/50 mb-1.5">Email</label>
                            <input type="text" value={user?.email || ""} readOnly className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/50 text-sm cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                {/* Company Info */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-white/40" /> Informasi Perusahaan
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-white/50 mb-1.5">Nama Perusahaan *</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                                placeholder="PT / CV / Nama Bisnis" />
                        </div>
                        <div>
                            <label className="block text-sm text-white/50 mb-1.5">Contact Person *</label>
                            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                                placeholder="Nama PIC" />
                        </div>
                        <div>
                            <label className="block text-sm text-white/50 mb-1.5">No. Telepon *</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                                placeholder="+62 812 3456 7890" />
                        </div>
                        <div>
                            <label className="block text-sm text-white/50 mb-1.5">Tipe Bisnis</label>
                            <select name="businessType" value={formData.businessType} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 appearance-none">
                                {businessTypes.map(t => <option key={t.value} value={t.value} className="bg-[#1a1a2e]">{t.label}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-white/50 mb-1.5">Alamat</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows={2}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
                                placeholder="Alamat lengkap" />
                        </div>
                        <div>
                            <label className="block text-sm text-white/50 mb-1.5">Kota</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                                placeholder="Kota" />
                        </div>
                        <div>
                            <label className="block text-sm text-white/50 mb-1.5">NPWP</label>
                            <input type="text" name="npwp" value={formData.npwp} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                                placeholder="Nomor NPWP" />
                        </div>
                    </div>
                </div>

                {/* Save */}
                <div className="flex items-center gap-4">
                    <button type="submit" disabled={saving}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-500/20">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                    {saved && (
                        <span className="text-emerald-400 text-sm flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Tersimpan
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}
