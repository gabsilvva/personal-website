'use client'

// The root layout itself failed, so this page brings its own document and minimal styles
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#000',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <title>Gabriel da Silva</title>
        <main>
          <h1 style={{ fontWeight: 400, fontSize: 40, margin: 0 }}>Algo deu errado · Something went wrong</h1>
          <p style={{ color: '#a3a3a3', marginTop: 16 }}>Tente de novo em instantes. · Please try again in a moment.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ marginTop: 32, padding: '16px 32px', borderRadius: 8, border: 0, background: '#fff', color: '#000', fontSize: 18, cursor: 'pointer' }}
          >
            Tentar de novo · Try again
          </button>
        </main>
      </body>
    </html>
  )
}
