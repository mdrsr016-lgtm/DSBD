import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { MemberDashboard } from './pages/MemberDashboard';
import { TopNav } from './components/layout/TopNav';
import { BottomNav } from './components/layout/BottomNav';

// ── Tab order (must match BottomNav ids) ──────────────────────────────────────
const TABS = ['dashboard', 'budget', 'plans', 'notifications', 'profile'];

// Minimum horizontal distance (px) to register as a swipe
const SWIPE_THRESHOLD = 50;
// Maximum vertical drift (px) — prevents triggering on vertical scrolls
const SWIPE_MAX_VERTICAL = 80;

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab]   = useState('dashboard');
  const [swipeDir, setSwipeDir]     = useState<'left' | 'right'>('left');

  // touch tracking refs (no re-renders)
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  if (!user) return <LoginPage />;

  const currentIndex = TABS.indexOf(activeTab);

  const navigateTo = (tab: string, dir?: 'left' | 'right') => {
    const newIndex = TABS.indexOf(tab);
    const direction = dir ?? (newIndex > currentIndex ? 'left' : 'right');
    setSwipeDir(direction);
    setActiveTab(tab);
  };

  // ── Touch handlers ─────────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);

    if (Math.abs(dx) < SWIPE_THRESHOLD || dy > SWIPE_MAX_VERTICAL) return;

    if (dx < 0 && currentIndex < TABS.length - 1) {
      // swipe left → next tab
      navigateTo(TABS[currentIndex + 1], 'left');
    } else if (dx > 0 && currentIndex > 0) {
      // swipe right → previous tab
      navigateTo(TABS[currentIndex - 1], 'right');
    }
  };

  // ── Slide animation variants ───────────────────────────────────────────────
  const variants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen w-full bg-deep-black relative overflow-hidden flex flex-col items-center">
      {/* Background Orbs */}
      <div className="blob-cyan absolute top-[-5%] right-[-10%] md:top-[5%] md:right-[15%] w-[300px] h-[300px] md:w-[500px] md:h-[500px]" />
      <div className="blob-rose absolute bottom-[-5%] left-[-10%] md:bottom-[10%] md:left-[10%] w-[350px] h-[350px] md:w-[600px] md:h-[600px]" />
      <div className="absolute inset-0 backdrop-blur-[80px] z-0 pointer-events-none" />

      {/* Top Navigation */}
      <TopNav onNavigate={(tab) => navigateTo(tab)} />

      {/* Swipe-able Page Area */}
      <div
        className="app-container relative z-10 flex flex-col flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" custom={swipeDir}>
          <motion.main
            key={activeTab}
            custom={swipeDir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
            className="px-4 md:px-8 py-4 pb-36 flex-1 w-full"
          >
            {activeTab === 'profile'   && <ProfilePage />}
            {activeTab === 'dashboard' && <MemberDashboard />}

            {/* Placeholder for unbuilt tabs */}
            {activeTab !== 'profile' && activeTab !== 'dashboard' && (
              <div className="flex flex-col items-center justify-center h-48 gap-3 mt-12">
                <p className="text-white/20 text-sm capitalize font-medium">
                  {activeTab} page coming soon
                </p>
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
