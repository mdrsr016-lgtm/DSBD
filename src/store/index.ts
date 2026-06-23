// ============================================================
// Global app store — Zustand
// Manages: theme, toast notifications, sidebar state
// ============================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ToastMessage } from '@/types'
import { generateId } from '@/utils'

// ── Theme store ───────────────────────────────────────────
interface ThemeState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: 'light',
      toggleTheme: () =>
        set(state => {
          const next = state.theme === 'light' ? 'dark' : 'light'
          document.documentElement.setAttribute('data-theme', next)
          return { theme: next }
        }),
      setTheme: theme => {
        document.documentElement.setAttribute('data-theme', theme)
        set({ theme })
      },
    }),
    { name: 'dsbd-theme' }
  )
)

// ── Toast / Notification store ────────────────────────────
interface ToastState {
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastState>(set => ({
  toasts: [],
  addToast: toast => {
    const id = generateId()
    set(state => ({ toasts: [...state.toasts, { ...toast, id }] }))
    // Auto-dismiss
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
    }, toast.duration ?? 4000)
  },
  removeToast: id =>
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}))

// ── Sidebar / layout store ────────────────────────────────
interface LayoutState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useLayoutStore = create<LayoutState>(set => ({
  sidebarOpen: true,
  setSidebarOpen: open => set({ sidebarOpen: open }),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
}))
