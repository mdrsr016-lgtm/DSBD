// ─── Demo financial snapshot per user id ────────────────────────────────────
// Replace with real API data in production.

export interface FinancialSnapshot {
  bank: number;       // main bank balance
  cash: number;       // cash in hand
  debt: number;       // total outstanding debt
  savings: number;    // savings / fixed deposits
  income: number;     // this month's income
  expenses: number;   // this month's expenses
}

export interface Transaction {
  id: string;
  label: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  category: string;
}

export interface MemberLoan {
  currentLoan: number;
  status: 'Active' | 'Pending' | 'Paid';
  nextPaymentDate: string;
  isEligibleForAnotherLoan: boolean;
  loanDuration?: string;
  totalPaid?: number;
  totalDue?: number;
  endMonth?: string;
  nextPaymentAmount?: number;
}

export const MEMBER_LOAN_DATA: Record<string, MemberLoan> = {
  'usr-006': {
    currentLoan: 25_000,
    status: 'Active',
    nextPaymentDate: 'Nov 15, 2026',
    isEligibleForAnotherLoan: true,
    loanDuration: '6 months',
    totalPaid: 8_334,
    totalDue: 16_666,
    endMonth: 'May 15, 2027',
    nextPaymentAmount: 4_167,
  },
  default: {
    currentLoan: 25_000,
    status: 'Active',
    nextPaymentDate: 'Nov 15, 2026',
    isEligibleForAnotherLoan: true,
    loanDuration: '6 months',
    totalPaid: 8_334,
    totalDue: 16_666,
    endMonth: 'May 15, 2027',
    nextPaymentAmount: 4_167,
  },
};

export interface MemberQuickStats {
  cashInHand: number;
  cashNote: string;
  paymentsDue: number;
  paymentsDueDate: string;
  overtimeAmount: number;
  overtimeHours: number;
  moneyLent: number;
  moneyLentCount: number;
  monthlyPaid?: number;
  monthlyRemaining?: number;
  monthlyMonth?: string;
}

export const MEMBER_QUICK_STATS: Record<string, MemberQuickStats> = {
  'usr-006': {
    cashInHand: 8_450,
    cashNote: 'Available this month',
    paymentsDue: 4_167,
    paymentsDueDate: 'Nov 15, 2026',
    overtimeAmount: 3_600,
    overtimeHours: 36,
    moneyLent: 2_500,
    moneyLentCount: 2,
    monthlyPaid: 8_334,
    monthlyRemaining: 4_167,
    monthlyMonth: 'October 2026',
  },
  default: {
    cashInHand: 8_450,
    cashNote: 'Available this month',
    paymentsDue: 4_167,
    paymentsDueDate: 'Nov 15, 2026',
    overtimeAmount: 3_600,
    overtimeHours: 36,
    moneyLent: 2_500,
    moneyLentCount: 2,
    monthlyPaid: 8_334,
    monthlyRemaining: 4_167,
    monthlyMonth: 'October 2026',
  },
};

export const MEMBER_FINANCIALS: Record<string, FinancialSnapshot> = {
  'usr-006': {   // Tania Begum – member
    bank:     1_24_580,
    cash:       8_200,
    debt:      32_000,
    savings:   75_000,
    income:    45_000,
    expenses:  28_300,
  },
  // fallback for any other user viewing dashboard
  default: {
    bank:     2_50_000,
    cash:      12_000,
    debt:      55_000,
    savings:  1_00_000,
    income:    60_000,
    expenses:  38_000,
  },
};

export const MEMBER_TRANSACTIONS: Record<string, Transaction[]> = {
  'usr-006': [
    { id: 't1', label: 'Salary Received',   amount: 45_000, type: 'credit', date: 'Today, 09:14 AM',   category: '💼' },
    { id: 't2', label: 'Grocery Shop',      amount:  2_400, type: 'debit',  date: 'Today, 11:30 AM',   category: '🛒' },
    { id: 't3', label: 'Electric Bill',     amount:  1_850, type: 'debit',  date: 'Yesterday',         category: '⚡' },
    { id: 't4', label: 'Freelance Income',  amount: 12_000, type: 'credit', date: 'Oct 18',            category: '💻' },
    { id: 't5', label: 'Loan Instalment',   amount:  5_000, type: 'debit',  date: 'Oct 17',            category: '🏦' },
  ],
  default: [
    { id: 't1', label: 'Salary Received',  amount: 60_000, type: 'credit', date: 'Today, 09:00 AM', category: '💼' },
    { id: 't2', label: 'Rent Payment',     amount: 15_000, type: 'debit',  date: 'Yesterday',       category: '🏠' },
    { id: 't3', label: 'Utility Bills',    amount:  3_200, type: 'debit',  date: 'Oct 18',          category: '⚡' },
  ],
};
