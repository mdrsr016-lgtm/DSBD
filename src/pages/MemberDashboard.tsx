import { motion } from 'framer-motion';
import { Sun, Sunrise, Sunset, Moon, ShieldCheck, Coins, Clock, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MEMBER_LOAN_DATA } from '../data/memberFinancials';

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
        <TimeIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />

        {/* Time of Day Label in white */}
        <span className="font-inter font-semibold text-white text-sm sm:text-base tracking-normal">
          {timeConfig.label}
        </span>

        {/* Subtle Vertical Divider */}
        <span className="text-slate-700 font-light select-none text-sm mx-0.5">|</span>

        {/* Date in Secondary Text */}
        <span className="font-inter font-normal text-xs sm:text-sm text-slate-400 tracking-normal">
          {formattedDate}
        </span>
      </motion.div>

      {/* ── B. Greeting & Customer Name ─────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="mt-4 sm:mt-5">
        {/* Greeting in medium-weight Inter */}
        <p className="font-inter text-2xl sm:text-3xl md:text-[2rem] font-medium text-[#F8FAFC] tracking-tight leading-tight">
          {timeConfig.greeting},
        </p>

        {/* Customer's Name in massive bold Plus Jakarta Sans with vibrant flat gradient */}
        <h1 className="font-jakarta font-extrabold text-[2.75rem] sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5rem] tracking-tight leading-[1.15] mt-1 sm:mt-1.5">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 inline-block pb-3 sm:pb-4 -mb-3 sm:-mb-4 pr-2">
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide font-inter bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
          {/* Small green circular status indicator */}
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          <span>Active Account</span>
        </div>

        {/* Subtle Vertical Divider */}
        <span className="text-slate-700 font-light select-none text-sm">|</span>

        {/* 2. Verified Member */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F8FAFC] font-inter">
          <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>Verified Member</span>
        </div>
      </motion.div>

      {/* ── D. Welcome Message & Accent Line ──────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 sm:gap-4 mt-5 sm:mt-6"
      >
        <p className="font-inter text-sm sm:text-base md:text-[1.05rem] text-slate-300 font-normal tracking-normal leading-normal">
          Welcome to {user.role === 'founder' || user.role === 'admin' ? 'Grow fin' : 'TrustBank'}
        </p>

        {/* Vibrant flat accent line beside the message */}
        <div className="h-[3px] w-24 sm:w-32 md:w-40 rounded-full flex-shrink-0 bg-gradient-to-r from-sky-400 to-teal-400/20" />
      </motion.div>

      {/* ── E. Member-Only Section: Current Loan & Eligibility Banner ─── */}
      {user.role === 'member' && (
        <motion.div variants={fadeUp} className="mt-8 sm:mt-10 flex flex-col gap-5 w-full max-w-[800px]">
          {/* Current Loan Card */}
          <div className="w-full bg-[#0F172A] border border-slate-800 rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 md:p-7 flex flex-col justify-between">
            {/* Top row: Icon Badge + Titles | Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                  <Coins className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-cyan-400 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="font-jakarta font-bold text-base sm:text-lg md:text-xl text-white tracking-tight">
                    Current Loan
                  </h3>
                  <p className="font-inter text-[10px] sm:text-[11px] text-slate-400 mt-0.5 font-normal">
                    Your active loan details at a glance
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="font-inter font-semibold text-xs text-emerald-400">
                  {loanData.status}
                </span>
              </div>
            </div>

            {/* Middle Section: 2 Columns (Left ~54%, Right ~46%) */}
            <div className="grid grid-cols-[1.18fr_1fr] my-auto py-1 sm:py-1.5">
              {/* Left Column: Total Loan Amount */}
              <div className="flex flex-col justify-center pr-3 sm:pr-5 md:pr-7">
                <p className="font-inter text-[10px] sm:text-xs text-slate-400 font-medium">
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
              <div className="flex flex-col border-l border-slate-800 pl-3 sm:pl-5 md:pl-7">
                {/* Row 1: Loan Time */}
                <div className="flex items-center gap-2 sm:gap-3 py-1 sm:py-1.5">
                  <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-inter text-[10px] sm:text-[11px] text-slate-400 font-normal truncate">Loan Time</p>
                    <p className="font-jakarta font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                      {loanData.loanDuration ?? '6 months'}
                    </p>
                  </div>
                </div>

                {/* Divider 1 */}
                <div className="w-full h-px bg-slate-800" />

                {/* Row 2: Total Due */}
                <div className="flex items-center gap-2 sm:gap-3 py-1 sm:py-1.5">
                  <Coins className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-inter text-[10px] sm:text-[11px] text-slate-400 font-normal truncate">Total Due</p>
                    <p className="font-jakarta font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                      ৳ {new Intl.NumberFormat('en-IN').format(loanData.totalDue ?? loanData.currentLoan)}
                    </p>
                  </div>
                </div>

                {/* Divider 2 */}
                <div className="w-full h-px bg-slate-800" />

                {/* Row 3: End Month */}
                <div className="flex items-center gap-2 sm:gap-3 py-1 sm:py-1.5">
                  <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-inter text-[10px] sm:text-[11px] text-slate-400 font-normal truncate">End Month</p>
                    <p className="font-jakarta font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                      {loanData.endMonth ?? 'May 15, 2026'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal divider line */}
            <div className="w-full h-px bg-slate-800 my-1 sm:my-1.5" />

            {/* Bottom Row: Next payment | Due date */}
            <div className="grid grid-cols-[1.18fr_1fr] items-center pt-0.5">
              {/* Next payment */}
              <div className="flex items-center gap-2 sm:gap-3 pr-3 sm:pr-5 md:pr-7">
                <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-inter text-[10px] sm:text-[11px] text-slate-400 font-normal truncate">Next payment</p>
                  <p className="font-jakarta font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                    ৳ {new Intl.NumberFormat('en-IN').format(loanData.nextPaymentAmount ?? 4167)}
                  </p>
                </div>
              </div>

              {/* Due date */}
              <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-800 pl-3 sm:pl-5 md:pl-7">
                <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-inter text-[10px] sm:text-[11px] text-slate-400 font-normal truncate">Due date</p>
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
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                <span className="font-jakarta font-semibold text-white text-xs sm:text-sm md:text-base tracking-tight whitespace-nowrap">
                  See if you're eligible for another loan
                </span>
              </div>
              <button
                onClick={() => _props?.onNavigate?.('plans')}
                className="group font-inter font-medium text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 sm:gap-1.5 transition-colors focus:outline-none cursor-pointer flex-shrink-0 whitespace-nowrap"
              >
                <span>Check Now</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
