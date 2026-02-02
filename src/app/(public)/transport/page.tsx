import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { Truck, Search } from "lucide-react";
import TransportCard from "@/components/ui/TransportCard";
import FilterBar from "./FilterBar";

interface PageProps {
    searchParams: Promise<{
        vehicleType?: string;
        location?: string;
        search?: string;
    }>;
}

async function getTransport(filters: { vehicleType?: string; location?: string; search?: string }) {
    const where: Record<string, unknown> = {
        status: "AVAILABLE",
    };

    if (filters.vehicleType) {
        where.vehicleType = filters.vehicleType;
    }

    if (filters.location) {
        where.locationId = filters.location;
    }

    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search } },
            { description: { contains: filters.search } },
        ];
    }

    return prisma.transport.findMany({
        where,
        include: {
            location: true,
        },
        orderBy: [
            { capacity: "desc" },
            { dailyRate: "asc" },
        ],
    });
}

async function getLocations() {
    return prisma.location.findMany({
        where: { type: "city" },
        orderBy: { name: "asc" },
    });
}

async function getVehicleTypeCounts() {
    const counts = await prisma.transport.groupBy({
        by: ["vehicleType"],
        where: { status: "AVAILABLE" },
        _count: true,
    });

    return counts.reduce((acc, item) => {
        acc[item.vehicleType] = item._count;
        return acc;
    }, {} as Record<string, number>);
}

export default async function TransportPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const [transport, locations, vehicleTypeCounts] = await Promise.all([
        getTransport(params),
        getLocations(),
        getVehicleTypeCounts(),
    ]);

    const vehicleTypes = ["van", "suv", "minibus", "bus", "car", "truck"];

    return (
        <div className="section-container py-12">
            {/* Page Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-gold/20 to-primary-500/20 flex items-center justify-center">
                        <Truck className="w-6 h-6 text-accent-gold" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Transportation</h1>
                        <p className="text-white/60">
                            {transport.length} vehicles available for your team logistics
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <Suspense fallback={<div className="h-16 skeleton mb-8" />}>
                <FilterBar
                    vehicleTypes={vehicleTypes}
                    vehicleTypeCounts={vehicleTypeCounts}
                    locations={locations}
                    currentVehicleType={params.vehicleType}
                    currentLocation={params.location}
                    currentSearch={params.search}
                />
            </Suspense>

            {/* Results */}
            {transport.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {transport.map((item) => (
                        <TransportCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            vehicleType={item.vehicleType}
                            capacity={item.capacity}
                            dailyRate={item.dailyRate}
                            image={item.image}
                            features={item.features}
                            location={item.location}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-white/30" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No transport found</h3>
                    <p className="text-white/50">
                        Try adjusting your filters to see more results.
                    </p>
                </div>
            )}
        </div>
    );
}
