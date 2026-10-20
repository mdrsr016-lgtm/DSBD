import { Landmark, ChevronUp, LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_COLORS } from '../../data/demoAccounts';

interface TopNavProps {
  onNavigate?: (tab: string) => void;
}

export function TopNav({ onNavigate }: TopNavProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const colors = user ? ROLE_COLORS[user.role] : null;

  return (
    <header className="w-full flex items-center justify-between px-6 md:px-12 py-4 z-50 relative pointer-events-none bg-transparent">
      {/* Logo & Title */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="p-2 bg-premium-cyan/20 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <Landmark className="w-5 h-5 text-premium-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        </div>
        <span className="font-bold text-lg text-icy-white tracking-wide">
          Trust<span className="text-premium-cyan">Bank</span>
        </span>
      </div>

      {/* Profile & Dropdown */}
      <div className="relative pointer-events-auto">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1.5 md:gap-2 p-1 pr-2 md:pr-3 rounded-full bg-transparent backdrop-blur-md border border-white/10 hover:bg-white/5 transition-colors"
        >
          <img
            src={user?.avatar ?? 'https://i.pravatar.cc/150?u=default'}
            alt="Profile"
            className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10"
          />
          <div className="flex flex-col items-start">
            <span className="text-xs md:text-sm font-medium text-icy-white ml-0.5 md:ml-1 mr-0 md:mr-1 leading-tight">
              {user ? user.name.split(' ')[0] : 'Guest'}
            </span>
            {colors && (
              <span
                className="text-[10px] font-bold capitalize ml-0.5 md:ml-1 leading-tight"
                style={{ color: colors.text }}
              >
                {user?.role}
              </span>
            )}
          </div>
          <ChevronUp className={`w-3 h-3 md:w-4 md:h-4 text-white/60 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute right-0 mt-3 w-52 bg-transparent backdrop-blur-md border border-white/10 rounded-xl p-1.5 flex flex-col gap-1 shadow-2xl z-50 transition-all duration-200 ease-in-out origin-top ${
            isDropdownOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          {/* User info block */}
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5"
              style={{ background: colors?.bg }}
            >
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-xs font-semibold text-icy-white leading-tight">{user.name}</p>
                <p className="text-[10px] capitalize font-bold" style={{ color: colors?.text }}>{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => { setIsDropdownOpen(false); onNavigate?.('profile'); }}
            className="flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:text-icy-white hover:bg-white/10 transition-colors w-full text-left rounded-lg"
          >
            <User className="w-4 h-4" />
            My Profile
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:text-icy-white hover:bg-white/10 transition-colors w-full text-left rounded-lg">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <div className="h-[1px] bg-white/10 my-1 mx-1" />
          <button
            onClick={() => { setIsDropdownOpen(false); logout(); }}
            className="flex items-center gap-3 px-3 py-2 text-sm text-neon-rose hover:bg-neon-rose/10 transition-colors w-full text-left group rounded-lg"
          >
            <LogOut className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(255,77,109,0.8)]" />
            <span className="group-hover:text-glow-rose">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
