import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { Video, Search } from "lucide-react";
import TalentCard from "@/components/ui/TalentCard";
import FilterBar from "./FilterBar";

interface PageProps {
    searchParams: Promise<{
        grade?: string;
        location?: string;
        search?: string;
    }>;
}

async function getVideographers(filters: { grade?: string; location?: string; search?: string }) {
    const where: Record<string, unknown> = {
        status: "PUBLISHED",
    };

    if (filters.grade) {
        where.grade = filters.grade;
    }

    if (filters.location) {
        where.locationId = filters.location;
    }

    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search } },
            { bio: { contains: filters.search } },
        ];
    }

    return prisma.videographer.findMany({
        where,
        include: {
            location: true,
            portfolios: {
                orderBy: { order: 'asc' },
            },
        },
        orderBy: [
            { grade: "asc" },
            { dailyRate: "desc" },
        ],
    });
}

async function getLocations() {
    return prisma.location.findMany({
        where: { type: "city" },
        orderBy: { name: "asc" },
    });
}

async function getGradeCounts() {
    const counts = await prisma.videographer.groupBy({
        by: ["grade"],
        where: { status: "PUBLISHED" },
        _count: true,
    });

    return counts.reduce((acc, item) => {
        acc[item.grade] = item._count;
        return acc;
    }, {} as Record<string, number>);
}

export default async function VideographersPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const [videographers, locations, gradeCounts] = await Promise.all([
        getVideographers(params),
        getLocations(),
        getGradeCounts(),
    ]);

    const grades = ["A", "B", "C", "D", "E"];

    return (
        <div className="section-container py-12">
            {/* Page Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-pink/20 to-primary-500/20 flex items-center justify-center">
                        <Video className="w-6 h-6 text-accent-pink" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Videographers</h1>
                        <p className="text-white/60">
                            {videographers.length} professional videographers available
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <Suspense fallback={<div className="h-16 skeleton mb-8" />}>
                <FilterBar
                    grades={grades}
                    gradeCounts={gradeCounts}
                    locations={locations}
                    currentGrade={params.grade}
                    currentLocation={params.location}
                    currentSearch={params.search}
                />
            </Suspense>

            {/* Results */}
            {videographers.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videographers.map((videographer) => (
                        <TalentCard
                            key={videographer.id}
                            id={videographer.id}
                            type="videographer"
                            name={videographer.name}
                            bio={videographer.bio}
                            grade={videographer.grade}
                            hourlyRate={videographer.hourlyRate}
                            dailyRate={videographer.dailyRate}
                            profileImage={videographer.profileImage}
                            instagram={videographer.instagram}
                            location={videographer.location}
                            portfolio={videographer.portfolios}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-white/30" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No videographers found</h3>
                    <p className="text-white/50">
                        Try adjusting your filters to see more results.
                    </p>
                </div>
            )}
        </div>
    );
}
