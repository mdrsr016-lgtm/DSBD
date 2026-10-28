// ============================================================
//  DEMO ACCOUNTS  –  remove the quick-login panel before prod
// ============================================================

export type Role =
  | 'founder'
  | 'admin'
  | 'manager'
  | 'cashier'
  | 'investor'
  | 'member';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
  /** Short sentence shown in the quick-login card */
  tagline: string;
}

// ─── System / Management side ───────────────────────────────
export const DEMO_ACCOUNTS: DemoUser[] = [
  {
    id: 'usr-001',
    name: 'Aeysha Shahriyar',
    email: 'founder@trustbank.io',
    password: 'founder123',
    role: 'founder',
    avatar: 'https://i.pravatar.cc/150?u=founder001',
    tagline: 'Full system access & ownership',
  },
  {
    id: 'usr-002',
    name: 'Rafiq Hossain',
    email: 'admin@trustbank.io',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin002',
    tagline: 'Manages users & system settings',
  },

  // ─── Client side ─────────────────────────────────────────
  {
    id: 'usr-003',
    name: 'Nasrin Akter',
    email: 'manager@trustbank.io',
    password: 'manager123',
    role: 'manager',
    avatar: 'https://i.pravatar.cc/150?u=manager003',
    tagline: 'Oversees operations & reports',
  },
  {
    id: 'usr-004',
    name: 'Karim Uddin',
    email: 'cashier@trustbank.io',
    password: 'cashier123',
    role: 'cashier',
    avatar: 'https://i.pravatar.cc/150?u=cashier004',
    tagline: 'Handles transactions & payments',
  },
  {
    id: 'usr-005',
    name: 'Selim Chowdhury',
    email: 'investor@trustbank.io',
    password: 'investor123',
    role: 'investor',
    avatar: 'https://i.pravatar.cc/150?u=investor005',
    tagline: 'Monitors portfolios & returns',
  },
  {
    id: 'usr-006',
    name: 'Tania Begum',
    email: 'member@trustbank.io',
    password: 'member123',
    role: 'member',
    avatar: 'https://i.pravatar.cc/150?u=member006',
    tagline: 'Standard account holder',
  },
];

// Role badge colour map (inline styles used in components)
export const ROLE_COLORS: Record<Role, { bg: string; text: string; glow: string }> = {
  founder:  { bg: 'rgba(234,179,8,0.15)',   text: '#FACC15', glow: 'rgba(234,179,8,0.4)'   },
  admin:    { bg: 'rgba(139,92,246,0.15)',   text: '#A78BFA', glow: 'rgba(139,92,246,0.4)'  },
  manager:  { bg: 'rgba(34,211,238,0.15)',   text: '#22D3EE', glow: 'rgba(34,211,238,0.4)'  },
  cashier:  { bg: 'rgba(52,211,153,0.15)',   text: '#34D399', glow: 'rgba(52,211,153,0.4)'  },
  investor: { bg: 'rgba(251,146,60,0.15)',   text: '#FB923C', glow: 'rgba(251,146,60,0.4)'  },
  member:   { bg: 'rgba(248,250,252,0.10)',  text: '#CBD5E1', glow: 'rgba(248,250,252,0.2)' },
};
