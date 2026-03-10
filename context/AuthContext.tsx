import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL = 'https://backend-production-39372.up.railway.app';

const TOKEN_KEY = 'truckradar_token';
const USER_KEY = 'truckradar_user';

interface User {
  id: string;
  email: string;
  role: 'carrier' | 'shipper';
  phone?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try { return localStorage.getItem(key); } catch { return null; }
    }
    try { return await SecureStore.getItemAsync(key); } catch { return null; }
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try { localStorage.setItem(key, value); } catch {}
      return;
    }
    try { await SecureStore.setItemAsync(key, value); } catch {}
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try { localStorage.removeItem(key); } catch {}
      return;
    }
    try { await SecureStore.deleteItemAsync(key); } catch {}
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadStoredAuth(); }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await storage.getItem(TOKEN_KEY);
      const storedUser = await storage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Errore durante il login');
    }
    const data = await response.json();
    await storage.setItem(TOKEN_KEY, data.access_token);
    await storage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
  };

  const register = async (email: string, password: string, role: string, phone?: string) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, phone }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Errore durante la registrazione');
    }
    const data = await response.json();
    await storage.setItem(TOKEN_KEY, data.access_token);
    await storage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
  };

  const logout = async () => {
    await storage.removeItem(TOKEN_KEY);
    await storage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!token) throw new Error('Non autenticato');
    const response = await fetch(`${API_URL}/api/auth/delete-account`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Errore durante eliminazione account');
    }
    await logout();
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
