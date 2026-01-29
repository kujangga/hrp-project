'use client';

import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Check,
    X,
    Calendar as CalendarIcon,
    Info
} from 'lucide-react';

interface DayStatus {
    date: Date;
    isAvailable: boolean;
    isBooked: boolean;
    isPast: boolean;
}

export default function AvailabilityPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [availability, setAvailability] = useState<Record<string, { available: boolean; booked: boolean }>>({
        // Mock data - some dates marked as unavailable or booked
        '2026-02-05': { available: false, booked: false },
        '2026-02-06': { available: false, booked: false },
        '2026-02-10': { available: true, booked: true },
        '2026-02-15': { available: true, booked: true },
        '2026-02-20': { available: false, booked: false },
    });

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: DayStatus[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Add empty days for padding
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push({ date: new Date(0), isAvailable: false, isBooked: false, isPast: true });
        }

        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = date.toISOString().split('T')[0];
            const status = availability[dateKey] || { available: true, booked: false };

            days.push({
                date,
                isAvailable: status.available,
                isBooked: status.booked,
                isPast: date < today
            });
        }

        return days;
    };

    const toggleAvailability = (date: Date) => {
        const dateKey = date.toISOString().split('T')[0];
        const currentStatus = availability[dateKey] || { available: true, booked: false };

        // Can't change booked dates
        if (currentStatus.booked) return;

        setAvailability({
            ...availability,
            [dateKey]: { ...currentStatus, available: !currentStatus.available }
        });
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const availableDays = Object.values(availability).filter(d => d.available && !d.booked).length;
    const bookedDays = Object.values(availability).filter(d => d.booked).length;
    const blockedDays = Object.values(availability).filter(d => !d.available && !d.booked).length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Availability</h1>
                <p className="text-gray-400 mt-1">Manage your available dates for bookings</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-500/30 border border-emerald-500" />
                    <span className="text-gray-400 text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-500/30 border border-purple-500" />
                    <span className="text-gray-400 text-sm">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500/30 border border-red-500" />
                    <span className="text-gray-400 text-sm">Blocked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-700" />
                    <span className="text-gray-400 text-sm">Past Date</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-400">{availableDays}</p>
                    <p className="text-emerald-400/60 text-sm">Available Days</p>
                </div>
                <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">{bookedDays}</p>
                    <p className="text-purple-400/60 text-sm">Booked</p>
                </div>
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center">
                    <p className="text-2xl font-bold text-red-400">{blockedDays}</p>
                    <p className="text-red-400/60 text-sm">Blocked</p>
                </div>
            </div>

            {/* Calendar */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-semibold text-white">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                        onClick={goToNextMonth}
                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-gray-500 text-sm font-medium py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day, index) => {
                        if (day.date.getTime() === 0) {
                            // Empty padding cell
                            return <div key={`empty-${index}`} className="aspect-square" />;
                        }

                        const isToday = day.date.toDateString() === new Date().toDateString();

                        return (
                            <button
                                key={day.date.toISOString()}
                                onClick={() => !day.isPast && !day.isBooked && toggleAvailability(day.date)}
                                disabled={day.isPast || day.isBooked}
                                className={`
                                    aspect-square rounded-xl flex flex-col items-center justify-center
                                    transition-all relative group
                                    ${day.isPast
                                        ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                                        : day.isBooked
                                            ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400 cursor-not-allowed'
                                            : day.isAvailable
                                                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30'
                                                : 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30'
                                    }
                                    ${isToday ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-[#0a0a12]' : ''}
                                `}
                            >
                                <span className="text-sm font-medium">{day.date.getDate()}</span>
                                {day.isBooked && (
                                    <CalendarIcon size={12} className="absolute bottom-1" />
                                )}
                                {!day.isPast && !day.isBooked && (
                                    <span className="absolute bottom-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {day.isAvailable ? <X size={12} /> : <Check size={12} />}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Instructions */}
            <div className="rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/5 border border-pink-500/20 p-4">
                <div className="flex items-start gap-3">
                    <Info className="text-pink-400 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <h3 className="text-white font-medium mb-1">How to use</h3>
                        <ul className="text-gray-400 text-sm space-y-1">
                            <li>• Click on a date to toggle between Available and Blocked</li>
                            <li>• Booked dates cannot be changed (shown in purple)</li>
                            <li>• Past dates are automatically blocked</li>
                            <li>• Clients can only book on dates marked as Available</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
                <button className="px-5 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-medium hover:bg-emerald-500/30 transition-colors">
                    Mark All Available
                </button>
                <button className="px-5 py-3 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors">
                    Block Entire Month
                </button>
            </div>
        </div>
    );
}
