// Auth Guard — redirects unauthenticated users to /login

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function AuthGuard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-guard-loading">
        <div className="spinner" />
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
