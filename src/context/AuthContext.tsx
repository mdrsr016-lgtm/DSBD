import { createContext, useContext, useState, type ReactNode } from 'react';
import { DEMO_ACCOUNTS, type DemoUser } from '../data/demoAccounts';

interface AuthContextValue {
  user: DemoUser | null;
  login: (email: string, password: string) => boolean;
  loginAs: (user: DemoUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);

  const login = (email: string, password: string): boolean => {
    const found = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
    );
    if (found) { setUser(found); return true; }
    return false;
  };

  const loginAs = (account: DemoUser) => setUser(account);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
