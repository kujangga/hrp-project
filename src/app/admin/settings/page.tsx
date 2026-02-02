'use client';

import { useState } from 'react';
import {
    Settings,
    Bell,
    Shield,
    Globe,
    Database,
    Mail,
    Save,
    Loader2,
    Check,
    MapPin,
    Plus,
    Trash2,
    Edit2
} from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Mock settings data
    const [settings, setSettings] = useState({
        siteName: 'HRP Marketplace',
        siteDescription: 'Professional photographer and videographer marketplace',
        contactEmail: 'admin@hrp.id',
        supportPhone: '+62 21 1234 5678',
        defaultTaxRate: 11,
        bookingAutoConfirm: false,
        emailNotifications: true,
        smsNotifications: false,
    });

    // Mock locations data
    const [locations, setLocations] = useState([
        { id: '1', name: 'Jakarta', region: 'DKI Jakarta', isActive: true },
        { id: '2', name: 'Bali', region: 'Bali', isActive: true },
        { id: '3', name: 'Yogyakarta', region: 'DIY', isActive: true },
        { id: '4', name: 'Bandung', region: 'Jawa Barat', isActive: false },
    ]);

    const handleSave = async () => {
        setIsSaving(true);
        setSaved(false);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const tabs = [
        { id: 'general', name: 'General', icon: Settings },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'locations', name: 'Locations', icon: MapPin },
        { id: 'security', name: 'Security', icon: Shield },
    ];

    const toggleLocation = (id: string) => {
        setLocations(locations.map(loc =>
            loc.id === id ? { ...loc, isActive: !loc.isActive } : loc
        ));
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400 mt-1">Configure your platform settings</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Saving...
                        </>
                    ) : saved ? (
                        <>
                            <Check size={20} />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Tabs Sidebar */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                        ? 'bg-purple-500/20 text-purple-400'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon size={20} />
                                <span className="font-medium">{tab.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1">
                    <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Globe size={20} className="text-purple-400" />
                                    General Settings
                                </h2>

                                <div className="grid gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Site Name
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.siteName}
                                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Site Description
                                        </label>
                                        <textarea
                                            value={settings.siteDescription}
                                            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <Mail size={14} className="inline mr-1" />
                                                Contact Email
                                            </label>
                                            <input
                                                type="email"
                                                value={settings.contactEmail}
                                                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Support Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={settings.supportPhone}
                                                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Default Tax Rate (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.defaultTaxRate}
                                            onChange={(e) => setSettings({ ...settings, defaultTaxRate: Number(e.target.value) })}
                                            className="w-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.bookingAutoConfirm ? 'bg-purple-500' : 'bg-gray-700'}`}>
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.bookingAutoConfirm ? 'left-7' : 'left-1'}`} />
                                            </div>
                                            <span className="text-gray-300">Auto-confirm bookings</span>
                                        </label>
                                        <p className="text-gray-500 text-sm mt-1 ml-15">
                                            When enabled, bookings will be confirmed automatically without admin review.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Settings */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Bell size={20} className="text-purple-400" />
                                    Notification Settings
                                </h2>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <div>
                                                <p className="text-white font-medium">Email Notifications</p>
                                                <p className="text-gray-500 text-sm">Receive booking notifications via email</p>
                                            </div>
                                            <div
                                                onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                                                className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${settings.emailNotifications ? 'bg-purple-500' : 'bg-gray-700'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.emailNotifications ? 'left-7' : 'left-1'}`} />
                                            </div>
                                        </label>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <div>
                                                <p className="text-white font-medium">SMS Notifications</p>
                                                <p className="text-gray-500 text-sm">Receive booking notifications via SMS</p>
                                            </div>
                                            <div
                                                onClick={() => setSettings({ ...settings, smsNotifications: !settings.smsNotifications })}
                                                className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${settings.smsNotifications ? 'bg-purple-500' : 'bg-gray-700'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.smsNotifications ? 'left-7' : 'left-1'}`} />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Locations Settings */}
                        {activeTab === 'locations' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <MapPin size={20} className="text-purple-400" />
                                        Service Locations
                                    </h2>
                                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors">
                                        <Plus size={18} />
                                        Add Location
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {locations.map(location => (
                                        <div
                                            key={location.id}
                                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full ${location.isActive ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                                                <div>
                                                    <p className="text-white font-medium">{location.name}</p>
                                                    <p className="text-gray-500 text-sm">{location.region}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleLocation(location.id)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.isActive
                                                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                        }`}
                                                >
                                                    {location.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                                <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Shield size={20} className="text-purple-400" />
                                    Security Settings
                                </h2>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <h3 className="text-white font-medium mb-2">Change Password</h3>
                                        <p className="text-gray-500 text-sm mb-4">Update your admin account password</p>
                                        <div className="grid gap-4 max-w-md">
                                            <input
                                                type="password"
                                                placeholder="Current password"
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                            />
                                            <input
                                                type="password"
                                                placeholder="New password"
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm new password"
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                            />
                                            <button className="w-fit px-5 py-2.5 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors font-medium">
                                                Update Password
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <h3 className="text-white font-medium mb-2">Database</h3>
                                        <p className="text-gray-500 text-sm mb-4">Manage your application database</p>
                                        <div className="flex flex-wrap gap-3">
                                            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors">
                                                <Database size={16} />
                                                Backup Database
                                            </button>
                                            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors">
                                                <Database size={16} />
                                                Clear Cache
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
