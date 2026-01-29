import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { Package, Search } from "lucide-react";
import EquipmentCard from "@/components/ui/EquipmentCard";
import FilterBar from "./FilterBar";

interface PageProps {
    searchParams: Promise<{
        category?: string;
        search?: string;
    }>;
}

async function getEquipment(filters: { category?: string; search?: string }) {
    const where: Record<string, unknown> = {
        status: "AVAILABLE",
    };

    if (filters.category) {
        where.category = filters.category;
    }

    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search } },
            { description: { contains: filters.search } },
            { brand: { contains: filters.search } },
        ];
    }

    return prisma.equipment.findMany({
        where,
        include: {
            location: true,
        },
        orderBy: [
            { category: "asc" },
            { dailyRate: "desc" },
        ],
    });
}

async function getCategoryCounts() {
    const counts = await prisma.equipment.groupBy({
        by: ["category"],
        where: { status: "AVAILABLE" },
        _count: true,
    });

    return counts.reduce((acc, item) => {
        acc[item.category] = item._count;
        return acc;
    }, {} as Record<string, number>);
}

export default async function EquipmentPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const [equipment, categoryCounts] = await Promise.all([
        getEquipment(params),
        getCategoryCounts(),
    ]);

    const categories = ["camera", "lens", "lighting", "drone", "accessory"];

    return (
        <div className="section-container py-12">
            {/* Page Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-primary-500/20 flex items-center justify-center">
                        <Package className="w-6 h-6 text-accent-cyan" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Equipment Rental</h1>
                        <p className="text-white/60">
                            {equipment.length} professional equipment available for rent
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <Suspense fallback={<div className="h-16 skeleton mb-8" />}>
                <FilterBar
                    categories={categories}
                    categoryCounts={categoryCounts}
                    currentCategory={params.category}
                    currentSearch={params.search}
                />
            </Suspense>

            {/* Results */}
            {equipment.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {equipment.map((item) => (
                        <EquipmentCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            category={item.category}
                            brand={item.brand}
                            dailyRate={item.dailyRate}
                            availableQty={item.availableQty}
                            image={item.image}
                            features={item.features}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-white/30" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No equipment found</h3>
                    <p className="text-white/50">
                        Try adjusting your filters to see more results.
                    </p>
                </div>
            )}
        </div>
    );
}
