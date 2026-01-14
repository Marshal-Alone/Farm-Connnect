import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  language: string;
  farmSize: number;
  crops: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = '/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by verifying token
    const token = localStorage.getItem('FarmConnect_token');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
      } else {
        // Token invalid, clear it
        localStorage.removeItem('FarmConnect_token');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('FarmConnect_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.data.user);
        localStorage.setItem('FarmConnect_token', data.data.token);
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const register = async (userData: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Clone response to try getting text if JSON fails
      const responseClone = response.clone();
      let data;
      try {
        data = await response.json();
      } catch (e) {
        const text = await responseClone.text();
        console.error('Failed to parse JSON response. Raw text:', text);
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.slice(0, 100)}...`);
      }

      if (response.ok && data.success) {
        setUser(data.data.user);
        localStorage.setItem('FarmConnect_token', data.data.token);
        setLoading(false);
        return true;
      } else {
        console.error('Registration failed:', data.error || 'Unknown error');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('FarmConnect_token');
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}