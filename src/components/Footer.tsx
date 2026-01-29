import Link from "next/link";
import { Camera, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative mt-24 border-t border-white/10">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative section-container py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                <Camera className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text">HRP</span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Connecting talented photographers and videographers with clients through intelligent matching and comprehensive service management.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:hello@hrp.com"
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Services</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/photographers" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Photographers
                                </Link>
                            </li>
                            <li>
                                <Link href="/videographers" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Videographers
                                </Link>
                            </li>
                            <li>
                                <Link href="/equipment" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Equipment Rental
                                </Link>
                            </li>
                            <li>
                                <Link href="/transport" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Transportation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-white/60 hover:text-white transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-white/60 hover:text-white transition-colors text-sm">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-white/60">
                                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>Jl. Sudirman No. 123, Jakarta Pusat, Indonesia 10220</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/60">
                                <Phone className="w-5 h-5 flex-shrink-0" />
                                <span>+62 21 1234 5678</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/60">
                                <Mail className="w-5 h-5 flex-shrink-0" />
                                <span>hello@hrp.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">
                        © 2026 HRP - Human Resource Photographer. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-white/40 hover:text-white/60 text-sm transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-white/40 hover:text-white/60 text-sm transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
