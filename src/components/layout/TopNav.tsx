import { Landmark, TrendingUp, ChevronDown, LogOut, Settings, User } from 'lucide-react';
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
  const isManagement = user?.role === 'founder' || user?.role === 'admin';

  return (
    <header className="w-full z-50 relative pointer-events-none bg-transparent">
      <div className="w-full max-w-6xl mx-auto flex items-start justify-between px-6 sm:px-8 lg:px-12 py-5 sm:py-6">
        {/* Logo & Title */}
        <div className="flex flex-col items-start pointer-events-auto cursor-pointer" onClick={() => onNavigate?.('dashboard')}>
          <div className="flex items-center gap-2.5 sm:gap-3">
            {isManagement ? (
              <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-[#22D3EE] flex-shrink-0" />
            ) : (
              <Landmark className="w-7 h-7 sm:w-8 sm:h-8 text-[#22D3EE] flex-shrink-0" />
            )}
            <span className="font-jakarta font-extrabold text-2xl sm:text-[1.75rem] text-white tracking-tight leading-none">
              {isManagement ? (
                <>
                  Grow <span className="text-[#22D3EE]">fin</span>
                </>
              ) : (
                <>
                  Trust<span className="text-[#22D3EE]">Bank</span>
                </>
              )}
            </span>
          </div>
          {!isManagement && (
            <p className="font-inter text-[11px] sm:text-xs text-[#64748B] mt-1.5 tracking-tight">
              Developed By <span className="text-[#94A3B8] font-medium">Dhaka Bank PLC</span>
            </p>
          )}
        </div>

        {/* Profile & Dropdown */}
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/[0.04] transition-colors focus:outline-none"
            aria-label="User menu"
          >
            <img
              src={user?.avatar ?? 'https://i.pravatar.cc/150?u=default'}
              alt={user?.name ?? 'Profile'}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#22D3EE]/60 object-cover"
            />
            <div className="flex flex-col items-start text-left">
              <span className="font-jakarta text-sm sm:text-base font-bold text-white leading-tight">
                {user ? user.name.split(' ')[0] : 'Guest'}
              </span>
              <span className="font-inter text-xs font-normal text-[#94A3B8] capitalize leading-tight">
                {user?.role ?? 'Member'}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#94A3B8] transition-transform duration-300 ml-0.5 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 mt-3 w-52 bg-[#090D14] backdrop-blur-xl border border-white/10 rounded-xl p-1.5 flex flex-col gap-1 shadow-2xl z-50 transition-all duration-200 ease-in-out origin-top ${
              isDropdownOpen
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}
          >
            {/* User info block */}
            {user && (
              <div
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5"
                style={{ background: colors?.bg ?? 'rgba(255,255,255,0.05)' }}
              >
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight truncate">{user.name}</p>
                  <p className="text-[10px] capitalize font-bold" style={{ color: colors?.text ?? '#22D3EE' }}>
                    {user.role}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={() => { setIsDropdownOpen(false); onNavigate?.('profile'); }}
              className="flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors w-full text-left rounded-lg"
            >
              <User className="w-4 h-4" />
              My Profile
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors w-full text-left rounded-lg">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <div className="h-[1px] bg-white/10 my-1 mx-1" />
            <button
              onClick={() => { setIsDropdownOpen(false); logout(); }}
              className="flex items-center gap-3 px-3 py-2 text-sm text-neon-rose hover:bg-neon-rose/10 transition-colors w-full text-left group rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
