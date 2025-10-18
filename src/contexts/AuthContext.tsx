import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
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

// Dummy users for demo
const dummyUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'राम शर्मा',
    email: 'ram@farmer.com',
    password: 'farmer123',
    phone: '+91-9876543210',
    location: 'Maharashtra, India',
    language: 'hindi',
    farmSize: 5.5,
    crops: ['rice', 'wheat', 'sugarcane']
  },
  {
    id: '2',
    name: 'Priya Nair',
    email: 'priya@farmer.com',
    password: 'farmer123',
    phone: '+91-9876543211',
    location: 'Kerala, India',
    language: 'malayalam',
    farmSize: 3.2,
    crops: ['coconut', 'pepper', 'cardamom']
  },
  {
    id: '3',
    name: 'Harpreet Singh',
    email: 'harpreet@farmer.com',
    password: 'farmer123',
    phone: '+91-9876543212',
    location: 'Punjab, India',
    language: 'punjabi',
    farmSize: 12.8,
    crops: ['wheat', 'rice', 'cotton']
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('FarmConnect_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For OTP-based login, password will be 'otp_verified'
    if (password === 'otp_verified') {
      // Find user by email or phone
      const foundUser = dummyUsers.find(u => u.email === identifier || u.phone === identifier);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('FarmConnect_user', JSON.stringify(userWithoutPassword));
        setLoading(false);
        return true;
      }
    } else {
      // Legacy password-based login for demo accounts
      const foundUser = dummyUsers.find(u => u.email === identifier && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('FarmConnect_user', JSON.stringify(userWithoutPassword));
        setLoading(false);
        return true;
      }
    }
    
    setLoading(false);
    return false;
  };

  const register = async (userData: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists (by email or phone)
    const existingUser = dummyUsers.find(u => 
      u.email === userData.email || 
      (userData.phone && u.phone === userData.phone)
    );
    
    if (existingUser) {
      setLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || 'New Farmer',
      email: userData.email,
      phone: userData.phone || '',
      location: userData.location || 'India',
      language: userData.language || 'hindi',
      farmSize: userData.farmSize || 0,
      crops: userData.crops || []
    };
    
    // Add to dummy users for future logins
    dummyUsers.push({...newUser, password: userData.password});
    
    setUser(newUser);
    localStorage.setItem('FarmConnect_user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('FarmConnect_user');
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