import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "@/contexts/BookingContext";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "HRP - Human Resource Photographer | Professional Photography & Videography Services",
    description: "Connect with 1,200+ vetted photographers and videographers. Book professional talent, equipment, and transport for your next project.",
    keywords: ["photographer", "videographer", "photography services", "video production", "equipment rental", "Indonesia photographer"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="antialiased">
                <BookingProvider>
                    {children}
                </BookingProvider>
            </body>
        </html>
    );
}

