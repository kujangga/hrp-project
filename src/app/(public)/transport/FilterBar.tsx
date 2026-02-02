"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Location {
    id: string;
    name: string;
}

interface FilterBarProps {
    vehicleTypes: string[];
    vehicleTypeCounts: Record<string, number>;
    locations: Location[];
    currentVehicleType?: string;
    currentLocation?: string;
    currentSearch?: string;
}

const vehicleLabels: Record<string, string> = {
    van: "🚐 Van",
    suv: "🚙 SUV",
    minibus: "🚌 Minibus",
    bus: "🚍 Bus",
    car: "🚗 Car",
    truck: "🚛 Truck",
};

export default function FilterBar({
    vehicleTypes,
    vehicleTypeCounts,
    locations,
    currentVehicleType,
    currentLocation,
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

    const hasFilters = currentVehicleType || currentLocation || currentSearch;

    return (
        <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search transport by name or type..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="input-field"
                />
            </form>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Vehicle Type Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white/50 text-sm">Type:</span>
                    <button
                        onClick={() => updateFilters("vehicleType", null)}
                        className={`filter-pill ${!currentVehicleType ? "active" : ""}`}
                    >
                        All
                    </button>
                    {vehicleTypes.map((type) => (
                        vehicleTypeCounts[type] ? (
                            <button
                                key={type}
                                onClick={() => updateFilters("vehicleType", currentVehicleType === type ? null : type)}
                                className={`filter-pill ${currentVehicleType === type ? "active" : ""}`}
                            >
                                {vehicleLabels[type] || type}
                                <span className="ml-1 opacity-60">({vehicleTypeCounts[type]})</span>
                            </button>
                        ) : null
                    ))}
                </div>

                {/* Location Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-white/50 text-sm ml-4">Location:</span>
                    <select
                        value={currentLocation || ""}
                        onChange={(e) => updateFilters("location", e.target.value || null)}
                        className="select-field w-auto min-w-[150px]"
                    >
                        <option value="">All Locations</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                </div>

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
