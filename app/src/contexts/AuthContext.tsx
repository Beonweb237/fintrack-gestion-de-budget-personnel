import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  currency: string;
  language: string;
  dateFormat: string;
  timezone: string;
  monthlyIncome?: number;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue {
  state: AuthState;
  user: AuthUser | null;
  isAuthenticated: boolean;
  updateUser: (updates: Partial<AuthUser>) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const defaultUser: AuthUser = {
  id: 'user-1',
  name: 'Alexandre Martin',
  email: 'alexandre.martin@email.fr',
  avatar: '/avatar-default.svg',
  bio: 'Full-stack developer & finance enthusiast. Tracking every penny since 2020.',
  phone: '+33 6 12 34 56 78',
  currency: 'USD',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timezone: 'Europe/Paris',
  monthlyIncome: 4200,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(defaultUser);
  const [isLoading, setIsLoading] = useState(false);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const login = useCallback(async (_email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setUser(defaultUser);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const state: AuthState = {
    user,
    isAuthenticated: !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        user,
        isAuthenticated: !!user,
        updateUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
