import { LayoutDashboard, Wallet, Target, Bell, User } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function BottomNav() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'budget', icon: Wallet, label: 'Budget ৳' },
    { id: 'plans', icon: Target, label: 'Plans' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center justify-between w-[94vw] max-w-[460px] p-2 bg-transparent backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/5 relative overflow-hidden mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              layout
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center justify-center h-12 rounded-full transition-colors duration-300 z-10 ${
                isActive 
                  ? 'text-[#1A1A24] px-5' 
                  : 'text-white/60 hover:text-white w-12'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-[#E2E2E2] rounded-full -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                />
              )}
              
              <Icon className={`w-[22px] h-[22px] flex-shrink-0 transition-colors duration-300 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              
              <motion.span 
                layout
                className={`font-semibold overflow-hidden whitespace-nowrap ${
                  isActive 
                    ? 'ml-2 opacity-100 text-[14px]' 
                    : 'w-0 ml-0 opacity-0 text-[0px]'
                }`}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              >
                {item.label}
              </motion.span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
