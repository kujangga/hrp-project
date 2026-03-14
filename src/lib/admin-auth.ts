import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Checks if the current request is from an authenticated ADMIN user.
 * Returns null if authorized, or a NextResponse with 401/403 if not.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const user = session.user as { role?: string };

    if (user.role !== 'ADMIN') {
        return NextResponse.json(
            { error: 'Forbidden: Admin access required' },
            { status: 403 }
        );
    }

    return null; // Authorized
}
