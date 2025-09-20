import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('petlove_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Optionally check for required fields, e.g. id or email
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Malformed user object, clear storage
          localStorage.removeItem('petlove_user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (e) {
        // Corrupted JSON, clear storage
        localStorage.removeItem('petlove_user');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false); // Always set loading to false after checking
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('petlove_user');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, setIsAuthenticated, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};