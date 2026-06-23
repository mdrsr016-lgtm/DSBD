// ============================================================
// Core TypeScript types for DSBD
// ============================================================

import type { User } from 'firebase/auth'
import type { Timestamp } from 'firebase/firestore'

// ── Re-exports ────────────────────────────────────────────
export type { User }

// ── Auth ──────────────────────────────────────────────────
export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
}

// ── Budget / Transactions ─────────────────────────────────
export type TransactionType = 'income' | 'expense'

export type BudgetCategory =
  | 'food'
  | 'transport'
  | 'housing'
  | 'utilities'
  | 'healthcare'
  | 'education'
  | 'entertainment'
  | 'shopping'
  | 'savings'
  | 'other'

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  category: BudgetCategory
  description: string
  date: Timestamp | string
  createdAt: Timestamp | string
  updatedAt?: Timestamp | string
  tags?: string[]
  note?: string
}

export interface BudgetSummary {
  totalIncome: number
  totalExpenses: number
  balance: number
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  breakdown: Partial<Record<BudgetCategory, number>>
}

// ── Loans ─────────────────────────────────────────────────
export type LoanStatus = 'active' | 'paid' | 'overdue' | 'defaulted'
export type LoanType = 'given' | 'taken'

export interface Loan {
  id: string
  userId: string
  type: LoanType           // money given to someone OR taken from someone
  personName: string
  personContact?: string
  principalAmount: number
  interestRate?: number    // annual percentage, optional
  startDate: Timestamp | string
  dueDate?: Timestamp | string
  status: LoanStatus
  description?: string
  createdAt: Timestamp | string
  updatedAt?: Timestamp | string
}

export interface LoanRepayment {
  id: string
  loanId: string
  userId: string
  amount: number
  date: Timestamp | string
  note?: string
  createdAt: Timestamp | string
}

// ── UI / Navigation ───────────────────────────────────────
export interface NavItem {
  label: string
  path: string
  icon: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

// ── Utility ───────────────────────────────────────────────
export type ID = string
export type Maybe<T> = T | null | undefined
export type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}
