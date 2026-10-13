import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '../api/auth';
import { LOGOUT_EVENT } from '../api/http';
import type { AuthResponse } from '../types/auth';
import { AuthContext, type AuthContextValue } from './AuthContext';
import { clearSession, loadSession, saveSession } from './storage';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthResponse | null>(() => loadSession());

  useEffect(() => {
    const onLogout = () => setSession(null);
    window.addEventListener(LOGOUT_EVENT, onLogout);
    return () => window.removeEventListener(LOGOUT_EVENT, onLogout);
  }, []);

  const start = useCallback((auth: AuthResponse) => {
    saveSession(auth);
    setSession(auth);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => start(await authApi.login(email, password)),
    [start],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) =>
      start(await authApi.register(name, email, password)),
    [start],
  );

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user: session?.user ?? null, login, register, logout }),
    [session, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}