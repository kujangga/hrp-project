import Link from 'next/link';
import { Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-6">
                <Search className="text-purple-400" size={36} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Page Not Found</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25"
            >
                Back to Home
            </Link>
        </div>
    );
}
