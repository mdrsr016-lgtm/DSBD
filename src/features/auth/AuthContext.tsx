// ============================================================
// Auth Context — Firebase or Mock Authentication
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase'
import type { AuthContextType, User } from '@/types'

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Mock Auth initialization
      const storedMockUser = localStorage.getItem('dsbd-mock-user')
      if (storedMockUser) {
        try {
          setUser(JSON.parse(storedMockUser))
        } catch {
          // ignore
        }
      }
      setLoading(false)
      return
    }

    // Real Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      // Mock sign in
      const mockUser = {
        uid: 'mock-user-id',
        email,
        displayName: email.split('@')[0],
      } as any
      setUser(mockUser)
      localStorage.setItem('dsbd-mock-user', JSON.stringify(mockUser))
      return
    }

    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!isFirebaseConfigured) {
      // Mock sign up
      const mockUser = {
        uid: 'mock-user-id',
        email,
        displayName,
      } as any
      setUser(mockUser)
      localStorage.setItem('dsbd-mock-user', JSON.stringify(mockUser))
      return
    }

    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName })
  }

  const signOut = async () => {
    if (!isFirebaseConfigured) {
      // Mock sign out
      setUser(null)
      localStorage.removeItem('dsbd-mock-user')
      return
    }

    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

