import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const isDark = theme === 'dark';

  return (
    <div className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-50 flex items-center">
      <motion.button
        type="button"
        onClick={toggleTheme}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={`group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2FF] ${
          isDark
            ? 'bg-[#020712]/90 border-[1.5px] border-[#00C2FF] text-[#00E5FF] shadow-[0_0_20px_rgba(0,194,255,0.35)] hover:shadow-[0_0_28px_rgba(0,194,255,0.6)]'
            : 'bg-white/95 border-[1.5px] border-[#0284C7] text-[#0284C7] shadow-[0_4px_20px_rgba(2,132,199,0.25)] hover:shadow-[0_6px_26px_rgba(2,132,199,0.4)]'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="flex items-center justify-center"
            >
              <Sun className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2] drop-shadow-[0_0_6px_#00E5FF]" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="flex items-center justify-center"
            >
              <Moon className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2] text-[#0284C7]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Hover tooltip label */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`hidden sm:flex items-center absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-medium font-inter whitespace-nowrap shadow-xl pointer-events-none ${
              isDark
                ? 'bg-[#081F38] border border-[#0F365A] text-white shadow-[0_0_16px_rgba(0,194,255,0.2)]'
                : 'bg-white border border-[#E2E8F0] text-[#0F172A] shadow-md'
            }`}
          >
            <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

