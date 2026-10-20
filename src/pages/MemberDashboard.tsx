import { motion } from 'framer-motion';
import {
  Landmark, Wallet, TrendingDown, PiggyBank,
  ArrowUpRight, ArrowDownRight, Send, CreditCard,
  History, Plus, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  MEMBER_FINANCIALS,
  MEMBER_TRANSACTIONS,
  type FinancialSnapshot,
} from '../data/memberFinancials';

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  '৳ ' + n.toLocaleString('en-IN');

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, type: 'spring', stiffness: 260, damping: 24 } }),
};

// ── Card configs ─────────────────────────────────────────────────────────────
interface CardConfig {
  key: keyof FinancialSnapshot;
  label: string;
  icon: React.ElementType;
  accent: string;   // colour hex
  glow: string;     // rgba glow
  bg: string;       // rgba bg tint
}

const CARDS: CardConfig[] = [
  {
    key:    'bank',
    label:  'Bank Balance',
    icon:   Landmark,
    accent: '#22D3EE',
    glow:   'rgba(34,211,238,0.30)',
    bg:     'rgba(34,211,238,0.08)',
  },
  {
    key:    'cash',
    label:  'Cash in Hand',
    icon:   Wallet,
    accent: '#34D399',
    glow:   'rgba(52,211,153,0.30)',
    bg:     'rgba(52,211,153,0.08)',
  },
  {
    key:    'debt',
    label:  'Total Debt',
    icon:   TrendingDown,
    accent: '#FF4D6D',
    glow:   'rgba(255,77,109,0.30)',
    bg:     'rgba(255,77,109,0.08)',
  },
  {
    key:    'savings',
    label:  'Savings',
    icon:   PiggyBank,
    accent: '#FACC15',
    glow:   'rgba(234,179,8,0.30)',
    bg:     'rgba(234,179,8,0.08)',
  },
];

// ── Quick-action configs ──────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Transfer',  icon: Send,       accent: '#22D3EE' },
  { label: 'Pay Bill',  icon: CreditCard, accent: '#A78BFA' },
  { label: 'History',   icon: History,    accent: '#34D399' },
  { label: 'Add Money', icon: Plus,       accent: '#FB923C' },
];

// ─────────────────────────────────────────────────────────────────────────────
export function MemberDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const snap = MEMBER_FINANCIALS[user.id] ?? MEMBER_FINANCIALS['default'];
  const txns = MEMBER_TRANSACTIONS[user.id] ?? MEMBER_TRANSACTIONS['default'];

  const netBalance = snap.bank + snap.cash + snap.savings - snap.debt;
  const savingsRate = Math.round((snap.savings / snap.income) * 100);

  // greeting by time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5 max-w-xl mx-auto"
    >
      {/* ── Greeting ──────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} custom={0}>
        <p className="text-white/40 text-sm font-medium">{greeting},</p>
        <h1 className="text-2xl font-bold text-icy-white leading-tight mt-0.5">
          {user.name.split(' ')[0]} <span className="text-white/30">👋</span>
        </h1>
      </motion.div>

      {/* ── Net Worth Hero ────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        custom={1}
        className="glass-card rounded-2xl p-5 relative overflow-hidden"
      >
        {/* Glow orb */}
        <div
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 70%)' }}
        />
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-1">Net Worth</p>
        <p className="text-3xl font-bold text-icy-white tracking-tight">
          {fmt(netBalance)}
        </p>

        {/* Income / Expenses this month */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-400/15 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wide font-semibold">Income</p>
              <p className="text-sm font-semibold text-emerald-400">{fmt(snap.income)}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-400/15 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wide font-semibold">Expenses</p>
              <p className="text-sm font-semibold text-rose-400">{fmt(snap.expenses)}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">{savingsRate}% saved</span>
          </div>
        </div>
      </motion.div>

      {/* ── Financial Cards 2×2 grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          const value = snap[card.key] as number;
          const isDebt = card.key === 'debt';
          return (
            <motion.div
              key={card.key}
              variants={fadeUp}
              custom={i + 2}
              className="glass-card rounded-2xl p-4 relative overflow-hidden flex flex-col gap-3"
              style={{ background: card.bg }}
            >
              {/* background glow */}
              <div
                className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${card.glow} 0%, transparent 70%)` }}
              />

              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 self-start"
                style={{ background: card.glow }}
              >
                <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" style={{ color: card.accent }} />
              </div>

              {/* Amount */}
              <div>
                <p
                  className={`text-lg font-bold leading-tight ${isDebt ? 'text-neon-rose' : 'text-icy-white'}`}
                >
                  {isDebt ? '-' : ''}{fmt(value)}
                </p>
                <p className="text-[11px] text-white/40 font-medium mt-0.5">{card.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} custom={6} className="glass-card rounded-2xl p-4">
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Quick Actions</p>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-active:scale-95"
                  style={{ background: action.accent + '18', boxShadow: `0 0 0 1px ${action.accent}22` }}
                >
                  <Icon className="w-5 h-5" style={{ color: action.accent }} />
                </div>
                <span className="text-[10px] text-white/50 font-medium group-hover:text-white/80 transition-colors text-center leading-tight">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Recent Transactions ───────────────────────────────────────────── */}
      <motion.div variants={fadeUp} custom={7} className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Recent Activity</p>
          <button className="text-[11px] text-premium-cyan font-semibold hover:underline">See all</button>
        </div>

        <div className="flex flex-col divide-y divide-white/[0.04]">
          {txns.map((tx, i) => (
            <motion.div
              key={tx.id}
              variants={fadeUp}
              custom={8 + i}
              className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors"
            >
              {/* Category emoji */}
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-base flex-shrink-0">
                {tx.category}
              </div>

              {/* Label & date */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-icy-white font-medium truncate">{tx.label}</p>
                <p className="text-[11px] text-white/30">{tx.date}</p>
              </div>

              {/* Amount */}
              <p
                className={`text-sm font-bold flex-shrink-0 ${
                  tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="h-3" />
      </motion.div>

      {/* Bottom spacer for BottomNav */}
      <div className="h-2" />
    </motion.div>
  );
}
