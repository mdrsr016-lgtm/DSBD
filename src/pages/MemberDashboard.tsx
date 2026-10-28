import { motion } from 'framer-motion';
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
  ShieldCheck,
  Coins,
  Clock,
  Calendar,
  ArrowRight,
  Receipt,
  CreditCard,
  Wallet,
  CalendarClock,
  CirclePlus,
  HandCoins,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MEMBER_LOAN_DATA, MEMBER_QUICK_STATS } from '../data/memberFinancials';

// ── Animation variants ──────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 280, damping: 24 },
  },
};

export function MemberDashboard(_props?: { onNavigate?: (tab: string) => void }) {
  const { user } = useAuth();

  if (!user) return null;

  const hour = new Date().getHours();
  const timeConfig = (() => {
    if (hour >= 5 && hour < 12) {
      return { greeting: 'Good morning', icon: Sunrise, label: 'Morning' };
    }
    if (hour >= 12 && hour < 17) {
      return { greeting: 'Good afternoon', icon: Sun, label: 'Afternoon' };
    }
    if (hour >= 17 && hour < 22) {
      return { greeting: 'Good evening', icon: Sunset, label: 'Evening' };
    }
    return { greeting: 'Good night', icon: Moon, label: 'Night' };
  })();

  const TimeIcon = timeConfig.icon;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const loanData = MEMBER_LOAN_DATA[user.id] ?? MEMBER_LOAN_DATA.default;
  const statsData = MEMBER_QUICK_STATS[user.id] ?? MEMBER_QUICK_STATS.default;

  const monthlyPaid = statsData.monthlyPaid ?? 8_334;
  const monthlyRemaining = statsData.monthlyRemaining ?? 4_167;
  const monthlyTotal = monthlyPaid + monthlyRemaining;
  const monthlyPercent = monthlyTotal > 0 ? Math.round((monthlyPaid / monthlyTotal) * 100) : 0;
  const currentMonthYear = statsData.monthlyMonth ?? new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full flex flex-col pt-2 sm:pt-4"
    >
      {/* ── A. Time and Date Row ────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2.5 sm:gap-3 flex-wrap"
      >
        {/* Minimal Sun Icon in Cyan */}
        <TimeIcon className="w-4 h-4 text-[#22D3EE] flex-shrink-0" />

        {/* Time of Day Label in white */}
        <span className="font-inter font-semibold text-white text-sm sm:text-base tracking-normal">
          {timeConfig.label}
        </span>

        {/* Subtle Vertical Divider */}
        <span className="text-[#263746] font-light select-none text-sm mx-0.5">|</span>

        {/* Date in Secondary Text */}
        <span className="font-inter font-normal text-xs sm:text-sm text-[#94A3B8] tracking-normal">
          {formattedDate}
        </span>
      </motion.div>

      {/* ── B. Greeting & Customer Name ─────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="mt-4 sm:mt-5">
        {/* Greeting in medium-weight Inter */}
        <p className="font-inter text-2xl sm:text-3xl md:text-[2rem] font-medium text-[#F8FAFC] tracking-tight leading-tight">
          {timeConfig.greeting},
        </p>

        {/* Customer's Name in massive bold Plus Jakarta Sans with cyan-to-teal gradient */}
        <h1 className="font-jakarta font-extrabold text-[2.75rem] sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5rem] tracking-tight leading-[1.15] mt-1 sm:mt-1.5">
          <span
            className="bg-clip-text text-transparent inline-block pb-3 sm:pb-4 -mb-3 sm:-mb-4 pr-2"
            style={{
              backgroundImage: 'linear-gradient(90deg, #22D3EE 0%, #14B8A6 100%)',
            }}
          >
            {user.name}!
          </span>
        </h1>
      </motion.div>

      {/* ── C. Account Status Row ─────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 sm:gap-4 mt-5 sm:mt-6 flex-wrap"
      >
        {/* 1. Active Account Pill */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide font-inter"
          style={{
            backgroundColor: 'rgba(20, 184, 166, 0.08)',
            border: '1px solid rgba(20, 184, 166, 0.35)',
            color: '#10B981',
          }}
        >
          {/* Small green circular status indicator */}
          <span className="w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0" />
          <span>Active Account</span>
        </div>

        {/* Subtle Vertical Divider */}
        <span className="text-[#263746] font-light select-none text-sm">|</span>

        {/* 2. Verified Member */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F8FAFC] font-inter">
          <ShieldCheck className="w-4 h-4 text-[#22D3EE] flex-shrink-0" />
          <span>Verified Member</span>
        </div>
      </motion.div>

      {/* ── D. Welcome Message & Accent Line ──────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 sm:gap-4 mt-5 sm:mt-6"
      >
        <p className="font-inter text-sm sm:text-base md:text-[1.05rem] text-[#94A3B8] font-normal tracking-normal leading-normal">
          Welcome to {user.role === 'founder' || user.role === 'admin' ? 'Grow fin' : 'TrustBank'}
        </p>

        {/* Short, subtle cyan-to-teal accent line beside the message */}
        <div
          className="h-[3px] w-20 sm:w-28 md:w-36 rounded-full flex-shrink-0"
          style={{
            background: 'linear-gradient(90deg, #22D3EE 0%, rgba(20, 184, 166, 0.2) 100%)',
          }}
        />
      </motion.div>

      {/* ── E. Quick Stats, Current Loan & Eligibility Banner ────────────────── */}
      <motion.div variants={fadeUp} className="mt-8 sm:mt-10 flex flex-col gap-5 w-full max-w-[800px]">
        {/* Quick Stats Grid (4 Cards: 2x2 on all screens including smartphones) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
          {/* Card 1: Cash in Hand */}
          <div className="bg-[#020712] border-[1.5px] border-[#00C2FF] rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-5 md:p-6 flex flex-col justify-between shadow-[0_0_24px_rgba(0,194,255,0.12)]">
            <div className="flex items-start justify-between gap-1.5">
              <span className="font-inter text-[11px] sm:text-xs md:text-sm text-[#94A3B8] font-medium tracking-normal leading-tight">
                Cash in Hand
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-[#06241B]/80 border border-[#00F5A0]/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(0,245,160,0.12)]">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 text-[#00F5A0] stroke-[1.8]" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3 md:mt-4 mb-2 sm:mb-3 md:mb-4">
              <p className="font-jakarta font-extrabold text-lg sm:text-2xl md:text-3xl text-white tracking-tight flex items-baseline gap-1 sm:gap-1.5">
                <span className="font-bold text-sm sm:text-lg md:text-2xl text-white select-none">৳</span>
                <span>{new Intl.NumberFormat('en-IN').format(statsData.cashInHand)}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00F5A0] flex-shrink-0 shadow-[0_0_8px_#00F5A0]" />
              <span className="font-inter text-[10px] sm:text-xs text-[#00F5A0] font-normal leading-tight line-clamp-1">
                {statsData.cashNote}
              </span>
            </div>
          </div>

          {/* Card 2: Payments Due */}
          <div className="bg-[#020712] border-[1.5px] border-[#00C2FF] rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-5 md:p-6 flex flex-col justify-between shadow-[0_0_24px_rgba(0,194,255,0.12)]">
            <div className="flex items-start justify-between gap-1.5">
              <span className="font-inter text-[11px] sm:text-xs md:text-sm text-[#94A3B8] font-medium tracking-normal leading-tight">
                Payments Due
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-[#2B0E16]/80 border border-[#FF4D6D]/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(255,77,109,0.12)]">
                <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 text-[#FF4D6D] stroke-[1.8]" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3 md:mt-4 mb-2 sm:mb-3 md:mb-4">
              <p className="font-jakarta font-extrabold text-lg sm:text-2xl md:text-3xl text-white tracking-tight flex items-baseline gap-1 sm:gap-1.5">
                <span className="font-bold text-sm sm:text-lg md:text-2xl text-white select-none">৳</span>
                <span>{new Intl.NumberFormat('en-IN').format(statsData.paymentsDue ?? loanData.nextPaymentAmount ?? 4167)}</span>
              </p>
            </div>
            <div className="flex items-center">
              <span className="font-inter text-[10px] sm:text-xs text-[#FF4D6D] font-normal leading-tight line-clamp-1">
                {statsData.paymentsNote ?? 'Remaining to pay'}
              </span>
            </div>
          </div>

          {/* Card 3: Total Overtime */}
          <div className="bg-[#020712] border-[1.5px] border-[#00C2FF] rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-5 md:p-6 flex flex-col justify-between shadow-[0_0_24px_rgba(0,194,255,0.12)]">
            <div className="flex items-start justify-between gap-1.5">
              <span className="font-inter text-[11px] sm:text-xs md:text-sm text-[#94A3B8] font-medium tracking-normal leading-tight">
                Total Overtime
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-[#081F38]/80 border border-[#00E5FF]/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(0,229,255,0.12)]">
                <CirclePlus className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 text-[#00E5FF] stroke-[1.8]" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3 md:mt-4 mb-2 sm:mb-3 md:mb-4">
              <p className="font-jakarta font-extrabold text-lg sm:text-2xl md:text-3xl text-white tracking-tight flex items-baseline gap-1 sm:gap-1.5">
                <span className="font-bold text-sm sm:text-lg md:text-2xl text-white select-none">৳</span>
                <span>{new Intl.NumberFormat('en-IN').format(statsData.overtimeAmount)}</span>
              </p>
            </div>
            <div>
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#081F38]/80 border border-[#0F365A] text-[#00E5FF]">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00E5FF] flex-shrink-0" />
                <span className="font-inter text-[10px] sm:text-xs font-medium">{statsData.overtimeHours} Hours</span>
              </div>
            </div>
          </div>

          {/* Card 4: Money Lent */}
          <div className="bg-[#020712] border-[1.5px] border-[#00C2FF] rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-5 md:p-6 flex flex-col justify-between shadow-[0_0_24px_rgba(0,194,255,0.12)]">
            <div className="flex items-start justify-between gap-1.5">
              <span className="font-inter text-[11px] sm:text-xs md:text-sm text-[#94A3B8] font-medium tracking-normal leading-tight">
                Money Lent
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-[#230F36]/80 border border-[#C084FC]/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(192,132,252,0.12)]">
                <HandCoins className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 text-[#C084FC] stroke-[1.8]" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3 md:mt-4 mb-2 sm:mb-3 md:mb-4">
              <p className="font-jakarta font-extrabold text-lg sm:text-2xl md:text-3xl text-white tracking-tight flex items-baseline gap-1 sm:gap-1.5">
                <span className="font-bold text-sm sm:text-lg md:text-2xl text-white select-none">৳</span>
                <span>{new Intl.NumberFormat('en-IN').format(statsData.moneyLent)}</span>
              </p>
            </div>
            <div className="flex items-center">
              <span className="font-inter text-[10px] sm:text-xs text-[#C084FC] font-normal leading-tight line-clamp-1">
                You're owed by {statsData.moneyLentCount} people
              </span>
            </div>
          </div>
        </div>

        {/* ── Monthly Payment Progress Bar Card ─────────────────────────────── */}
        <div className="w-full bg-[#020712] border-[1.5px] border-[#00C2FF] rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 md:p-6 flex flex-col gap-2.5 sm:gap-3.5 shadow-[0_0_24px_rgba(0,194,255,0.12)]">
          {/* Top row: Label + Month & Year | Percentage */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-inter font-medium text-xs sm:text-sm text-[#94A3B8]">
              Payment Progress — {currentMonthYear}
            </span>
            <span className="font-jakarta font-bold text-xs sm:text-sm text-white tracking-tight">
              {monthlyPercent}% Paid
            </span>
          </div>

          {/* Progress Track & Bar */}
          <div className="w-full h-2.5 sm:h-3 rounded-full bg-[#111C2B] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00C2FF] to-[#00F5A0] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,194,255,0.35)]"
              style={{ width: `${monthlyPercent}%` }}
            />
          </div>

          {/* Bottom row: Repaid / Remaining */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#94A3B8] font-inter">
            <span>৳ {new Intl.NumberFormat('en-IN').format(monthlyPaid)} repaid</span>
            <span>৳ {new Intl.NumberFormat('en-IN').format(monthlyRemaining)} remaining</span>
          </div>
        </div>

        {/* Current Loan Card */}
        <div className="w-full bg-[#020712] border-[1.5px] border-[#00C2FF] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 md:p-7 flex flex-col justify-between shadow-[0_0_24px_rgba(0,194,255,0.12)]">
          {/* Top row: Icon Badge + Titles | Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-[#081F38]/70 border border-[#0F3559] flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                <Coins className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-[#00E5FF] stroke-[1.8]" />
              </div>
              <div>
                <h3 className="font-jakarta font-bold text-base sm:text-lg md:text-xl text-white tracking-tight">
                  Current Loan
                </h3>
                <p className="font-inter text-[10px] sm:text-[11px] text-[#7DD3FC]/80 mt-0.5 font-normal">
                  Your active loan details at a glance
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#00F5A0] shadow-[0_0_10px_#00F5A0] flex-shrink-0" />
              <span className="font-inter font-semibold text-xs text-[#00F5A0]">
                {loanData.status}
              </span>
            </div>
          </div>

          {/* Middle Section: 2 Columns (Left ~54%, Right ~46%) */}
          <div className="grid grid-cols-[1.18fr_1fr] my-auto py-1 sm:py-1.5">
            {/* Left Column: Total Loan Amount */}
            <div className="flex flex-col justify-center pr-3 sm:pr-5 md:pr-7">
              <p className="font-inter text-[10px] sm:text-xs text-[#7DD3FC]/75 font-medium">
                Total Loan Amount
              </p>
              <div className="mt-0.5 sm:mt-1">
                <p className="font-jakarta font-extrabold text-2xl sm:text-3xl md:text-[2.35rem] text-white tracking-tight flex items-baseline gap-1 sm:gap-1.5">
                  <span className="font-bold text-lg sm:text-2xl md:text-3xl text-white select-none">৳</span>
                  <span>{new Intl.NumberFormat('en-IN').format(loanData.currentLoan)}</span>
                </p>
              </div>
            </div>

            {/* Right Column: Loan Time, Total Due, End Month */}
            <div className="flex flex-col border-l border-[#0E2845] pl-3 sm:pl-5 md:pl-7">
              {/* Row 1: Loan Time */}
              <div className="flex items-center gap-2 sm:gap-3 py-1 sm:py-1.5">
                <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#00E5FF] flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-inter text-[10px] sm:text-[11px] text-[#7DD3FC]/75 font-normal truncate">Loan Time</p>
                  <p className="font-jakarta font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                    {loanData.loanDuration ?? '6 months'}
                  </p>
                </div>
              </div>

              {/* Divider 1 */}
              <div className="w-full h-px bg-[#0E2845]" />

              {/* Row 2: Total Paid */}
              <div className="flex items-center gap-2 sm:gap-3 py-1 sm:py-1.5">
                <Coins className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#00E5FF] flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-inter text-[10px] sm:text-[11px] text-[#7DD3FC]/75 font-normal truncate">Total Paid</p>
                  <p className="font-jakarta font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                    ৳ {new Intl.NumberFormat('en-IN').format(loanData.totalPaid ?? 0)}
                  </p>
                </div>
              </div>

              {/* Divider 2 */}
              <div className="w-full h-px bg-[#0E2845]" />

              {/* Row 3: Total Due */}
              <div className="flex items-center gap-2 sm:gap-3 py-1 sm:py-1.5">
                <Receipt className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#00E5FF] flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-inter text-[10px] sm:text-[11px] text-[#7DD3FC]/75 font-normal truncate">Total Due</p>
                  <p className="font-jakarta font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                    ৳ {new Intl.NumberFormat('en-IN').format(loanData.totalDue ?? (loanData.currentLoan - (loanData.totalPaid ?? 0)))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal divider line */}
          <div className="w-full h-px bg-[#0E2845] my-1 sm:my-1.5" />

          {/* Bottom Row: Next Payment Amount | Next Payment Date */}
          <div className="grid grid-cols-[1.18fr_1fr] items-center pt-0.5">
            {/* Next Payment Amount */}
            <div className="flex items-center gap-2 sm:gap-3 pr-3 sm:pr-5 md:pr-7">
              <CreditCard className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#00E5FF] flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-inter text-[10px] sm:text-[11px] text-[#7DD3FC]/75 font-normal truncate">Next Payment Amount</p>
                <p className="font-jakarta font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                  ৳ {new Intl.NumberFormat('en-IN').format(loanData.nextPaymentAmount ?? 4167)}
                </p>
              </div>
            </div>

            {/* Next Payment Date */}
            <div className="flex items-center gap-2 sm:gap-3 border-l border-[#0E2845] pl-3 sm:pl-5 md:pl-7">
              <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#00E5FF] flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-inter text-[10px] sm:text-[11px] text-[#7DD3FC]/75 font-normal truncate">Next Payment Date</p>
                <p className="font-jakarta font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                  {loanData.nextPaymentDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility Row (Directly on pure black canvas) */}
        {loanData.isEligibleForAnotherLoan && (
          <div className="w-full flex items-center justify-between px-1 gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#22D3EE] flex-shrink-0" />
              <span className="font-jakarta font-semibold text-white text-xs sm:text-sm md:text-base tracking-tight whitespace-nowrap">
                See if you're eligible for another loan
              </span>
            </div>
            <button
              onClick={() => _props?.onNavigate?.('plans')}
              className="group font-inter font-medium text-xs sm:text-sm text-[#22D3EE] hover:text-[#38BDF8] flex items-center gap-1 sm:gap-1.5 transition-colors focus:outline-none cursor-pointer flex-shrink-0 whitespace-nowrap"
            >
              <span>Check Now</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
