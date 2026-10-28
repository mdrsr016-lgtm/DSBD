import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { MemberDashboard } from './pages/MemberDashboard';
import { TopNav } from './components/layout/TopNav';
import { BottomNav } from './components/layout/BottomNav';

// ── Tab order ─────────────────────────────────────────────────────────────────
const TABS = ['dashboard', 'budget', 'plans', 'notifications', 'profile'];
const SWIPE_THRESHOLD   = 48;
const SWIPE_MAX_VERTICAL = 75;

// ── Page transition variants ──────────────────────────────────────────────────
const pageVariants = {
  enter: (dir: 'left' | 'right') => ({
    x: dir === 'left' ? '60%' : '-60%',
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: 'left' | 'right') => ({
    x: dir === 'left' ? '-60%' : '60%',
    opacity: 0,
    scale: 0.97,
  }),
};

const pageTransition = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 36,
  mass: 0.85,
};

// ─────────────────────────────────────────────────────────────────────────────
function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [swipeDir, setSwipeDir]   = useState<'left' | 'right'>('left');

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  if (!user) return <LoginPage />;

  const currentIndex = TABS.indexOf(activeTab);

  const navigateTo = (tab: string, dir?: 'left' | 'right') => {
    const newIndex  = TABS.indexOf(tab);
    const direction = dir ?? (newIndex > currentIndex ? 'left' : 'right');
    setSwipeDir(direction);
    setActiveTab(tab);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) < SWIPE_THRESHOLD || dy > SWIPE_MAX_VERTICAL) return;
    if (dx < 0 && currentIndex < TABS.length - 1) navigateTo(TABS[currentIndex + 1], 'left');
    else if (dx > 0 && currentIndex > 0)          navigateTo(TABS[currentIndex - 1], 'right');
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white relative overflow-x-hidden flex flex-col items-center transition-colors duration-300">

      {/* Atmospheric ambient background glows for both light and dark modes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-400/10 dark:bg-cyan-500/[0.07] blur-[120px] transition-colors duration-500" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-teal-400/10 dark:bg-teal-500/[0.05] blur-[120px] transition-colors duration-500" />
      </div>

      {/* Top Navigation */}
      <TopNav onNavigate={(tab) => navigateTo(tab)} />

      {/* Swipeable Page Area */}
      <div
        className="app-container relative z-10 flex flex-col flex-1 overflow-x-hidden overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" custom={swipeDir}>
          <motion.main
            key={activeTab}
            custom={swipeDir}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-4 pb-36 flex-1"
          >
            {activeTab === 'dashboard' && <MemberDashboard onNavigate={(tab) => navigateTo(tab)} />}
            {activeTab === 'profile'   && <ProfilePage />}

            {activeTab !== 'dashboard' && activeTab !== 'profile' && (
              <div className="flex flex-col items-center justify-center h-64 gap-2 mt-8">
                <p className="text-4xl">🚧</p>
                <p className="text-slate-500 dark:text-white/30 text-sm capitalize font-semibold tracking-wide mt-1">
                  {activeTab}
                </p>
                <p className="text-slate-400 dark:text-white/15 text-xs">Coming soon</p>
              </div>
            )}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => navigateTo(tab)}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeToggle />
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
