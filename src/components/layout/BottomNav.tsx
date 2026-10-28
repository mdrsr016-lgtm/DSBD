import { LayoutDashboard, Wallet, Target, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <nav className="flex items-center justify-between w-[94vw] max-w-[460px] p-2 bg-[#0F172A] rounded-[2rem] border border-slate-800 relative overflow-hidden mx-auto">
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
                  ? 'text-[#1A1A24] w-[136px]'
                  : 'text-white/60 hover:text-white w-12'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-[#E2E2E2] rounded-full -z-10"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <Icon
                className={`w-[22px] h-[22px] flex-shrink-0 transition-transform duration-200 ${
                  isActive ? 'stroke-[2.5px]' : 'stroke-2'
                }`}
              />

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="font-inter font-semibold text-[14px] ml-2 whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
