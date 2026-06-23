// ============================================================
// App Router — React Router v6
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/AuthContext'
import { AuthGuard } from '@/features/auth/AuthGuard'

// Lazy-loaded pages
import { lazy, Suspense } from 'react'

const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'))
const BudgetPage    = lazy(() => import('@/features/budget/BudgetPage'))
const LoansPage     = lazy(() => import('@/features/loans/LoansPage'))
const LoginPage     = lazy(() => import('@/features/auth/LoginPage'))
const NotFoundPage  = lazy(() => import('@/features/auth/NotFoundPage'))

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Landing / public routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />

            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/budget"    element={<BudgetPage />} />
              <Route path="/loans"     element={<LoansPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
