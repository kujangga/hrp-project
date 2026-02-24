'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body style={{ backgroundColor: '#0a0a12', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Something went wrong!</h2>
                    <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>{error.message || 'An unexpected error occurred.'}</p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '0.75rem',
                            background: 'linear-gradient(to right, #8b5cf6, #6366f1)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
