import { useState, type FormEvent } from 'react';
import { Landmark, Eye, EyeOff, Zap, ChevronDown, ChevronUp, Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS, ROLE_COLORS, type DemoUser } from '../data/demoAccounts';

// ─── Role group labels ────────────────────────────────────────
const SYSTEM_ROLES  = ['founder', 'admin'];
const CLIENT_ROLES  = ['manager', 'cashier', 'investor', 'member'];

export function LoginPage() {
  const { login, loginAs } = useAuth();

  // form state
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [shaking, setShaking]   = useState(false);

  // quick-login panel
  const [panelOpen, setPanelOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(email, password)) {
      setError('Invalid email or password.');
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  const quickLogin = (account: DemoUser) => {
    loginAs(account);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white flex items-center justify-center relative overflow-hidden p-4 transition-colors duration-300">

      {/* Atmospheric ambient background glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-cyan-400/15 dark:bg-cyan-500/[0.08] blur-[100px] transition-colors duration-500" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-teal-400/15 dark:bg-teal-500/[0.06] blur-[100px] transition-colors duration-500" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col gap-5">
        {/* ── Logo ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 mb-2"
        >
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md dark:shadow-none transition-colors duration-200">
            <Landmark className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-icy-white tracking-tight">
              Trust<span className="text-cyan-500 dark:text-cyan-400">Bank</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-white/40 mt-1">Sign in to your account</p>
          </div>
        </motion.div>

        {/* ── Login Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xl dark:shadow-2xl transition-all ${shaking ? 'animate-shake' : ''}`}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-widest">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus-within:border-cyan-500 focus-within:bg-white dark:focus-within:bg-white/[0.07] transition-all">
                <Mail className="w-4 h-4 text-slate-400 dark:text-white/30 flex-shrink-0" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@trustbank.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-slate-900 dark:text-icy-white text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-white/20"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-widest">Password</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus-within:border-cyan-500 focus-within:bg-white dark:focus-within:bg-white/[0.07] transition-all">
                <Lock className="w-4 h-4 text-slate-400 dark:text-white/30 flex-shrink-0" />
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-slate-900 dark:text-icy-white text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-white/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/70 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-rose-500 dark:text-rose-400 text-xs font-medium text-center -mt-1"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-cyan-500 text-white dark:text-black hover:bg-cyan-400 active:scale-95 transition-all shadow-md"
            >
              Sign In
            </button>
          </form>
        </motion.div>

        {/* ── Quick Login Panel (DEMO ONLY) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-md dark:shadow-none transition-colors duration-200"
        >
          {/* Header toggle */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
              <span className="text-sm font-semibold text-slate-800 dark:text-white/80">Quick Login</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 font-bold tracking-wide">DEMO</span>
            </div>
            {panelOpen
              ? <ChevronUp className="w-4 h-4 text-slate-400 dark:text-white/40" />
              : <ChevronDown className="w-4 h-4 text-slate-400 dark:text-white/40" />}
          </button>

          <AnimatePresence>
            {panelOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 flex flex-col gap-3">
                  {/* System roles */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/30 font-semibold mb-2 px-1">⚙ System</p>
                    <div className="grid grid-cols-2 gap-2">
                      {DEMO_ACCOUNTS.filter(a => SYSTEM_ROLES.includes(a.role)).map(account => (
                        <QuickLoginCard key={account.id} account={account} onLogin={quickLogin} />
                      ))}
                    </div>
                  </div>

                  {/* Client roles */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/30 font-semibold mb-2 px-1">👥 Clients</p>
                    <div className="grid grid-cols-2 gap-2">
                      {DEMO_ACCOUNTS.filter(a => CLIENT_ROLES.includes(a.role)).map(account => (
                        <QuickLoginCard key={account.id} account={account} onLogin={quickLogin} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Shake keyframe injected inline */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}

// ─── Quick Login Card ──────────────────────────────────────────
function QuickLoginCard({ account, onLogin }: { account: DemoUser; onLogin: (a: DemoUser) => void }) {
  const colors = ROLE_COLORS[account.role];
  return (
    <button
      onClick={() => onLogin(account)}
      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 transition-all duration-200 hover:bg-slate-100/50 dark:hover:bg-white/5 active:scale-95 text-left shadow-sm dark:shadow-none"
      style={{
        background: colors.bg,
      }}
    >
      <img src={account.avatar} alt={account.name} className="w-8 h-8 rounded-full flex-shrink-0 border border-slate-200 dark:border-white/15 object-cover" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-900 dark:text-icy-white truncate leading-tight">{account.name.split(' ')[0]}</p>
        <p
          className="text-[10px] font-bold capitalize"
          style={{ color: colors.text }}
        >
          {account.role}
        </p>
      </div>
    </button>
  );
}
