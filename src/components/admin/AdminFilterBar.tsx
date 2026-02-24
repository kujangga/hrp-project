'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FilterOption {
    label: string;
    value: string;
}

interface AdminFilterBarProps {
    searchPlaceholder: string;
    filterOptions: FilterOption[];
    filterParamName: string;
    currentFilter?: string;
    currentSearch?: string;
    accentColor?: string; // e.g. 'purple', 'pink', 'cyan', 'amber'
}

export default function AdminFilterBar({
    searchPlaceholder,
    filterOptions,
    filterParamName,
    currentFilter,
    currentSearch,
    accentColor = 'purple',
}: AdminFilterBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(currentSearch || '');

    useEffect(() => {
        setSearchValue(currentSearch || '');
    }, [currentSearch]);

    const colorMap: Record<string, { active: string; focus: string }> = {
        purple: { active: 'bg-purple-500/20 text-purple-400 border-purple-500/30', focus: 'focus:border-purple-500/50' },
        pink: { active: 'bg-pink-500/20 text-pink-400 border-pink-500/30', focus: 'focus:border-pink-500/50' },
        cyan: { active: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', focus: 'focus:border-cyan-500/50' },
        amber: { active: 'bg-amber-500/20 text-amber-400 border-amber-500/30', focus: 'focus:border-amber-500/50' },
    };

    const colors = colorMap[accentColor] || colorMap.purple;

    const updateParams = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams('search', searchValue || null);
    };

    const clearAll = () => {
        router.push('?');
        setSearchValue('');
    };

    const hasFilters = currentFilter || currentSearch;

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={searchPlaceholder}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none ${colors.focus} transition-all`}
                />
            </form>

            {/* Filter Pills */}
            <div className="flex gap-2 flex-wrap items-center">
                {filterOptions.map((opt) => {
                    const isActive = (!currentFilter && opt.value === '') || currentFilter === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => updateParams(filterParamName, opt.value || null)}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                                isActive
                                    ? colors.active
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {opt.label}
                        </button>
                    );
                })}

                {hasFilters && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors ml-1"
                    >
                        <X size={16} />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
