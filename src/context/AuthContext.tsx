import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('brightmind_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      localStorage.removeItem('brightmind_token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (data: any) => {
    const res = await authApi.login(data);
    if (res.data.success && res.data.token) {
      localStorage.setItem('brightmind_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    if (res.data.success && res.data.token) {
      localStorage.setItem('brightmind_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue cleanup regardless of network error
    }
    // Comprehensive security purge: tokens, localStorage, sessionStorage, and client cookies
    const currentTheme = localStorage.getItem('living_light_frontend_theme');
    localStorage.removeItem('brightmind_token');
    localStorage.clear();
    sessionStorage.clear();
    if (currentTheme) {
      localStorage.setItem('living_light_frontend_theme', currentTheme);
    }
    try {
      document.cookie.split(';').forEach((c) => {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
    } catch {}
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateUser: (updatedUser: User) => setUser(updatedUser),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
