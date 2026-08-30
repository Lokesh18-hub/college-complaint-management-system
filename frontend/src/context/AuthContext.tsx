import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { authService, LoginResponse } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: Role | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (data: any) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ccms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ccms_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('ccms_token');
      if (storedToken) {
        try {
          const freshUser = await authService.getMe();
          setUser(freshUser);
          localStorage.setItem('ccms_user', JSON.stringify(freshUser));
        } catch (error) {
          console.error('Session expired or invalid:', error);
          localStorage.removeItem('ccms_token');
          localStorage.removeItem('ccms_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const res = await authService.login(email, password);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('ccms_token', res.token);
    localStorage.setItem('ccms_user', JSON.stringify(res.user));
    return res;
  };

  const register = async (data: any): Promise<LoginResponse> => {
    const res = await authService.register(data);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('ccms_token', res.token);
    localStorage.setItem('ccms_user', JSON.stringify(res.user));
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem('ccms_user', JSON.stringify(updated));
  };

  const refreshUser = async () => {
    try {
      const fresh = await authService.getMe();
      updateUser(fresh);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        role: user?.role || null,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
