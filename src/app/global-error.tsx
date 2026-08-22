"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '1rem',
          backgroundColor: '#0f172a',
          color: '#f8fafc'
        }}>
          <div style={{
            maxWidth: '400px',
            padding: '2rem',
            borderRadius: '0.75rem',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Application Exception</h2>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              A global system error occurred.
            </p>
            <button
              onClick={() => reset()}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Reset Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
