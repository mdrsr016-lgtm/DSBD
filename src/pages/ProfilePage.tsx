import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Calendar, Shield,
  Edit3, LogOut, ChevronRight, Star, Briefcase,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_COLORS } from '../data/demoAccounts';

// ── Role-specific descriptions ──────────────────────────────────────────────
const ROLE_META: Record<string, { icon: string; description: string; permissions: string[] }> = {
  founder: {
    icon: '👑',
    description: 'Full ownership and unrestricted access to every module in the system.',
    permissions: ['Full system access', 'Manage all users', 'Financial reports', 'System settings', 'Audit logs'],
  },
  admin: {
    icon: '🛡️',
    description: 'Manages users, roles, and platform configuration on behalf of the founder.',
    permissions: ['User management', 'Role assignment', 'System settings', 'View reports'],
  },
  manager: {
    icon: '📊',
    description: 'Oversees day-to-day operations, team activity, and client reporting.',
    permissions: ['View reports', 'Manage team', 'Client oversight', 'Approve requests'],
  },
  cashier: {
    icon: '💳',
    description: 'Processes transactions, payments, and manages daily cash flow.',
    permissions: ['Process payments', 'View transactions', 'Daily cash report', 'Issue receipts'],
  },
  investor: {
    icon: '📈',
    description: 'Tracks portfolio performance, returns, and investment analytics.',
    permissions: ['View portfolio', 'Track returns', 'Investment reports', 'Market analytics'],
  },
  member: {
    icon: '🪪',
    description: 'Standard account holder with access to personal account features.',
    permissions: ['View balance', 'Transfer funds', 'Transaction history', 'Account settings'],
  },
};

// ── Fake profile details (demo) ─────────────────────────────────────────────
const PROFILE_DETAILS: Record<string, { phone: string; location: string; joined: string; stars: number }> = {
  'usr-001': { phone: '+880 171 000 0001', location: 'Dhaka, Bangladesh', joined: 'Jan 2024', stars: 5 },
  'usr-002': { phone: '+880 171 000 0002', location: 'Chittagong, Bangladesh', joined: 'Mar 2024', stars: 4 },
  'usr-003': { phone: '+880 171 000 0003', location: 'Sylhet, Bangladesh', joined: 'May 2024', stars: 4 },
  'usr-004': { phone: '+880 171 000 0004', location: 'Rajshahi, Bangladesh', joined: 'Jun 2024', stars: 3 },
  'usr-005': { phone: '+880 171 000 0005', location: 'Khulna, Bangladesh', joined: 'Aug 2024', stars: 5 },
  'usr-006': { phone: '+880 171 000 0006', location: 'Barishal, Bangladesh', joined: 'Sep 2024', stars: 3 },
};

// ── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

export function ProfilePage() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const colors  = ROLE_COLORS[user.role];
  const meta    = ROLE_META[user.role];
  const details = PROFILE_DETAILS[user.id];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.08 }}
      className="flex flex-col gap-5 max-w-xl mx-auto"
    >
      {/* ── Hero Card ─────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl overflow-hidden">
        {/* Colour banner */}
        <div
          className="h-24 w-full relative"
          style={{ background: `linear-gradient(135deg, ${colors.bg.replace('0.15','0.35')} 0%, rgba(6,9,15,0.6) 100%)` }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: `radial-gradient(circle at 30% 50%, ${colors.text} 0%, transparent 70%)` }}
          />
        </div>

        {/* Avatar overlapping banner */}
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl border-4 border-[#06090F] shadow-xl"
              />
              {/* Role emoji badge */}
              <span className="absolute -bottom-1.5 -right-1.5 text-lg leading-none">{meta.icon}</span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all">
              <Edit3 className="w-3 h-3" />
              Edit
            </button>
          </div>

          {/* Name & role */}
          <h2 className="text-xl font-bold text-icy-white leading-tight">{user.name}</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-xs font-bold capitalize px-2.5 py-0.5 rounded-full"
              style={{ background: colors.bg, color: colors.text, boxShadow: `0 0 10px ${colors.glow}` }}
            >
              {user.role}
            </span>
            {/* Star rating */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3"
                  fill={i < details.stars ? colors.text : 'transparent'}
                  stroke={i < details.stars ? colors.text : 'rgba(255,255,255,0.2)'}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-white/50 mt-3 leading-relaxed">{meta.description}</p>
        </div>
      </motion.div>

      {/* ── Contact Info ──────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-1">Contact Info</p>
        <InfoRow icon={Mail}     label="Email"    value={user.email} />
        <InfoRow icon={Phone}    label="Phone"    value={details.phone} />
        <InfoRow icon={MapPin}   label="Location" value={details.location} />
        <InfoRow icon={Calendar} label="Joined"   value={details.joined} />
      </motion.div>

      {/* ── Permissions ───────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4" style={{ color: colors.text }} />
          <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Permissions</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {meta.permissions.map((perm) => (
            <span
              key={perm}
              className="text-xs px-3 py-1 rounded-full font-medium border"
              style={{ background: colors.bg, color: colors.text, borderColor: colors.text + '30' }}
            >
              {perm}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── Account Actions ───────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl overflow-hidden">
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold px-5 pt-4 pb-2">Account</p>
        <ActionRow icon={Briefcase} label="Account Settings" />
        <ActionRow icon={Shield}    label="Security & Privacy" />
        <div className="h-px bg-white/5 mx-5" />
        <button
          onClick={logout}
          className="flex items-center gap-3 px-5 py-3.5 w-full text-sm text-neon-rose hover:bg-neon-rose/10 transition-colors group"
        >
          <LogOut className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(255,77,109,0.8)]" />
          <span>Logout</span>
        </button>
      </motion.div>

      {/* bottom spacing for BottomNav */}
      <div className="h-4" />
    </motion.div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-white/40" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-white/30 uppercase tracking-wide font-semibold">{label}</p>
        <p className="text-sm text-icy-white font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function ActionRow({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button className="flex items-center gap-3 px-5 py-3.5 w-full text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
      <Icon className="w-4 h-4 text-white/40" />
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className="w-4 h-4 text-white/20" />
    </button>
  );
}
