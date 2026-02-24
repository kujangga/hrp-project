'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16">
            <AlertTriangle className="text-amber-400 mb-6" size={48} />
            <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
                {error.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25"
                >
                    <RefreshCw size={18} />
                    Try Again
                </button>
                <Link
                    href="/"
                    className="px-6 py-3 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
