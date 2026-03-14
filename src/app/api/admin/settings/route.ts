import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// Settings are stored as key-value pairs in a simple JSON file
// since we don't have a Settings table in the schema.
// We'll use a global config approach via a special Location-based hack
// or simply use the filesystem. For now, use a simple JSON approach.

const SETTINGS_DEFAULTS = {
    siteName: 'HRP Marketplace',
    siteDescription: 'Professional photographer and videographer marketplace',
    contactEmail: 'admin@hrp.id',
    supportPhone: '+62 21 1234 5678',
    defaultTaxRate: 11,
    bookingAutoConfirm: false,
    emailNotifications: true,
    smsNotifications: false,
};

// Use a file-based settings store (simple but effective for single-server)
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SETTINGS_FILE = join(process.cwd(), 'data', 'settings.json');

function getSettings(): Record<string, unknown> {
    try {
        if (existsSync(SETTINGS_FILE)) {
            return JSON.parse(readFileSync(SETTINGS_FILE, 'utf-8'));
        }
    } catch {
        // ignore
    }
    return { ...SETTINGS_DEFAULTS };
}

function saveSettings(data: Record<string, unknown>) {
    const dir = join(process.cwd(), 'data');
    if (!existsSync(dir)) {
        const { mkdirSync } = require('fs');
        mkdirSync(dir, { recursive: true });
    }
    writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    const settings = getSettings();
    return NextResponse.json(settings);
}

export async function PUT(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const body = await request.json();
        const current = getSettings();
        const updated = { ...current, ...body };
        saveSettings(updated);
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json(
            { error: 'Failed to save settings' },
            { status: 500 }
        );
    }
}
