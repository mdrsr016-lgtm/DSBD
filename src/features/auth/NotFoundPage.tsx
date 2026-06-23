// Not Found page
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--color-primary-500)' }}>404</h1>
      <h2>Page not found</h2>
      <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          background: 'var(--color-primary-500)',
          color: '#fff',
          borderRadius: 'var(--border-radius)',
          fontWeight: 600,
        }}
      >
        Go Home
      </Link>
    </div>
  )
}
