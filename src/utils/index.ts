// ============================================================
// Utility helpers for DSBD
// ============================================================

import { format, formatDistanceToNow, parseISO } from 'date-fns'
import type { Timestamp } from 'firebase/firestore'

// ── Currency ──────────────────────────────────────────────
/**
 * Format a number as currency (default: BDT — Bangladeshi Taka)
 * Change locale and currency code as needed for your region.
 */
export function formatCurrency(
  amount: number,
  currency = 'BDT',
  locale = 'bn-BD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format as plain number with commas
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value)
}

// ── Date ──────────────────────────────────────────────────
/**
 * Convert Firestore Timestamp OR ISO string → JS Date
 */
export function toDate(value: Timestamp | string | Date): Date {
  if (value instanceof Date) return value
  if (typeof value === 'string') return parseISO(value)
  // Firestore Timestamp
  return (value as Timestamp).toDate()
}

export function formatDate(value: Timestamp | string | Date, pattern = 'dd MMM yyyy'): string {
  return format(toDate(value), pattern)
}

export function formatRelativeDate(value: Timestamp | string | Date): string {
  return formatDistanceToNow(toDate(value), { addSuffix: true })
}

// ── Strings ───────────────────────────────────────────────
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str: string, maxLength = 40): string {
  return str.length > maxLength ? `${str.slice(0, maxLength)}…` : str
}

// ── IDs ───────────────────────────────────────────────────
export function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

// ── Loan calculations ─────────────────────────────────────
/**
 * Calculate remaining balance on a loan given repayments
 */
export function calcRemainingBalance(
  principal: number,
  repayments: number[]
): number {
  const totalPaid = repayments.reduce((sum, amt) => sum + amt, 0)
  return Math.max(0, principal - totalPaid)
}

/**
 * Calculate simple interest
 */
export function calcSimpleInterest(
  principal: number,
  ratePercent: number,
  years: number
): number {
  return (principal * ratePercent * years) / 100
}

// ── Color helpers ─────────────────────────────────────────
export function getTransactionColor(type: 'income' | 'expense'): string {
  return type === 'income' ? 'var(--color-accent-500)' : 'var(--color-danger-500)'
}

export function getLoanStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'var(--color-primary-500)',
    paid: 'var(--color-accent-500)',
    overdue: 'var(--color-danger-500)',
    defaulted: 'var(--color-gray-500)',
  }
  return map[status] ?? 'var(--color-gray-500)'
}
