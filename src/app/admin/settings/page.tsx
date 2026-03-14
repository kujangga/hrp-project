'use client';

import { useState, useEffect } from 'react';
import {
    Settings,
    Bell,
    Shield,
    MapPin,
    Save,
    Loader2,
    Check,
    Plus,
    Trash2,
    X,
    Globe,
    Mail,
    Database
} from 'lucide-react';

interface Location {
    id: string;
    name: string;
    type: string;
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('locations');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Locations state (database-backed)
    const [locations, setLocations] = useState<Location[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(true);
    const [newLocationName, setNewLocationName] = useState('');
    const [addingLocation, setAddingLocation] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // General settings
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

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    // Fetch locations and settings from API
    useEffect(() => {
        fetchLocations();
        fetchSettings();
    }, []);

    const fetchLocations = async () => {
        try {
            const res = await fetch('/api/admin/locations');
            if (res.ok) {
                const data = await res.json();
                setLocations(data);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            setLoadingLocations(false);
        }
    };

    const handleAddLocation = async () => {
        if (!newLocationName.trim()) return;
        setAddingLocation(true);
        try {
            const res = await fetch('/api/admin/locations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newLocationName.trim() })
            });
            if (res.ok) {
                await fetchLocations();
                setNewLocationName('');
                setShowAddForm(false);
            }
        } catch (error) {
            console.error('Error adding location:', error);
        } finally {
            setAddingLocation(false);
        }
    };

    const handleDeleteLocation = async (id: string) => {
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/locations/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLocations(locations.filter(loc => loc.id !== id));
            }
        } catch (error) {
            console.error('Error deleting location:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaveGeneral = async () => {
        setIsSaving(true);
        setSaved(false);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch {
            // use defaults
        }
    };

    const handleChangePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (!passwordData.currentPassword || !passwordData.newPassword) {
            setPasswordError('Please fill in all password fields');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        setChangingPassword(true);
        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setPasswordError(data.error || 'Failed to change password');
            } else {
                setPasswordSuccess('Password updated successfully!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setPasswordSuccess(''), 5000);
            }
        } catch {
            setPasswordError('An error occurred. Please try again.');
        } finally {
            setChangingPassword(false);
        }
    };

    const tabs = [
        { id: 'locations', name: 'Locations', icon: MapPin },
        { id: 'general', name: 'General', icon: Settings },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Security', icon: Shield },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400 mt-1">Configure your platform settings</p>
                </div>
                {activeTab !== 'locations' && (
                    <button
                        onClick={handleSaveGeneral}
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
                )}
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
                        {/* Locations Settings (database-backed) */}
                        {activeTab === 'locations' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <MapPin size={20} className="text-purple-400" />
                                        Service Locations
                                    </h2>
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                                    >
                                        <Plus size={18} />
                                        Add Location
                                    </button>
                                </div>

                                {/* Add Location Form */}
                                {showAddForm && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                        <input
                                            type="text"
                                            value={newLocationName}
                                            onChange={(e) => setNewLocationName(e.target.value)}
                                            placeholder="City name, e.g. Makassar"
                                            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleAddLocation}
                                            disabled={addingLocation || !newLocationName.trim()}
                                            className="px-4 py-2.5 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {addingLocation ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                            Add
                                        </button>
                                        <button
                                            onClick={() => { setShowAddForm(false); setNewLocationName(''); }}
                                            className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}

                                {/* Locations List */}
                                {loadingLocations ? (
                                    <div className="py-8 text-center">
                                        <Loader2 className="animate-spin text-purple-400 mx-auto" size={24} />
                                    </div>
                                ) : locations.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <MapPin className="mx-auto text-gray-600 mb-3" size={32} />
                                        <p className="text-gray-400">No locations yet. Add your first city.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {locations.map(location => (
                                            <div
                                                key={location.id}
                                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                                    <p className="text-white font-medium">{location.name}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteLocation(location.id)}
                                                    disabled={deletingId === location.id}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                                >
                                                    {deletingId === location.id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <p className="text-gray-500 text-sm">
                                    Locations are used to tag photographers, videographers, equipment, and transport.
                                </p>
                            </div>
                        )}

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
                                            <div
                                                onClick={() => setSettings({ ...settings, bookingAutoConfirm: !settings.bookingAutoConfirm })}
                                                className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${settings.bookingAutoConfirm ? 'bg-purple-500' : 'bg-gray-700'}`}
                                            >
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

                                        {passwordError && (
                                            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                                {passwordError}
                                            </div>
                                        )}
                                        {passwordSuccess && (
                                            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                                                {passwordSuccess}
                                            </div>
                                        )}

                                        <div className="grid gap-4 max-w-md">
                                            <input
                                                type="password"
                                                placeholder="Current password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                            />
                                            <input
                                                type="password"
                                                placeholder="New password (min. 6 characters)"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                            />
                                            <button
                                                onClick={handleChangePassword}
                                                disabled={changingPassword}
                                                className="w-fit px-5 py-2.5 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {changingPassword ? (
                                                    <><Loader2 size={16} className="animate-spin" /> Updating...</>
                                                ) : (
                                                    'Update Password'
                                                )}
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
