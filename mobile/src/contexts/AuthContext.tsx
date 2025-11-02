import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const checkAuth = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setIsAuthenticated(true);
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (token: string, userData: any) => {
    try {
      await Keychain.setGenericPassword('user', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Keychain.resetGenericPassword();
      await AsyncStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

