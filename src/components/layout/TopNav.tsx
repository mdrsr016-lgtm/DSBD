import { Landmark, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';

export function TopNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="w-full flex items-center justify-between px-6 md:px-12 py-4 glass-card z-50 border-t-0 border-x-0 rounded-none relative">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-premium-cyan/20 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <Landmark className="w-5 h-5 text-premium-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        </div>
        <span className="font-bold text-lg text-icy-white tracking-wide">
          Trust<span className="text-premium-cyan">Bank</span>
        </span>
      </div>

      {/* Profile & Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
        >
          <img 
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-white/10"
          />
          <span className="text-sm font-medium text-icy-white ml-1 mr-1">Ayesha S.</span>
          <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 glass-card rounded-xl py-2 flex flex-col gap-1 overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <button className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-icy-white hover:bg-white/10 transition-colors w-full text-left">
              <User className="w-4 h-4" />
              My Profile
            </button>
            <button className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-icy-white hover:bg-white/10 transition-colors w-full text-left">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <div className="h-[1px] bg-white/10 my-1 w-full" />
            <button className="flex items-center gap-3 px-4 py-2 text-sm text-neon-rose hover:bg-neon-rose/10 transition-colors w-full text-left group">
              <LogOut className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(255,77,109,0.8)]" />
              <span className="group-hover:text-glow-rose">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
