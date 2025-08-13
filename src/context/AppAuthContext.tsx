import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppAuthContext = createContext<AppAuthContextType | undefined>(undefined);

export const useAppAuth = (): AppAuthContextType => {
  const context = useContext(AppAuthContext);
  if (!context) {
    throw new Error('useAppAuth must be used within an AppAuthProvider');
  }
  return context;
};

interface AppAuthProviderProps {
  children: ReactNode;
}

export const AppAuthProvider: React.FC<AppAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await AsyncStorage.getItem('userAuthenticated');
      setIsAuthenticated(authStatus === 'true');
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
    setIsLoading(false);
  };

  const login = async () => {
    try {
      await AsyncStorage.setItem('userAuthenticated', 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth status:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userAuthenticated');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error removing auth status:', error);
      throw error;
    }
  };

  return (
    <AppAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AppAuthContext.Provider>
  );
};