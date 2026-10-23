import { motion } from 'framer-motion';
import { Sun, Sunrise, Sunset, Moon, ShieldCheck, Database, Calendar, ArrowRight } from 'lucide-react';
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
        <h1 className="font-jakarta font-extrabold text-[2.75rem] sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5rem] tracking-tight leading-[1.05] mt-1 sm:mt-1.5">
          <span
            className="bg-clip-text text-transparent inline-block"
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
          Welcome to TrustBank
        </p>

        {/* Short, subtle cyan-to-teal accent line beside the message */}
        <div
          className="h-[3px] w-20 sm:w-28 md:w-36 rounded-full flex-shrink-0"
          style={{
            background: 'linear-gradient(90deg, #22D3EE 0%, rgba(20, 184, 166, 0.2) 100%)',
          }}
        />
      </motion.div>

      {/* ── E. Member-Only Section: Current Loan & Eligibility Banner ─── */}
      {user.role === 'member' && (
        <motion.div variants={fadeUp} className="mt-8 sm:mt-10 flex flex-col gap-5 w-full max-w-xl">
          {/* Current Loan Card */}
          <div className="w-full bg-[#03070E] border border-[#162A40] rounded-2xl p-5 sm:p-6 shadow-xl">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Database className="w-5 h-5 sm:w-6 sm:h-6 text-[#22D3EE] flex-shrink-0" />
                <h3 className="font-jakarta font-semibold text-white text-base sm:text-lg tracking-tight">
                  Current Loan
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0" />
                <span className="font-inter font-medium text-xs sm:text-sm text-[#10B981]">
                  {loanData.status}
                </span>
              </div>
            </div>

            {/* Loan Amount */}
            <div className="mt-4 sm:mt-5">
              <p className="font-jakarta font-bold text-3xl sm:text-[2.25rem] text-white tracking-tight flex items-baseline gap-1.5">
                <span className="font-semibold text-2xl sm:text-3xl select-none">৳</span>
                <span>{new Intl.NumberFormat('en-IN').format(loanData.currentLoan)}</span>
              </p>
            </div>

            {/* Subtle Divider Line */}
            <div className="w-full h-px bg-[#152336] my-4 sm:my-5" />

            {/* Bottom row: Next payment | Date */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-[#94A3B8]">
                <Calendar className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                <span className="font-inter font-normal">Next payment</span>
              </div>
              <span className="font-inter font-medium text-[#F8FAFC]">
                {loanData.nextPaymentDate}
              </span>
            </div>
          </div>

          {/* Eligibility Row (Directly on pure black canvas) */}
          {loanData.isEligibleForAnotherLoan && (
            <div className="w-full flex items-center justify-between px-1 flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#22D3EE] flex-shrink-0" />
                <span className="font-jakarta font-semibold text-white text-sm sm:text-base tracking-tight">
                  You're eligible for another loan
                </span>
              </div>
              <button
                onClick={() => _props?.onNavigate?.('plans')}
                className="group font-inter font-medium text-xs sm:text-sm text-[#22D3EE] hover:text-[#38BDF8] flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer"
              >
                <span>Check offer</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
