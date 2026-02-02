"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface FilterBarProps {
    categories: string[];
    categoryCounts: Record<string, number>;
    currentCategory?: string;
    currentSearch?: string;
}

const categoryLabels: Record<string, string> = {
    camera: "📷 Cameras",
    lens: "🔭 Lenses",
    lighting: "💡 Lighting",
    drone: "🚁 Drones",
    accessory: "🎒 Accessories",
};

export default function FilterBar({
    categories,
    categoryCounts,
    currentCategory,
    currentSearch,
}: FilterBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(currentSearch || "");

    useEffect(() => {
        setSearchValue(currentSearch || "");
    }, [currentSearch]);

    const updateFilters = (key: string, value: string | null) => {
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
        updateFilters("search", searchValue || null);
    };

    const clearFilters = () => {
        router.push("?");
        setSearchValue("");
    };

    const hasFilters = currentCategory || currentSearch;

    return (
        <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search equipment by name, brand, or type..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="input-field"
                />
            </form>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-white/50 text-sm">Category:</span>
                <button
                    onClick={() => updateFilters("category", null)}
                    className={`filter-pill ${!currentCategory ? "active" : ""}`}
                >
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => updateFilters("category", currentCategory === category ? null : category)}
                        className={`filter-pill ${currentCategory === category ? "active" : ""}`}
                    >
                        {categoryLabels[category] || category}
                        {categoryCounts[category] && (
                            <span className="ml-1 opacity-60">({categoryCounts[category]})</span>
                        )}
                    </button>
                ))}

                {/* Clear Filters */}
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-sm text-white/60 hover:text-white ml-4 transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}
