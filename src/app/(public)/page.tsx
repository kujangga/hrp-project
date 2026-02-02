import Link from "next/link";
import { Camera, Video, Package, Truck, ArrowRight, Star, Users, Award, MapPin } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import prisma from "@/lib/prisma";

async function getStats() {
    const [photographers, videographers, equipment, locations] = await Promise.all([
        prisma.photographer.count({ where: { status: 'PUBLISHED' } }),
        prisma.videographer.count({ where: { status: 'PUBLISHED' } }),
        prisma.equipment.count({ where: { status: 'AVAILABLE' } }),
        prisma.location.count({ where: { type: 'city' } }),
    ]);

    return {
        talents: photographers + videographers,
        equipment,
        locations,
        bookings: 4500, // Static for now
    };
}

export default async function HomePage() {
    const stats = await getStats();

    return (
        <div className="relative">
            {/* Hero Section */}
            <HeroSection />

            {/* Stats Section */}
            <section className="relative py-16 border-y border-white/10">
                <div className="section-container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="stat-value">{stats.talents}+</div>
                            <div className="text-white/60 mt-2">Professional Talents</div>
                        </div>
                        <div className="text-center">
                            <div className="stat-value">{stats.bookings.toLocaleString()}+</div>
                            <div className="text-white/60 mt-2">Successful Bookings</div>
                        </div>
                        <div className="text-center">
                            <div className="stat-value">98%</div>
                            <div className="text-white/60 mt-2">Replacement Success</div>
                        </div>
                        <div className="text-center">
                            <div className="stat-value">{stats.locations}+</div>
                            <div className="text-white/60 mt-2">Cities Covered</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="relative py-24">
                <div className="section-container">
                    {/* Section Header */}
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Complete Production Services
                        </h2>
                        <p className="text-white/60">
                            Everything you need for your next project, from talent to equipment to logistics.
                        </p>
                    </div>

                    {/* Service Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Photographers */}
                        <Link href="/photographers" className="service-card group p-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-700/20 flex items-center justify-center mb-5">
                                <Camera className="w-7 h-7 text-primary-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Photographers</h3>
                            <p className="text-white/50 text-sm mb-4">
                                Professional photographers across all grades and specializations.
                            </p>
                            <div className="flex items-center gap-2 text-primary-400 text-sm font-medium group-hover:gap-3 transition-all">
                                Browse Photographers
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>

                        {/* Videographers */}
                        <Link href="/videographers" className="service-card group p-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-pink/20 to-primary-500/20 flex items-center justify-center mb-5">
                                <Video className="w-7 h-7 text-accent-pink" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Videographers</h3>
                            <p className="text-white/50 text-sm mb-4">
                                Cinematic videographers for weddings, commercials, and events.
                            </p>
                            <div className="flex items-center gap-2 text-accent-pink text-sm font-medium group-hover:gap-3 transition-all">
                                Browse Videographers
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>

                        {/* Equipment */}
                        <Link href="/equipment" className="service-card group p-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-primary-500/20 flex items-center justify-center mb-5">
                                <Package className="w-7 h-7 text-accent-cyan" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Equipment</h3>
                            <p className="text-white/50 text-sm mb-4">
                                Cameras, lenses, lighting, drones, and accessories for rent.
                            </p>
                            <div className="flex items-center gap-2 text-accent-cyan text-sm font-medium group-hover:gap-3 transition-all">
                                Browse Equipment
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>

                        {/* Transport */}
                        <Link href="/transport" className="service-card group p-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-gold/20 to-primary-500/20 flex items-center justify-center mb-5">
                                <Truck className="w-7 h-7 text-accent-gold" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Transport</h3>
                            <p className="text-white/50 text-sm mb-4">
                                Team logistics with various vehicle options and capacities.
                            </p>
                            <div className="flex items-center gap-2 text-accent-gold text-sm font-medium group-hover:gap-3 transition-all">
                                Browse Transport
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Grade System Section */}
            <section className="relative py-24 bg-white/[0.02]">
                <div className="section-container">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Content */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Grade-Based <span className="gradient-text">Quality Assurance</span>
                            </h2>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                Our transparent grading system ensures you get exactly what you expect.
                                Each photographer and videographer is carefully evaluated and assigned a grade
                                from A to E based on experience, portfolio quality, and client feedback.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Transparent Pricing</h4>
                                        <p className="text-white/50 text-sm">Clear rates based on grade - no hidden fees</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Smart Replacement</h4>
                                        <p className="text-white/50 text-sm">Same-grade replacement guarantee if talent is unavailable</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Location Coverage</h4>
                                        <p className="text-white/50 text-sm">Talents available across major cities in Indonesia</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grade Cards */}
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { grade: 'A', title: 'Premium Professional', desc: 'Award-winning talent with 10+ years experience' },
                                { grade: 'B', title: 'Senior Professional', desc: 'Experienced professionals with strong portfolios' },
                                { grade: 'C', title: 'Experienced Professional', desc: 'Solid track record with diverse experience' },
                                { grade: 'D', title: 'Growing Professional', desc: 'Talented individuals building their portfolio' },
                                { grade: 'E', title: 'Entry Level', desc: 'New talent with passion and potential' },
                            ].map((item) => (
                                <div key={item.grade} className="glass-card p-4 flex items-center gap-4">
                                    <span className={`grade-badge ${item.grade === 'A' ? 'grade-a' : item.grade === 'B' ? 'grade-b' : item.grade === 'C' ? 'grade-c' : item.grade === 'D' ? 'grade-d' : 'grade-e'}`}>
                                        Grade {item.grade}
                                    </span>
                                    <div>
                                        <div className="font-medium">{item.title}</div>
                                        <div className="text-white/50 text-sm">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="relative py-24">
                <div className="section-container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            How It Works
                        </h2>
                        <p className="text-white/60">
                            Book your perfect photographer in just a few simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: 1, title: 'Browse Services', desc: 'Explore photographers, videographers, equipment, or transport.' },
                            { step: 2, title: 'Filter & Select', desc: 'Use filters to find exactly what you need. Add items to cart.' },
                            { step: 3, title: 'Review Cart', desc: 'Review your selections and adjust quantities or duration.' },
                            { step: 4, title: 'Checkout', desc: 'Enter your details, pay, and receive instant confirmation.' },
                        ].map((item) => (
                            <div key={item.step} className="relative text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                <p className="text-white/50 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24">
                <div className="section-container">
                    <div className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-primary-900/30" />
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                        <div className="absolute inset-0 backdrop-blur-sm" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Ready to Start Your Project?
                            </h2>
                            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                                Browse our talented photographers and videographers, add equipment,
                                and book transport all in one place.
                            </p>
                            <Link href="/photographers" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                                Get Started Now
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
