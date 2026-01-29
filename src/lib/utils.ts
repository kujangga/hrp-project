// Format price in Indonesian Rupiah
export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Format price with shorter notation (e.g., 1.5M)
export function formatPriceShort(amount: number): string {
    if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `Rp ${(amount / 1000).toFixed(0)}K`;
    }
    return `Rp ${amount}`;
}

// Get grade color class
export function getGradeClass(grade: string): string {
    const gradeMap: Record<string, string> = {
        A: 'grade-a',
        B: 'grade-b',
        C: 'grade-c',
        D: 'grade-d',
        E: 'grade-e',
    };
    return gradeMap[grade.toUpperCase()] || 'grade-c';
}

// Get grade description
export function getGradeDescription(grade: string): string {
    const descriptions: Record<string, string> = {
        A: 'Premium Professional',
        B: 'Senior Professional',
        C: 'Experienced Professional',
        D: 'Growing Professional',
        E: 'Entry Level',
    };
    return descriptions[grade.toUpperCase()] || 'Professional';
}

// Generate booking code
export function generateBookingCode(): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `HRP-${year}-${random}`;
}

// Format date for display
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(d);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

// Parse features JSON
export function parseFeatures(features: string | null | undefined): string[] {
    if (!features) return [];
    try {
        return JSON.parse(features);
    } catch {
        return [];
    }
}
