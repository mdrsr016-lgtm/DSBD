import { LayoutDashboard, Wallet, Target, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'budget',        icon: Wallet,           label: 'Budget ৳' },
    { id: 'plans',         icon: Target,           label: 'Plans' },
    { id: 'notifications', icon: Bell,             label: 'Alerts' },
    { id: 'profile',       icon: User,             label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center justify-between w-[94vw] max-w-[460px] p-2 bg-white/90 dark:bg-[#090D14]/90 backdrop-blur-2xl rounded-[2rem] shadow-xl dark:shadow-2xl border border-slate-200/80 dark:border-white/10 relative overflow-hidden mx-auto transition-colors duration-200">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              layout
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex items-center justify-center h-12 rounded-full transition-colors duration-200 z-10 select-none ${
                isActive
                  ? 'text-white dark:text-[#1A1A24] w-[136px]'
                  : 'text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white w-12'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-sky-500 dark:bg-[#E2E2E2] rounded-full -z-10 shadow-md dark:shadow-none"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <Icon
                className={`w-[22px] h-[22px] flex-shrink-0 transition-transform duration-200 ${
                  isActive ? 'stroke-[2.5px]' : 'stroke-2'
                }`}
              />

              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="ml-2 text-xs font-bold tracking-tight whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
